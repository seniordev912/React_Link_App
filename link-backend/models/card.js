const mongoose = require('mongoose')
const { isColorValid, isFzValid } = require('../validators/regexs')

const { Schema } = mongoose

const cardSchema = new Schema(
	{
		imageUrl: [String],
		bgColor: {
			type: String,
			default: 'rgba(255, 255, 255, 1)',
			lowercase: true,
			validate: bgColor => isColorValid.test(bgColor)
		},
		title: {
			type: String,
			default: function () {
				if (this.account) {
					return `Hey, it's ${this.account.firstName}`
				}
				return 'Add a cool title'
			}
		},
		// titleFontSize: {
		// 	type: String,
		// 	default: '38px',
		// 	lowercase: true,
		// 	validate: fontSize => isFzValid.test(fontSize)
		// },
		// titleColor: {
		// 	type: String,
		// 	default: '#000',
		// 	minlength: 4,
		// 	maxlength: 7,
		// 	lowercase: true,
		// 	validate: titleColor => isColorValid.test(titleColor)
		// },
		// desc: {
		// 	type: String,
		// 	default: 'Add something cool about yourself here!'
		// },
		text: {
			type: Object,
			default: function () {
				return {
					blocks: [
						{
							data: {
								level: 1,
								text: this.account
									? `Hey, it's ${this.account.firstName}`
									: 'Add a cool title'
							},
							type: 'header'
						},
						{
							data: {
								text: 'Click me to start typing'
							},
							type: 'paragraph'
						}
					],
					color: 'rgba(0, 0, 0, 1)',
					time: Date.now(),
					version: '2.17.0'
				}
			}
		},
		// descColor: {
		// 	type: String,
		// 	default: '#000',
		// 	validate: descColor => isColorValid.test(descColor)
		// },
		footerText: {
			type: String,
			color: {
				type: String,
				default: 'rgba(0, 0, 0, 1)',
				lowercase: true,
				validate: footerTextColor => isColorValid.test(footerTextColor)
			},
			clicks: [
				{
					type: Number,
					date: Date
				}
			]
		},
		account: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		isPublic: {
			// indicates whether the card link is private (false) or public (true)
			type: Boolean,
			default: true
		},
		usernameVisible: {
			type: Boolean,
			default: false
		},
		isRectangle: {
			type: Boolean,
			default: false
		},
		views: [
			{
				ref: 'session',
				type: Schema.Types.ObjectId
			}
		]
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: function (doc, ret) {
				if (ret.__v !== null || typeof ret.__v !== 'undefined') {
					delete ret.__v
				}
				delete ret._id
				return ret
			}
		},
		toObject: {
			virtuals: true
		}
	}
)

cardSchema.virtual('socials', {
	ref: 'social',
	localField: '_id',
	foreignField: 'fromCard'
})

cardSchema.virtual('buttons', {
	ref: 'button',
	localField: '_id',
	foreignField: 'fromCard'
})

const Card = mongoose.model('card', cardSchema)
module.exports = Card
