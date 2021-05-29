const mongoose = require('mongoose')

const { Schema } = mongoose

const waitlistSchema = new Schema(
	{
		name: String,
		email: String,
		role: String
	},
	{ timestamps: true }
)

const WaitlistUser = mongoose.model('waitlistUser', waitlistSchema)
module.exports = WaitlistUser
