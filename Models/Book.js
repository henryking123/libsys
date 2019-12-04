const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const bookSchema = new mongoose.Schema(
	{
		cover: { type: Buffer },
		title: { type: String, required: true },
		author: { type: String },
		description: { type: String },
		yearPublished: { type: Date },
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
					required: true,
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

bookSchema.set('toObject', { virtuals: true })
bookSchema.set('toJSON', { virtuals: true })

// Editing the value of `available` when `quantity` is changed.
bookSchema.pre('save', function(next) {
	if (this.isModified('quantity')) {
		if (this.quantity < this.oldQuantity - this.available) {
			next(new Error('Invalid updates.'))
		} else {
			const diff = this.oldQuantity - this.quantity
			this.available -= diff
			next()
		}
	} else {
		next()
	}
})

bookSchema.plugin(mongoosePaginate)

mongoose.model('Book', bookSchema)
