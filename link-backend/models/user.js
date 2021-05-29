const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Card = require('./card')
const Button = require('./button')
const Social = require('./social')

const { Schema } = mongoose

// Create a schema
const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: String,
		displayName: {
			type: String
		},
		username: {
			type: String,
			lowercase: true,
			// TODO: If the user was registered with social network, it might never let him do the register, so make better validation or imnplement function to change the username
			validate: [
				// eslint-disable-next-line no-use-before-define
				async username => !(await User.exists({ username })),
				'Username is already in use'
			]
		},
		email: {
			// This the main email, if there is an email to be send this one to be selected
			type: String,
			lowercase: true,
			validate: [
				// eslint-disable-next-line no-use-before-define
				async email => !(await User.exists({ email })),
				'Email is already in use'
			]
		},
		referralCode: {
			type: Schema.Types.ObjectId,
			ref: 'code'
		},
		cardOrder: {
			type: Boolean,
			default: false
		},
		methods: {
			type: [String],
			required: true
		},
		local: {
			email: {
				type: String,
				lowercase: true
			},
			password: {
				type: String
			}
		},
		payment_details: {
			type: Object,
			default: {}
		},
		planType: {
			type: String
		},
		google: {
			id: {
				type: String
			},
			email: {
				type: String,
				lowercase: true
			}
		},
		facebook: {
			id: {
				type: String
			},
			email: {
				type: String,
				lowercase: true
			}
		},
		instagram: {
			id: {
				type: String
			},
			email: {
				type: String,
				lowercase: true
			}
		},
		socialArray: {
			type: [String],
			default: ["Facebook", 
				"Instagram", 
				"Linkedin", 
				"Snapchat", 
				"Spotify", 
				"Twitter", 
				"YouTube", 
				"Blogger", 
				"TikTok", 
				"Twitch", 
				"Github",
				"Dribbble", 
				"Yelp", 
				"Amazon",
				"Discord",
				"Ebay",
				"Etsy",
				"Messenger",
				"Reddit",
				"SoundCloud",
				"Whatsapp",
				"Airbnb"
			]
		},
		pin: String // pin for password reset
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: function (doc, ret) {
				if (ret.local) {
					if (ret.local.password) {
						delete ret.local.password
					}
				}
				if (ret._id) {
					delete ret._id
				}
				if (ret.__v !== null || typeof ret.__v !== 'undefined') {
					delete ret.__v
				}
				return ret
			}
		},
		toObject: {
			virtuals: true
		}
	}
)

userSchema.virtual('code', {
	ref: 'code',
	localField: '_id',
	foreignField: 'createdBy'
})

userSchema.virtual('geoInfos', {
	ref: 'geoInfo',
	localField: '_id',
	foreignField: 'user'
})

userSchema.virtual('cards', {
	ref: 'card',
	localField: '_id',
	foreignField: 'account'
})

userSchema.virtual('card').get(async function () {
	const card = await Card.findOne({ account: this._id }, '_id')
	return card !== null ? card.id : null
})

userSchema.methods.getClicks = async function () {
	const card = await this.card
	const buttons = (await Button.find({ fromCard: card }, 'clicks title'))
		.map(value => value.toJSON())
		.map(({ title: name, clicks, ...value }) => ({
			...value,
			name,
			clicks: clicks.length,
			type: 'button'
		}))
	const socials = (await Social.find({ fromCard: card }, 'clicks name'))
		.map(value => value.toJSON())
		.map(({ clicks, ...value }) => ({
			...value,
			clicks: clicks.length,
			type: 'social'
		}))
	return { buttons, socials }
}

userSchema.pre('save', async function (next) {
	try {
		if (this.methods) {
			if (!this.methods.includes('local')) {
				next()
			}
		}
		if (this.isModified('local.password')) {
			const salt = await bcrypt.genSalt(10)
			const passwordHash = await bcrypt.hash(this.local.password, salt)
			this.local.password = passwordHash
		}
		next()
	} catch (error) {
		next(error)
	}
})

userSchema.post('save', function (error, doc, next) {
	next(error)
	// if (error.name === 'MongoError' && error.code === 11000) {
	// 	next(new Error('There was a duplicate key error'))
	// } else {
	// 	next()
	// }
})

userSchema.methods.comparePassword = function (password, cb) {
	bcrypt.compare(password, this.local.password, (err, isMatch) => {
		if (err) {
			return cb(err)
		}
		cb(null, isMatch)
	})
}

userSchema.methods.isValidPassword = function (newPassword) {
	try {
		return bcrypt.compare(newPassword, this.local.password)
	} catch (error) {
		throw new Error(error)
	}
}

const User = mongoose.model('user', userSchema)

module.exports = User
