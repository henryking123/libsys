module.exports = (req, res, next) => {
	if (req.user.isAdmin) {
		next()
	} else {
		res.status(401).json({ error: 'This route is only for administration.' })
	}
}
