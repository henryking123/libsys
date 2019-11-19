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
			ref: 'Book',
			autopopulate: true
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
		statusId: {
			type: Number,
			required: true
			// > 1 Pending Borrow
			// > 2 Accepted
			// > 3 Active
			// > 4 Pending Return
			// > 5 Returned
			// > 6 Expired
			// > 7 Cancelled Borrow
			// > 8 Cancelled Return
			// > 9 Declined Borrow
			// > 10 Declined Return
		},
		history: [
			{
				status: {
					type: String,
					required: true
				},
				statusId: {
					type: Number,
					required: true
				},
				by: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: 'User',
					autopopulate: true
				},
				time: {
					type: Date,
					default: Date.now()
				}
			}
		]
	},
	{ timestamps: true }
)

ticketSchema.methods.addHistory = async function(statusId, status, by) {
	try {
		const ticket = this

		ticket.history.push({ statusId, status, by })
		await ticket.save()
	} catch (e) {
		console.error(e.message)
		res.status(500).send(e.message)
	}
}

ticketSchema.plugin(require('mongoose-autopopulate'))

mongoose.model('Ticket', ticketSchema)
