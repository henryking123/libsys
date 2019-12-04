const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Ticket = mongoose.model('Ticket')
const Book = mongoose.model('Book')
const User = mongoose.model('User')

// @route 	GET /tickets
// @desc 	 	Get current user's active tickets
// @access 	Current User
router.get('/', auth, async (req, res) => {
	try {
		await req.user.refreshTickets()
		res.send(req.user.tickets)
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	GET /tickets/all
// @desc 	 	Get current user's all tickets
// @access 	Current User
router.get('/all', auth, async (req, res) => {
	try {
		const tickets = await Ticket.paginate(
			{ borrower: req.user.id },
			{
				sort: { updatedAt: -1 },
				limit: 10,
				page: req.query.page,
				select: ['-borrower'],
				populate: { path: 'event_logs.by', select: 'name' }
			}
		)
		res.send(tickets)
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	GET /tickets/all/:option
// @desc 	 	Get tickets
// @access 	Admin
router.get('/all/:sort_order', auth, admin, async (req, res) => {
	try {
		let options = {}
		switch (req.params.sort_order) {
			// Backend Routes
			// > "/tickets/0" (all)
			// > "/tickets/1" (pickup)
			// > "/tickets/2" (borrow)
			// > "/tickets/3" (return)
			// > "/tickets/4" (active)
			// > "/tickets/5"  (ended)
			case '0':
				options = {}
				break
			case '1':
				options = { sort_order: 1 }
				break
			case '2':
				options = { sort_order: 2 }
				break
			case '3':
				options = { sort_order: 3 }
				break
			case '4':
				options = { sort_order: 4 }
				break
			case '5':
				options = { sort_order: 5 }
				break
			default:
				throw new Error('Invalid argument.')
		}

		const tickets = await Ticket.paginate(options, {
			select: ['-event_logs'],
			sort: { sort_order: 1, updatedAt: -1 },
			populate: { path: 'borrower', select: 'name' },
			limit: 10,
			page: req.query.page
		})
		res.send(tickets)
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

// @route 	GET /tickets/:ticket_id
// @desc 	 	Get ticket details
// @access 	Admin
router.get('/:ticket_id', auth, async (req, res) => {
	try {
		// If Admin or user is the owner of ticket, return Ticket
		const ticket = await Ticket.findById(req.params.ticket_id).populate({
			path: 'event_logs.by',
			select: ['name']
		})

		if (!ticket) throw new Error('Invalid ticket')

		if (!req.user.isAdmin && ticket.borrower.id.toString() !== req.user._id.toString())
			throw new Error('Invalid ticket')

		res.send(ticket)
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	GET /tickets/book/:book_id
// @desc 	 	Get tickets for specific book
// @access 	Admin
router.get('/book/:book_id', auth, admin, async (req, res) => {
	try {
		const tickets = await Ticket.find({ book: req.params.book_id })
			.select(['-event_logs', '-book'])
			.sort({ sort_order: 1, updatedAt: -1 })

		if (!tickets) throw new Error('Invalid book')

		res.send(tickets)
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	POST /accept
// @desc 	 	Accepting a borrow/return/pickup request
// @access 	Admin
router.post('/accept', auth, admin, async (req, res) => {
	try {
		const ticket = await Ticket.findOne({
			_id: req.body.ticket_id,
			sort_order: { $in: [1, 2, 3] }
		})
		if (!ticket) throw new Error('Ticket not valid')

		if (ticket.sort_order === 1) {
			await ticket.updateTicket({
				status: 'Borrowed',
				sort_order: 4,
				event: 'Given to Borrower',
				user_id: req.user.id
			})
			// Book gets picked up, add "from" to ticket
			ticket.from = Date.now()
			await ticket.save()

			res.send({
				header: 'Ticket has been accepted by admin. Book has been picked up.',
				content: `${ticket.borrower.name} has successfully borrowed the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 2) {
			// Check if book is available
			const book = await Book.findOne({ _id: ticket.book._id, available: { $gt: 0 } })
			if (!book) {
				await ticket.updateTicket({
					status: 'Book not available',
					sort_order: 5,
					event: 'Borrow Request Error',
					user_id: req.user.id
				})
				// Remove the item from user.tickets
				await User.findAndRemoveTicket(ticket.borrower, ticket._id)
				throw new Error(`Book titled "${ticket.book.title}" is not available.`)
			}
			// Check if user currently has the book
			const openTicket = await Ticket.find({
				borrower: req.user._id,
				sort_order: { $lt: 5, $ne: 2 },
				book: ticket.book._id,
				_id: { $ne: ticket._id }
			})

			if (openTicket.length > 0) {
				await ticket.updateTicket({
					status: 'Duplicate Request',
					sort_order: 5,
					event: 'Duplicate Request',
					user_id: req.user.id
				})
				// Remove the item from user.tickets
				await User.findAndRemoveTicket(ticket.borrower, ticket._id)
				throw new Error(
					`${ticket.borrower.name} has an active ticket for the book titled "${ticket.book.title}".`
				)
			}
			// If all is clear
			book.available -= 1
			await book.save()

			await ticket.updateTicket({
				status: 'For Pick Up',
				sort_order: 1,
				event: 'Accepted Borrow Request',
				user_id: req.user.id
			})

			res.send({
				header: 'Borrow ticket has been accepted by admin. Prepare the book for pickup.',
				content: `Accepted borrow request of ${ticket.borrower.name} for the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 3) {
			await ticket.updateTicket({
				status: 'Returned',
				sort_order: 5,
				event: 'Accepted Return Request',
				user_id: req.user.id
			})

			ticket.to = Date.now()
			await ticket.save()

			const book = await Book.findById(ticket.book._id)
			book.available += 1
			await book.save()

			// Remove the item from user.tickets
			await User.findAndRemoveTicket(ticket.borrower, ticket._id)
			res.send({
				header: 'Return ticket has been accepted by admin.',
				content: `Accepted return request of ${ticket.borrower.name} for the book titled "${ticket.book.title}".`
			})
		}

		res.send()
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	POST /decline
// @desc 	 	Declining a borrow/return/pickup request
// @access 	Admin
router.post('/decline', auth, admin, async (req, res) => {
	try {
		// Find the ticket
		const ticket = await Ticket.findOne({
			_id: req.body.ticket_id,
			sort_order: { $in: [1, 2, 3] }
		})
		if (!ticket) throw new Error('Ticket not valid')

		if (ticket.sort_order === 1) {
			await ticket.updateTicket({
				status: 'Declined (Pickup)',
				sort_order: 5,
				event: 'Declined Pickup',
				user_id: req.user.id
			})

			const book = await Book.findById(ticket.book._id)
			book.available += 1
			await book.save()

			// Remove the item from user.tickets
			await User.findAndRemoveTicket(ticket.borrower, ticket._id)

			res.send({
				header: 'Pick up request has been cancelled by admin.',
				content: `Declined pick up of ${ticket.borrower.name} for the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 2) {
			await ticket.updateTicket({
				status: 'Declined (Borrow)',
				sort_order: 5,
				event: 'Declined Borrow Request',
				user_id: req.user.id
			})
			// Remove the item from user.tickets
			await User.findAndRemoveTicket(ticket.borrower, ticket._id)
			res.send({
				header: 'Borrow ticket has been declined by admin.',
				content: `Declined borrow request of ${ticket.borrower.name} for the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 3) {
			await ticket.updateTicket({
				status: 'Declined (Return)',
				sort_order: 4,
				event: 'Declined Return Request',
				user_id: req.user.id
			})

			res.send({
				header: 'Return ticket has been declined by admin.',
				content: `Declined return request of ${ticket.borrower.name} for the book titled "${ticket.book.title}".`
			})
		}

		res.send()
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

// @route 	POST /cancel/
// @desc 	 	Canceling a ticket
// @access 	Owner of the ticket
router.post('/cancel/', auth, async (req, res) => {
	try {
		const ticket = await Ticket.findOne({
			_id: req.body.ticket_id,
			sort_order: { $in: [1, 2, 3] },
			borrower: req.user._id
		})

		if (!ticket) throw new Error('Ticket not valid.')

		if (ticket.sort_order === 1) {
			await ticket.updateTicket({
				status: 'Cancelled (Pickup)',
				sort_order: 5,
				event: 'Cancelled Pickup',
				user_id: req.user.id
			})

			const book = await Book.findById(ticket.book._id)
			book.available += 1
			await book.save()

			// Remove the item from user.tickets
			req.user.removeTicket(ticket._id)
			res.send({
				header: 'Pick up request has been successfully cancelled.',
				content: `Cancelled pick up request for the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 2) {
			await ticket.updateTicket({
				status: 'Cancelled (Borrow)',
				sort_order: 5,
				event: 'Cancelled Borrow Request',
				user_id: req.user.id
			})
			// Remove the item from user.tickets
			req.user.removeTicket(ticket._id)
			res.send({
				header: 'Borrow request has been successfully cancelled.',
				content: `Cancelled borrow request for the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 3) {
			await ticket.updateTicket({
				status: 'Cancelled (Return)',
				sort_order: 4,
				event: 'Cancelled Return Request',
				user_id: req.user.id
			})

			res.send({
				header: 'Return request has been successfully cancelled.',
				content: `Cancelled return request for the book titled "${ticket.book.title}".`
			})
		}

		res.send()
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	POST /return
// @desc 	 	Issuing a return request for a book
// @access 	Owner of the ticket
router.post('/return', auth, async (req, res) => {
	try {
		const ticket = await Ticket.findOne({
			_id: req.body.ticket_id,
			sort_order: 4,
			borrower: req.user._id
		})

		if (!ticket) throw new Error('Ticket not valid.')

		await ticket.updateTicket({
			status: 'Pending (Return)',
			sort_order: 3,
			event: 'Return Request',
			user_id: req.user.id
		})

		res.send({
			header: 'Return request has been sent.',
			content: `Created return request for the book titled "${ticket.book.title}".`
		})
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

module.exports = router
