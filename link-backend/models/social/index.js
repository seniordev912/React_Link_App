const mongoose = require('mongoose')
const defaultColor = require('./color')
const { isColorValid } = require('../../validators/regexs')

const { Schema } = mongoose

const socialSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			lowercase: true,
			enum: [
				'facebook',
				'twitter',
				'linkedin',
				'instagram',
				'youtube',
				'spotify',
				'blogger',
				'snapchat',
				'tiktok',
				'twitch',
				'github',
				'dribbble',
				'yelp',
				'airbnb',
				'amazon',
				'discord',
				'ebay',
				'etsy',
				'messenger',
				'reddit',
				'soundcloud',
				'whatsapp'
			],
			validate: [
				// eslint-disable-next-line
				async name => !(await Social.exists({ name, fromCard: this.fromCard }))
			]
		},
		color: {
			type: String,
			lowercase: true,
			validate: color => isColorValid.test(color),
			default: function () {
				return defaultColor(this.name)
			}
		},
		isActive: {
			type: Boolean,
			default: true
		},
		colorOnHover: {
			type: Boolean,
			default: false
		},
		link: {
			type: String,
			required: true
		},
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
			ref: 'card'
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
		}
	}
)

const Social = mongoose.model('social', socialSchema)

module.exports = mongoose.model('social', socialSchema)
