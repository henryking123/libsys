const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = async (req, res, next) => {
	try {
		// Getting the token from the header
		const token = req.header('x-auth-token')
		// Verifying the token
		if (!token) throw new Error()

		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		// Finding user and then populating the tickets, cart, and books field
		// In cart: Do not include books that are deleted.
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).populate({
			path: 'cart'
		})

		if (!user) throw new Error()

		await user.refreshTickets()

		req.token = token
		req.user = user
		next()
	} catch (e) {
		res.status(401).send('Please authenticate.')
	}
}
