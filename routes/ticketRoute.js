const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Ticket = mongoose.model('Ticket')
const Book = mongoose.model('Book')

// @route 	GET /tickets/
// @desc 	 	Get current user's tickets
// @access 	Admin
router.get('/', auth, admin, async (req, res) => {
	try {
		const tickets = await Ticket.find({ borrower: req.user.id })
		res.send(tickets)
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	GET /tickets/:option
// @desc 	 	Get tickets
// @access 	Admin
router.get('/:sort_order', auth, admin, async (req, res) => {
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

		const tickets = await Ticket.find(options)
			.select('-event_logs')
			.populate({ path: 'borrower', select: 'name' })
			.sort({ sort_order: 1, updatedAt: -1 })
			.limit(10)
		res.send(tickets)
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
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
			ticket.status = 'Borrowed'
			ticket.sort_order = 4
			await ticket.save()
			await ticket.addEventLog('Given to Borrower', req.user.id)
			req.user.books.push(ticket.book._id)
			await req.user.save()
			res.send({
				header: 'Ticket has been accepted by admin. Book has been picked up.',
				content: `${ticket.borrower.name} has successfully borrowed the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 2) {
			ticket.status = 'For Pick Up'
			ticket.sort_order = 1
			await ticket.save()
			await ticket.addEventLog('Accepted Borrow Request', req.user.id)
			const book = await Book.findById(ticket.book._id)
			book.available -= 1
			await book.save()
			res.send({
				header: 'Borrow ticket has been accepted by admin. Prepare the book for pickup.',
				content: `Accepted borrow request of ${ticket.borrower.name} for the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 3) {
			ticket.status = 'Returned'
			ticket.sort_order = 5
			await ticket.save()
			await ticket.addEventLog('Accepted Return Request', req.user.id)
			const book = await Book.findById(ticket.book._id)
			book.available += 1
			await book.save()
			req.user.books = req.user.books.filter(
				({ _id }) => _id.toString() !== ticket.book._id.toString()
			)
			await req.user.save()
			res.send({
				header: 'Return ticket has been accepted by admin.',
				content: `Accepted return request of ${ticket.borrower.name} for the book titled "${ticket.book.title}".`
			})
		}

		res.send()
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
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
			ticket.status = 'Declined (Pickup)'
			ticket.sort_order = 5
			await ticket.save()
			await ticket.addEventLog('Cancelled Pickup', req.user.id)
			const book = await Book.findById(ticket.book._id)
			book.available += 1
			await book.save()
			res.send({
				header: 'Pick up request has been cancelled by admin.',
				content: `Declined pick up of ${ticket.borrower.name} for the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 2) {
			ticket.status = 'Declined (Borrow)'
			ticket.sort_order = 5
			await ticket.save()
			await ticket.addEventLog('Declined Borrow Request', req.user.id)
			res.send({
				header: 'Borrow ticket has been declined by admin.',
				content: `Declined borrow request of ${ticket.borrower.name} for the book titled "${ticket.book.title}".`
			})
		} else if (ticket.sort_order === 3) {
			ticket.status = 'Declined (Return)'
			ticket.sort_order = 4
			await ticket.save()
			await ticket.addEventLog('Declined Return Request', req.user.id)
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

// @route 	POST /borrow/:book_id/accept/:ticket_id
// @desc 	 	Accepting a borrow request
// @access 	Admin
router.post('/borrow/:ticket_id/accept', auth, admin, async (req, res) => {
	try {
		// Check if pendingBorrow
		const ticket = await Ticket.findOne({ _id: req.params.ticket_id, status: 'pendingBorrow' })
		if (!ticket) throw new Error('Ticket not valid')

		// Change ticket status to 'active'
		ticket.status = 'active'
		// Edits the 'from' field
		ticket.from = Date.now()
		// Adds to the history 'Accepted borrow request' status and by current logged in admin
		ticket.history.push({
			status: 'Accepted borrow request',
			by: req.user._id,
			time: Date.now()
		})
		// Remove one from available books
		// @todo	Book has to be available
		const book = await Book.findById(ticket.book)
		// @todo	If book.available = 0, then all pending tickets for book will be declined
		book.available -= 1
		await book.save()
		await ticket.save()
		res.send({ ticket })
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	POST /borrow/:ticket_id/decline
// @desc 	 	Declining a borrow request
// @access 	Admin
router.post('/borrow/:ticket_id/decline', auth, admin, async (req, res) => {
	try {
		// Check if pendingBorrow
		const ticket = await Ticket.findOne({ _id: req.params.ticket_id, status: 'pendingBorrow' })
		if (!ticket) throw new Error('Ticket not valid')

		// Change ticket status to 'declined'
		ticket.status = 'declined'
		// Adds to the history 'Declined borrow request' status and by current logged in admin
		ticket.history.push({
			status: 'Declined borrow request',
			by: req.user._id,
			time: Date.now()
		})
		await ticket.save()
		res.send({ ticket })
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	POST /return/:ticket_id
// @desc 	 	Issue a return request
// @access 	Student, Admin
router.post('/return/:ticket_id', auth, async (req, res) => {
	try {
		const ticket = await Ticket.findOne({
			_id: req.params.ticket_id,
			borrower: req.user.id,
			status: 'active'
		})
		if (!ticket) throw new Error('Invalid ticket')
		// Set ticket status to 'pendingReturn'
		ticket.status = 'pendingReturn'
		await ticket.save()
		res.send({ ticket })
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	POST /return/:book_id/accept/:ticket_id
// @desc 	 	Accepting a return request
// @access 	Admin
router.post('/return/:ticket_id/accept', auth, admin, async (req, res) => {
	try {
		// Check if ticket status is 'pendingReturn'
		const ticket = await Ticket.findOne({ _id: req.params.ticket_id, status: 'pendingReturn' })
		if (!ticket) throw new Error('Invalid ticket.')
		// Change ticket status to 'returned'
		ticket.status = 'returned'
		// Set current Time&Date to 'to'
		ticket.to = Date.now()
		// Adds to the history 'Accepted return request' status and by current logged in admin
		ticket.history.push({
			status: 'Accepted return request',
			by: req.user._id,
			time: Date.now()
		})
		// Adds one to the number of available books
		const book = await Book.findById(ticket.book)
		book.available += 1
		await book.save()
		await ticket.save()
		res.send({ ticket })
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	POST /return/:book_id/decline/:ticket_id
// @desc 	 	Declining a return request
// @access 	Admin
router.post('/return/:ticket_id/decline', auth, admin, async (req, res) => {
	try {
		// Check if ticket status is 'pendingReturn'
		const ticket = await Ticket.findOne({ _id: req.params.ticket_id, status: 'pendingReturn' })
		if (!ticket) throw new Error('Invalid ticket.')
		// Change ticket status to 'active'
		ticket.status = 'active'
		// Adds to the history 'Declined return request' status and by current logged in admin
		ticket.history.push({
			status: 'Declined return request',
			by: req.user._id,
			time: Date.now()
		})

		await ticket.save()
		res.send({ ticket })
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

// @route 	GET /ticket/:ticket_id
// @desc 	 	Get ticket details
// @access 	Admin
router.get('/ticket/:ticket_id', auth, admin, async (req, res) => {
	try {
		const ticket = await Ticket.findById(req.params.ticket_id)
			.populate('book', ['title'])
			.populate('borrower', ['name', 'email'])
		if (!ticket) throw new Error('Invalid ticket')

		res.send({ ticket })
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	POST /cancel/:ticket_id
// @desc 	 	Cancel ticket
// @access 	Owner of the ticket
router.post('/cancel/:ticket_id', auth, async (req, res) => {
	try {
		const ticket = await Ticket.findOne({
			_id: req.params.ticket_id,
			status: { $in: ['pendingBorrow', 'pendingReturn'] },
			borrower: req.user._id
		})
		if (!ticket) throw new Error('Ticket not valid.')

		if (ticket.status === 'pendingBorrow') {
			ticket.status = 'cancelled'
		} else {
			ticket.status = 'active'
		}

		await ticket.save()

		res.send({ ticket })
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

module.exports = router
