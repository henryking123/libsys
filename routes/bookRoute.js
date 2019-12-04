const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Book = mongoose.model('Book')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

// @route 	GET /books/all/:page
// @desc 		Get All Books
// @access 	Admin, Students
router.get('/all', auth, async (req, res) => {
	try {
		const response = await Book.paginate(
			{},
			{ sort: { createdAt: -1 }, limit: 5, page: req.query.page }
		)
		res.send(response)
	} catch (e) {
		console.error(e.message)
		res.status(500).send('Server Error')
	}
})

// @route 	GET /books/search?search=something&page=number
// @desc 		Get All Books
// @access 	Admin, Students
router.get('/search', auth, async (req, res) => {
	try {
		const response = await Book.paginate(
			{
				$or: [
					{ title: { $regex: new RegExp(req.query.search), $options: 'i' } },
					{ author: { $regex: new RegExp(req.query.search), $options: 'i' } }
				]
			},
			{ sort: { available: -1 }, limit: 5, page: req.query.page }
		)
		if (!response) res.send()
		res.send(response)
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	GET /books/:book_id
// @desc 		Read details of a book
// @access 	Admin, Students
router.get('/:book_id', auth, async (req, res) => {
	try {
		let book = {}
		// If user is admin, return book with edit history and borrow history
		// Otherwise, return only the book
		if (!req.user.isAdmin) {
			book = await Book.findById(req.params.book_id).select('-editHistory')
		} else {
			book = await Book.findById(req.params.book_id).populate('editHistory.updatedBy', [
				'name',
				'email'
			])
		}

		if (!book) throw new Error('Book not found.')
		res.json(book)
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

// @route 	GET /tickets/books/:book_id/
// @desc 		Read details of a book
// @access 	Admin, Students

// @route 	POST /books
// @desc 		Add new Book
// @access 	Admin
router.post('/', auth, admin, async (req, res) => {
	try {
		const book = new Book(req.body)

		book.editHistory = [{ updatedBy: req.user.id }]
		await book.save()

		res.status(201).json({ book })
	} catch (e) {
		console.error(e.message)
		res.status(500).send('Server Error')
	}
})

// @route 	PATCH /books/:book_id
// @desc 		Edit details of a book
// @access 	Admin
router.patch('/:book_id', auth, admin, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['title', 'author', 'yearPublished', 'description', 'quantity']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates.' })

	try {
		const book = await Book.findById(req.params.book_id)
		updates.forEach((update) => (book[update] = req.body[update]))

		book.editHistory.push({
			updatedBy: req.user.id
		})
		await book.save()

		res.send(book)
	} catch (e) {
		console.error(e.message)
		res.status(500).send('Server Error')
	}
})

// @route 	DELETE /books/:book_id
// @desc 	 	Remove a book from database
// @access 	Admin
router.delete('/:book_id', auth, admin, async (req, res) => {
	try {
		const book = await Book.findById(req.params.book_id)

		if (!book) return res.status(400).json({ error: 'Book not found.' })

		// Find active or pending tickets for current book, return tickets instead
		await book
			.populate({
				path: 'borrowHistory',
				select: ['borrower', 'from', 'to', 'status'],
				match: {
					status: { $in: ['pendingBorrow', 'active'] }
				},
				populate: {
					path: 'borrower',
					select: ['name', 'email', 'studentId', 'employeeId', 'isAdmin']
				}
			})
			.execPopulate()

		if (book.borrowHistory.length > 0)
			return res.status(400).json({
				error:
					'Please decline all pending borrow requests and make sure all books has been returned.',
				tickets: book.borrowHistory
			})

		await book.remove()

		res.send(book)
	} catch (e) {
		console.error(e.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
