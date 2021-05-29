const mongoose = require('mongoose')
const { isColorValid } = require('../validators/regexs')

const { Schema } = mongoose

const buttonSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		titleColor: {
			type: String,
			default: 'rgba(0, 0, 0, 1)',
			lowercase: true,
			validate: titleColor => isColorValid.test(titleColor)
		},
		imageUrl: String, // dimensions must be square. Reflect this in the UI for cropping
		bgColor: {
			type: String,
			default: 'rgba(230,247, 255, 1)',
			lowercase: true,
			validate: bgColor => isColorValid.test(bgColor)
			// default: '#3aa3ae',
		},
		animation: {
			type: String, // none, shake, bounce, tilt
			default: 'none',
			enum: ['none', 'shake', 'bounce', 'fade up', 'fade down', 'jello', 'pulse', 'flash',  'swing',  'tada']
		},
		url: {
			type: String,
			default: 'www.linkupcard.com'
			// required: true
		},
		protocol: {
			type: String,
			lowercase: true,
			default: 'http://',
			enum: ['https://', 'http://']
		},
		// this is to make the sort
		index: {
			type: Number
		},
		clicks: [
			{
				type: Schema.Types.ObjectId,
				ref: 'session'
			}
		],
		fromCard: {
			type: Schema.Types.ObjectId,
			ref: 'card',
			required: true
		}
	},
	{
		toJSON: {
			transform: function (_doc, ret) {
				if (ret.__v !== null || typeof ret.__v !== 'undefined') {
					delete ret.__v
				}
				ret.id = ret._id
				delete ret._id
				return ret
			}
		},
		timestamps: true
	}
)

const Button = mongoose.model('button', buttonSchema)
module.exports = Button
