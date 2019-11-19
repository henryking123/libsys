const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Ticket = mongoose.model('Ticket')
const Book = mongoose.model('Book')

// @route 	GET /cart
// @desc 	 	List user's cart
// @access 	Student, Admin
router.get('/cart', auth, async (req, res) => {
	try {
		res.send(req.user.cart)
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

// @route 	POST /cart
// @desc 	 	Adding something to cart
// @access 	Student, Admin
router.post('/cart', auth, async (req, res) => {
	try {
		// See if currently in cart
		if (req.user.cart.length > 0) {
			const found = req.user.cart.some((book) => book.toString() === req.body.book_id)
			if (found) throw new Error('Book is already in cart')
		}
		// Push to cart array
		const book = await Book.findById(req.body.book_id)
		req.user.cart.push(book)
		await req.user.save()
		res.send(req.user.cart)
	} catch (e) {
		console.error(e.message)
		res.status(400).send(e.message)
	}
})

// @route 	POST /cart/remove
// @desc 	 	Removing an item from cart
// @access 	Student, Admin
// Untested
router.post('/cart/remove', auth, async (req, res) => {
	try {
		req.user.cart = req.user.cart.filter(({ _id }) => _id.toString() !== req.body.book_id)
		await req.user.save()
		res.send(req.user.cart)
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

module.exports = router
