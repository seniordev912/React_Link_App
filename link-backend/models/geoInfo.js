const mongoose = require('mongoose')

const { Schema } = mongoose

const geoInfoSchema = new Schema({
	country: String,
	city: String,
	timezone: String,
	eu: Boolean,
	latitute: Number,
	longitude: Number,
	metro: Number,
	device: String,
	area: Number,
	ip: {
		type: String,
		required: true
	},
	userAgent: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	}
})

const Geo = mongoose.model('geoInfo', geoInfoSchema)

module.exports = Geo
