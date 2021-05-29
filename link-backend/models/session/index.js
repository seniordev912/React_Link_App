const mongoose = require('mongoose')
const timeSpent = require('./timeSpent')
const { IN_PROD } = require('../../config')
const { displaySource } = require('../../utils')

const { Schema } = mongoose

const sessionSchema = new Schema(
	{
		enteredTime: Date,
		clickedTime: Date,
		type: {
			type: String,
			required: true,
			enum: ['footerText', 'button', 'social', 'card']
		},
		timeSpent: {
			type: Number,
			default: function () {
				if (this.enteredTime && this.clickedTime) {
					return timeSpent(this.enteredTime, this.clickedTime)
				}
				return undefined
			}
		},
		geoInfo: {
			type: Schema.Types.ObjectId,
			ref: 'geoInfo',
			required: IN_PROD
		},
		unique: {
			type: Boolean,
			default: false
		},
		count: {
			type: Boolean,
			default: true
		},
		ip: {
			type: String,
			required: IN_PROD
		},
		userAgent: {
			type: String,
			required: true
		},
		device: String,
		source: {
			type: String,
			enum: [
				'facebook',
				'twitter',
				'instagram',
				'linkedin',
				'telegram',
				'twitch',
				'tiktok',
				'snapchat',
				'youtube',
				'blogspot',
				'blogger',
				'medium',
				'other'
			],
			lowercase: true,
			default: 'other'
		},
		// this is the owner of the footer text, buttons and social icons
		fromUser: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		// this is the user who clicked in the {fromUser} content
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user'
		}
	},
	{
		timestamps: true,
		toJSON: {
			transform: function (doc, ret) {
				if (ret._id) {
					ret.id = ret._id
					delete ret._id
				}
				if (ret.__v !== null || typeof ret.__v !== 'undefined') {
					delete ret.__v
				}
				if (ret.source) {
					ret.source = displaySource(ret.source)
				}
				return ret
			}
		}
	}
)

const Session = mongoose.model('session', sessionSchema)

module.exports = Session
