const mongoose = require('mongoose')
const { mongoURI } = require('../config/keys')

mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})
