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
			autopopulate: { select: ['title', 'author'] }
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
		sort_order: {
			type: Number,
			required: true
			// Sort_order : Status
			// 1 : For Pick Up
			// 2 : Pending (Borrow)
			// 3 : Pending (Return)
			// 4 means that user still has the book
			// 4 : Borrowed
			// 4 : Cancelled (Return)
			// 4 : Declined (Return)
			// 5 means the book has been returned or the transaction never happened
			// 5 : Cancelled (Borrow)
			// 5 : Declined (Borrow)
			// 5 : Expired
			// 5 : Returned
		},
		event_logs: [
			{
				status: {
					type: String,
					required: true
				},
				// "Borrow Request" (by User) - user clicks "Borrow Now" on cart (ticket expires in 12 hours, added this in case admin never gets around to accepting or declining the ticket)
				// "Accepted Borrow Request" (by Admin) - admin prepares the book (ticket expiration gets updated)
				// "Given to Borrower" (by Admin) - user gets the book
				// "Return Request" (by User) - user tries to return a book
				// "Accepted Return Request" (by Admin) - admin gets the book from the student
				// "Cancelled Borrow Request" (by User) - user can cancel the borrow request
				// "Cancelled Return Request" (by User) - user can cancel the return request
				// "Declined Borrow Request" (by Admin) - admin can decline the borrow request
				// "Declined Return Request" (by Admin) - admin can decline the return request
				// "Expired" (by System) - tickets can expire
				by: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
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

ticketSchema.methods.addEventLog = async function(status, by) {
	try {
		const ticket = this

		ticket.event_logs.push({ status, by })
		await ticket.save()
	} catch (e) {
		console.error(e.message)
	}
}

ticketSchema.plugin(require('mongoose-autopopulate'))

mongoose.model('Ticket', ticketSchema)
