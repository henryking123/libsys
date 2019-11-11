const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

// @route 	POST /register
// @desc 	 	Register a User
// @access 	Public
router.post('/register', async (req, res) => {
	try {
		const found = await User.findOne({ email: req.body.email })
		if (found) throw new Error('Email has already been taken by another user.')
		const user = new User(req.body)
		const token = await user.generateAuthToken()

		res.json({ user, token })
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

// @route 	POST /login
// @desc 	 	Logging in
// @access 	Public
router.post('/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password)
		if (!user) throw new Error('Invalid credentials.')
		const token = await user.generateAuthToken()
		res.send({ user, token })
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

// @route 	GET /logout
// @desc 	 	Logging Out User
// @access 	Registered User
router.get('/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

		await req.user.save()

		res.send()
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

// @route 	GET /logoutAll
// @desc 	 	Logging Out User
// @access 	Registered User
router.get('/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = []

		await req.user.save()

		res.send()
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
})

module.exports = router
