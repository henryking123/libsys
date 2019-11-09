const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Ticket = mongoose.model('Ticket')
const Book = mongoose.model('Book')

// @route 	POST /cart/:book_id
// @desc 	 	Adding something to cart
// @access 	Student, Admin
router.post('/cart/:book_id', auth, async (req, res) => {
	try {
		// Push to cart array
		req.user.cart.push(book_id)
		await req.user.save()
		res.send(req.user)
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

// @route 	POST /borrow/:book_id
// @desc 	 	Issue a borrow request
// @access 	Student, Admin
router.post('/borrow/:book_id', auth, async (req, res) => {
	try {
		// See if book is available
		const book = await Book.findOne({ _id: req.params.book_id, available: { $gt: 0 } })
		if (!book) throw new Error('Book not available.')
		// See if user currently has an open ticket for the book
		const openTicket = await Ticket.findOne({
			borrower: req.user._id,
			status: { $in: ['active', 'pendingBorrow', 'pendingReturn'] },
			book: req.params.book_id
		})
		if (openTicket) throw new Error('You still have an open ticket for this book.')

		const ticket = new Ticket(req.body)
		ticket.borrower = req.user._id
		ticket.book = req.params.book_id
		// Set ticket status to 'pendingBorrow'
		ticket.status = 'pendingBorrow'
		await ticket.save()
		res.send({ ticket })
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
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
		// @todo	If book.available = 0, then all pending tickets for book will be declined
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
