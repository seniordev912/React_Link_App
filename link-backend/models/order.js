const mongoose = require('mongoose')

const { Schema } = mongoose

const orderSchema = new Schema(
	{
        paymentId: String,
        paymentSource: String,
        country: String,
        city: String,
        line1: String,
        line2: String,
        province: String,    
        custom_logo: String,
        custom_design: String,
        subtotal: String,
        shipping: String,
        total: String,
        products: Array,
        isSaved: Boolean,
		user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
	},
	{
		timestamps: true
	}
)

const Order = mongoose.model('order', orderSchema)
module.exports = Order
