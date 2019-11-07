const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema(
	{
		borrower: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		book: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Book'
		},
		from: {
			type: Date
		},
		to: {
			type: Date
		},
		status: {
			type: String,
			required: true
		},
		history: [
			{
				status: {
					type: String,
					required: true
				},
				by: {
					type: mongoose.Schema.Types.ObjectId,
					required: true
				},
				time: {
					type: Date,
					required: true
				}
			}
		]
	},
	{ timestamps: true }
)

// Before sending, populate book and borrower fields

mongoose.model('Ticket', ticketSchema)
