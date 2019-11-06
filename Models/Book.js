const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
	cover: { type: Buffer },
	title: { type: String, required: true },
	author: { type: String },
	description: { type: String },
	datePublished: { type: Date },
	quantity: {
		type: Number,
		default: 0,
		// to save the previous value
		set: function(quantity) {
			this.oldQuantity = this.quantity
			return quantity
		}
	},
	available: {
		type: Number,
		default: 0
	},
	editHistory: [
		{
			updatedBy: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			},
			time: {
				type: Date,
				default: Date.now()
			}
		}
	]
})

bookSchema.virtual('borrowHistory', { ref: 'Ticket', localField: '_id', foreignField: 'book' })

// Editing the value of `available` when `quantity` is changed.
bookSchema.pre('save', function(next) {
	if (this.isModified('quantity')) {
		const diff = this.quantity - this.oldQuantity
		this.available += diff
	}

	next()
})

mongoose.model('Book', bookSchema)
