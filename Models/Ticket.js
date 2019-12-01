const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ticketSchema = new mongoose.Schema(
	{
		borrower: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
			autopopulate: { select: ['name'] }
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
			type: String
		},
		sort_order: {
			type: Number
			// Sort_order : Status
			// Green
			// 1 : For Pick Up*
			// Orange
			// 2 : Pending (Borrow)*
			// 3 : Pending (Return)*
			// Blue
			// 4 means that user still has the book
			// 4 : Borrowed*
			// 4 : Cancelled (Return)*
			// 4 : Declined (Return)*
			// Red
			// 5 means the book has been returned or the transaction never happened
			// 5 : Cancelled (Borrow)*
			// 5 : Cancelled (Pickup)*
			// 5 : Declined (Borrow)*
			// 5 : Declined (Pickup)*
			// 5 : Expired
			// 5 : Returned*
			// 5 : Duplicate Request*
			// 5 : Borrow Request Error*
		},
		event_logs: [
			{
				status: {
					type: String,
					required: true
				},
				// "Borrow Request" (by User) - user clicks "Borrow Now" on cart (ticket expires in 12 hours, added this in case admin never gets around to accepting or declining the ticket)*
				// "Borrow Request Error" (by Admin) - admin accepts the ticket but system can't find the book*
				// "Duplicate Request" (by Admin) - admin accepts the ticket but system found an active ticket*
				// "Accepted Borrow Request" (by Admin) - admin prepares the book (ticket expiration gets updated)*
				// "Given to Borrower" (by Admin) - user gets the book*
				// "Return Request" (by User) - user tries to return a book*
				// "Accepted Return Request" (by Admin) - admin gets the book from the student*
				// "Cancelled Borrow Request" (by User) - user can cancel the borrow request*
				// "Cancelled Return Request" (by User) - user can cancel the return request*
				// "Declined Borrow Request" (by Admin) - admin can decline the borrow request*
				// "Declined Return Request" (by Admin) - admin can decline the return request*
				// "Declined Pickup" (by Admin) - admin can decline the return request*
				// "Cancelled Pickup" (by User) - admin can decline the return request*
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

ticketSchema.methods.updateTicket = async function({ status, sort_order, event, user_id }) {
	try {
		const ticket = this
		ticket.status = status
		ticket.sort_order = sort_order
		ticket.event_logs.push({ status: event, by: user_id })
		await ticket.save()
	} catch (e) {
		console.error(e.message)
	}
}

ticketSchema.plugin(mongoosePaginate)
ticketSchema.plugin(require('mongoose-autopopulate'))

mongoose.model('Ticket', ticketSchema)
