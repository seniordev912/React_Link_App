const nodemailer = require('nodemailer')
const moment = require('moment')
const JWT = require('jsonwebtoken')
const _ = require('lodash')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const User = require('../../models/user')
const Card = require('../../models/card')
const Code = require('../../models/code')
const Button = require('../../models/button')
const Session = require('../../models/session')
const Social = require('../../models/social')
const Order = require('../../models/order')
const { getPin, htmlMail, removeProps, getRestArray, getProductDetails } = require('../../utils')
const {
	JWT_SECRET,
	EMAIL_USERNAME,
	EMAIL_FROM,
	EMAIL_CLIENT_ID,
	PRIVATE_KEY_ID
} = require('../../config')
require('dotenv').config()

const couponList = [
	{
		name: 'LINKUPPARTNER', 
		id: 'E6hRJJnV', 
		shipping: 0
	},
	{
		name: 'FREE-EVERYTHING', 
		id: 'gvSEp9R1', 
		shipping: 100
	},
	{
		name: 'Takeoff10', 
		id: 'dpmW6QuQ', 
		shipping: 0
	},
	{
		name: 'Takeoff15', 
		id: 'qSieEaaH', 
		shipping: 0
	},
	{
		name: 'Takeoff20', 
		id: 'XSRTPN89', 
		shipping: 0
	},
	{
		name: 'CardOff-----25',
		id: 'ec5lxgyq',
		shipping: 0
	}
]

// const couponList = [
// 	{
// 		name: 'LINKUPPARTNER', 
// 		id: 'LdPfdhhb',
// 		shipping: 0
// 	},
// 	{
// 		name: 'FREE-EVERYTHING', 
// 		id: 'JL6tgrDt',
// 		shipping: 100
// 	},
// 	{
// 		name: 'Takeoff10', 
// 		id: 'OLAVfMo4',
// 		shipping: 0
// 	},
// 	{
// 		name: 'Takeoff15', 
// 		id: 'z4GjRlaT',
// 		shipping: 0
// 	},
// 	{
// 		name: 'Takeoff20', 
// 		id: 'PPm9WTMy',
// 		shipping: 0
// 	},
// 	{
// 		name: 'CardOff-----25',
// 		id: 'DlTVious',
// 		shipping: 0
// 	}
// ]

module.exports = {
	me: async (req, res) => {
		// this will be updated later
		const card = await Card.findOne({
			account: req.user._id
		}).populate([
			{
				path: 'buttons',
				// select: '-clicks',
				options: { sort: { index: 1 } }
			},
			{
				path: 'socials',
				// select: '-clicks',
				options: { sort: { index: 1 } }
			}
		])
		const code = await Code.findOne({ createdBy: req.user._id }).populate(
			'usedBy',
			'_id username email firstName lastName createdAt'
		)
		const uList = await User.find({ 'payment_details.discount': code.code })
		let usedByOthers = []
		if(uList) {
			usedByOthers = uList.map(val => ({
				id: val.id,
				firstName: val.firstName,
				lastName: val.lastName,
				email: val.email,
				paymentDate: moment(val.payment_details.paymentDate).format('YYYY-MM-DD') || moment(val.updatedAt).format('YYYY-MM-DD'),
				// paymentAmount: (val.payment_details.shipping + val.payment_details.subtotal)
				paymentAmount: '$4'
			})).sort((a, b) => moment(a.paymentDate) - moment(b.paymentDate))
		}
		const dataByMonth = _.chain(usedByOthers)
			.groupBy(e => moment(e.paymentDate).format('YYYY-MM'))
			.map((value, key) => ({
				[key]: value.length
			}))
			.sortBy((value, key) => {
				return key
			})
			.value()
		const monthData = dataByMonth ? getRestArray(dataByMonth, 5) : []
		const monthDataKeys = monthData.map(e => {
			return Object.keys(e)[0]
		})

		const user = req.user.toJSON()

		res.status(200).json({
			...user,
			card,
			code,
			usedByOthers: usedByOthers.filter(e => monthDataKeys.includes(moment(e.paymentDate).format('YYYY-MM'))),
			monthData
		})
	},

	replaceUser: async (req, res) => {
		// request must include all fields: need to add validation
		const newUser = req.body

		const user = await User.findOneAndUpdate(req.user.id, newUser)
		res.status(200).json(user)
	},

	updateUser: async (req, res) => {
		// request can include any number of fields
		const newUser = req.body

		const userBase = await User.findByIdAndUpdate(
			req.user.id,
			removeProps(newUser)
		)
		const user = userBase.toJSON()
		res.status(200).json({ ...user, ...newUser })
	},

	deleteUser: async (req, res) => {
		const user = await User.findByIdAndDelete(req.user.id)
		res.status(200).json(user)
	},

	getClicks: async (req, res) => {
		const table = await req.user.getClicks()
		const concat = ({ city, country }) =>
			city ? `${city}, ${country}` : country
		const clicks = await Session.find(
			{
				fromUser: req.user._id,
				type: 'card'
				// createdAt: {
				// 	$gte: moment()
				// 		.day(moment().weekday() - 7)
				// 		.toDate()
				// }
			},
			'_id source userAgent device unique enteredTime'
		).populate('geoInfo', 'city country')
		const lastUniqueViews = await Session.countDocuments({
			fromUser: req.user._id,
			type: 'card',
			unique: true,
			createdAt: {
				$gte: moment().weekday(-7).toDate(),
				$lte: moment().weekday(-1).toDate()
			}
		})
		const currentUniqueViews = await Session.countDocuments({
			fromUser: req.user._id,
			type: 'card',
			unique: true,
			createdAt: {
				$gte: moment().weekday(0).toDate()
			}
		})
		const heatData = new Array(7)
			.fill(0)
			.map(() => new Array(24).fill(0).map(() => ({ count: 0, weeks: [] })))
		const source = []
		const location = []
		const graph = []
		let clicksCTR = 0
		for (let i = 0; i < clicks.length; i++) {
			const obj = clicks[i]
			/**
			 * Moment Entered Time
			 */
			const mEntered = moment(obj.enteredTime)
			const heatDay = mEntered.weekday()
			const heatHour = mEntered.hour()
			heatData[heatDay][heatHour].count += 1
			if (heatData[heatDay][heatHour].weeks.indexOf(mEntered.week()) === -1) {
				heatData[heatDay][heatHour].weeks.push(mEntered.week())
			}
			if (
				moment(obj.enteredTime).isSameOrAfter(
					moment().day(moment().weekday() - 7)
				)
			) {
				// eslint-disable-next-line
				const exists = await Session.exists({
					$or: [
						{ enteredTime: obj.enteredTime, type: 'button' },
						{ enteredTime: obj.enteredTime, type: 'social' }
					]
				})
				let graphIndex = graph.findIndex(
					value => value.date === moment(obj.enteredTime).format('MM/DD/YYYY')
				)
				if (graphIndex === -1) {
					graphIndex =
						graph.push({
							date: moment(obj.enteredTime).format('MM/DD/YYYY'),
							clicks: 0,
							uniqueViews: 0,
							totalViews: 0
						}) - 1
				}
				graph[graphIndex].totalViews += 1
				if (obj.unique) {
					graph[graphIndex].uniqueViews += 1
				}
				if (exists) {
					graph[graphIndex].clicks += 1
					clicksCTR += 1
				}
			}
			if (obj.unique) {
				let index = source.findIndex(value => value.data === obj.source)
				if (index === -1) {
					index = source.push({ data: obj.source, value: 0 }) - 1
				}
				source[index].value += 1
				if (obj.geoInfo) {
					let locIndex = location.findIndex(
						value => value.data === concat(obj.geoInfo)
					)
					if (locIndex === -1) {
						locIndex =
							location.push({ data: concat(obj.geoInfo), value: 0 }) - 1
					}
					location[locIndex].value += 1
				}
			}
		}
		const heatFinal = heatData.map(value =>
			value.map(({ count, weeks }) => {
				if (!count) return 0
				const result = Number((count / weeks.length).toFixed(2))
				return !Number.isNaN(result) || Number.isFinite(result) ? result : 0
			})
		)
		const totalViews = clicks.length
		res.json({
			...table,
			source,
			location,
			clicksCTR,
			heatData: heatFinal,
			totalViews,
			graph: graph.map(obj => ({
				...obj,
				ctr: Math.round((obj.clicks / obj.totalViews) * 2 * 100) / 2
			})),
			ctr: Math.round((clicksCTR / totalViews) * 2 * 100) / 2,
			lastUniqueViews,
			currentUniqueViews
		})
	},

	getSource: async (req, res) => {
		const concat = ({ city, country }) => `${city}, ${country}`
		const clicks = await Session.find(
			{ fromUser: req.user._id, type: 'card', unique: true },
			'_id source userAgent device'
		).populate('geoInfo', 'city country')
		const source = []
		const location = []
		clicks.forEach(obj => {
			let index = source.findIndex(value => value.source === obj.source)
			if (index === -1) {
				index = source.push({ source: obj.source, value: 0 }) - 1
			}
			source[index].value += 1
			if (obj.geoInfo) {
				let locIndex = location.findIndex(
					value => value.location === concat(obj.geoInfo)
				)
				if (locIndex === -1) {
					locIndex =
						location.push({ location: concat(obj.geoInfo), value: 0 }) - 1
				}
				location[locIndex].value += 1
			}
		})
		res.status(200).json({ source, location })
	},

	newCard: async (req, res) => {
		// create new card
		const exists = await Card.exists({ account: req.user._id })
		if (exists) {
			return res.status(400).send(`For now the maximum of cards is one`)
		}
		const newCard = await Card.create({ ...req.body, account: req.user })
		const card = newCard.toJSON()
		const button = (
			await Button.create({
				title: 'This is your first button!',
				fromCard: card.id,
				index: 0
			})
		).toJSON()
		res.status(201).json({ ...card, buttons: [button], socials: [] })
	},

	updateCard: async (req, res) => {
		// request can include any number of fields
		const { cardId } = req.params
		const newCard = req.body
		const card = (
			await Card.findByIdAndUpdate(cardId, removeProps(newCard))
		).toJSON()
		res.status(200).json({ ...card, ...newCard })
	},

	deleteCard: async (req, res) => {
		const { cardId } = req.params
		const card = await Card.deleteOne({ _id: cardId })
		res.status(200).json({ result: card.deletedCount === 1 })
	},

	newButton: async (req, res) => {
		const { cardId } = req.params
		// which index
		const index = await Button.where({ fromCard: cardId }).count()
		// create new button
		const newButton = await Button.create({
			...req.body,
			index,
			fromCard: cardId
		})
		res.status(201).json(newButton)
	},

	reorderButtons: async (req, res) => {
		const { cardId } = req.params
		const { buttons } = req.body
		const exists = await Button.exists({
			_id: {
				$in: buttons
			},
			fromCard: cardId
		})
		if (!exists) {
			return res
				.status(400)
				.send(`One or more buttons from this list doesn't belong to this card`)
		}
		const count = await Button.where({ fromCard: cardId }).count()
		if (count !== buttons.length) {
			return res
				.status(400)
				.send('All the buttons from the card must be included')
		}
		await buttons.forEach(async (value, index) => {
			await Button.updateOne(
				{
					_id: value
				},
				{ index }
			)
		})
		res.status(200).json({ result: true })
	},

	updateButton: async (req, res) => {
		// request can include any number of fields
		const { buttonId } = req.params
		const newButton = req.body

		// const button = await Button.findByIdAndUpdate(
		// 	buttonId,
		// 	removeProps(newButton)
		// )
		const button = await Button.updateOne(
			{
				_id: buttonId
			},
			removeProps(newButton)
		)
		res.status(200).json({ result: button.nModified === 1 })
	},

	deleteButton: async (req, res) => {
		const { buttonId } = req.params
		const button = await Button.deleteOne({ _id: buttonId })
		res.status(200).json({ result: button.deletedCount === 1 })
	},

	newSocial: async (req, res) => {
		const { cardId } = req.params
		// which index
		const social = await Social.findOne(
			{
				name: req.body.name,
				fromCard: cardId
			},
			'_id'
		)
		if (social) {
			const updated = await Social.updateOne({ _id: social._id }, req.body)
			res.status(200).json({ result: updated.nModified === 1 })
		} else {
			const card = await Card.findOne({_id: cardId});
			const user = await User.findOne({_id: card.account});
			console.log(user.socialArray);
			const socialArray = user.socialArray;
			var index = 0;
			for(var i = 0; i < socialArray.length; i++){
				if(req.body.name.toLowerCase() === socialArray[i].toLowerCase()){
					index = i + 1;
				}
			}
			// create new social
			const newSocial = await Social.create({
				...req.body,
				index,
				fromCard: cardId
			})
			res.status(200).json({ result: newSocial })
		}
		// res.status(201).json({ ...newSocial, ...req.body })
	},

	reorderSocials: async (req, res) => {
		const { cardId } = req.params
		const { socials } = req.body
		const exists = await Social.exists({
			_id: {
				$in: socials
			},
			fromCard: cardId
		})
		if (!exists) {
			return res
				.status(400)
				.send(`One or more socials from this list doesn't belong to this card`)
		}
		const count = await Social.where({ fromCard: cardId }).count()
		if (count !== socials.length) {
			return res
				.status(400)
				.send('All the socials from the card must be included')
		}
		await socials.forEach(async (value, index) => {
			await Social.updateOne(
				{
					_id: value
				},
				{ index }
			)
		})
		res.status(200).json({ result: true })
	},

	updateSocial: async (req, res) => {
		// request can include any number of fields
		const { socialId } = req.params
		const newSocial = removeProps(req.body)

		const social = (
			await Social.findByIdAndUpdate(socialId, newSocial)
		).toJSON()
		res.status(200).json({ ...social, ...newSocial })
	},

	deleteSocial: async (req, res) => {
		const { socialId } = req.params
		const social = await Social.deleteOne({ _id: socialId })
		res.status(200).json({ result: social.deletedCount === 1 })
	},

	resetPwd: async (req, res) => {
		const user = await User.findOne({ pin: req.body.pin }, 'pin local')
		if (!user) {
			return res.status(401).json({ message: 'Incorrect PIN' })
		}
		user.pin = undefined
		user.local.password = req.body.password
		await user.save()
		res.status(200).json({ result: true })
	},

	forgotPwd: async (req, res) => {
		const { email } = req.body
		const user = await User.findOne({ email }, 'firstName')
		if (!user) return res.status(422).json({ message: 'User not found' })
		const pin = getPin()
		user.pin = pin
		await user.save()
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				type: 'OAuth2',
				user: EMAIL_FROM,
				serviceClient: EMAIL_CLIENT_ID,
				privateKey: PRIVATE_KEY_ID
			}
		})
		const mailOptions = {
			from: `"${EMAIL_USERNAME}" <${EMAIL_FROM}>`,
			to: email,
			subject: 'Linkup: Reset Password',
			html: htmlMail(pin, user.firstName)
		}
		transporter.sendMail(mailOptions, function (error) {
			if (error) {
				console.log(error)
				return res.json({ result: 'failed' })
			}
			return res.json({ result: 'success' })
		})
	},
	payment: async(req, res) => {
		try {
			const { amount, metadata, email, name, payment_method, billingDetails, discount, selProducts } = req.body

			let smetadata = {}
			let lmetadata = {}
			selProducts.forEach((val, index) => {
				smetadata[`product-${index}`] = val.id
				lmetadata[`product-${index}`] = `${val.name} x ${val.quantity}` 
				if(val.logoIcon) {
					smetadata[`${val.name}->logo`] = val.logoIcon
				}
				if(val.designIcon) {
					smetadata[`${val.name}->design`] = val.designIcon
				}
			})

			delete billingDetails['email']
			billingDetails['phone'] = ''

			let customer = null

			const exist_customer = await stripe.customers.list({email: email})
			if(exist_customer && exist_customer.data.length > 0) {
				console.log(exist_customer.data[0])
				let curCustomer = exist_customer.data[0]
				customer = await stripe.customers.update(curCustomer.id, {
					email,
					name,
					// payment_method,
					shipping: billingDetails,
					coupon: discount,
					metadata: {...curCustomer.metadata, ...smetadata}
				})
			} else {
				customer = await stripe.customers.create({
					email,
					name,
					payment_method,
					shipping: billingDetails,
					coupon: discount,
					metadata: {...smetadata}
				})
			}

			if(customer) {
				const paymentMethods = await stripe.paymentMethods.list({
					customer: customer.id,
					type: 'card'
				})

				const ipv4Url = RegExp([
					'^https?:\/\/([a-z0-9\\.\\-_%]+:([a-z0-9\\.\\-_%])+?@)?',
					'((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4',
					'][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])?',
					'(:[0-9]+)?(\/[^\\s]*)?$'
				].join(''), 'i');
	
				let domain_url = req.headers.origin.includes('/www.') ? req.headers.origin : (ipv4Url.test(req.headers.origin) ? req.headers.origin :  req.headers.origin.replace('://', '://www.'))

				metadata['username'] = `${domain_url}/${metadata['username']}`
	
				const paymentIntent = await stripe.paymentIntents.create({
					amount,
					currency: 'usd',
					metadata: {...metadata, ...lmetadata, ...smetadata},
					receipt_email: email,
					customer: customer.id,
					payment_method: paymentMethods.data[0].id
				})

				res.status(200).send(paymentIntent.client_secret)
			}
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	},
	getProductValues: async(req, res) => {
		try {
			const amount = await stripe.prices.retrieve('price_1H4rrsI8MHguq5jHAPS9DduC')
			const US = await stripe.prices.retrieve('price_1H4rtBI8MHguq5jHFRCIdtGI')
			const CA = await stripe.prices.retrieve('price_1H4rtBI8MHguq5jHKpu8hxj2')
			const WW = await stripe.prices.retrieve('price_1H4rtBI8MHguq5jHjuYPIboW')

			// let amount = await stripe.prices.retrieve('price_1H3OGsH12hkmxmAWK9i514Zp')
			// let US = await stripe.prices.retrieve('price_1H3P5zH12hkmxmAWy9Zgsk6X')
			// let CA = await stripe.prices.retrieve('price_1H3P5zH12hkmxmAWKY0WC6tD')
			// let WW = await stripe.prices.retrieve('price_1H3P5zH12hkmxmAW8CmQbFEq')

			const result = {
				amount,
				ship: {
					US,
					CA,
					WW
				}
			}
			res.status(200).send(result)
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	},
	sendContactInfo: async(req, res) => {
		try {
			const Airtable = require('airtable')
			const base = new Airtable({apiKey: process.env.AIRTABLE_APIKEY}).base(process.env.AIRTABLE_BASE)
			base('contact sales form - website').create([{
				fields: {
					'First name': req.body.user.firstName,
					'Last name': req.body.user.lastName,
					'Your role': req.body.user.role,
					'Work email': req.body.user.email,
					'Company': req.body.user.company,
					'Phone number': req.body.user.phoneNumber.toString(),
					'Message': req.body.user.introduction,
					"Date of request": moment(new Date()).format('YYYY-MM-DD')
				}
			}], (err, records) => {
				if(err) {
					res.status(500).json({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
						statusCode: 500,
						message: 'Something went wrong on our side. Try again in a few minutes.'
					})
					return
				}
				if(records) {
					res.status(200).json({
						success: true,
						message: 'We got it! Someone from our team will be in touch shortly.'
					})
				}
			})
		} catch(err) {
			res.status(500).json({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
				statusCode: 500,
				message: err.message
			})
		}
	},
	getProductList: async(req, res) => {
		try {
			let productList = await stripe.products.list({limit: 100, active: true})

			let rPList = [], pNameList = [], newList = []
			for(let i = 0; i < productList.data.length; i++) {
				let data = productList.data[i]
				if(data.metadata.category !== 'popsocket' || data.metadata.category !== 'Popsocket' || !data.metadata.category) {
					if(!pNameList.includes(data.metadata.category) && data.metadata.category !== undefined) {
						pNameList.push(data.metadata.category)
					}
					let prices = await stripe.prices.list({product: data.id})
					data['price'] = prices.data ? prices.data[0].unit_amount : 0
					data['prices'] = prices.data
					rPList.push(data)
				}
			}

			pNameList.sort().forEach(item => {
				let details = []
				rPList.forEach(rItem => {
					if(rItem.metadata.category === item) {
						details.push(rItem)
					}
				})
				newList.push({
					'name': item,
					'details': details
				})
			})

			if(newList){
				res.status(200).send(newList)
			} else {
				res.status(400).send({
					statusCode: 400,
					message: 'There is no result'
				})
			}
				
		} catch(err) {
			res.status(500).json({
				statusCode: 500,
				message: err.message
			})
		}
	},
	getTaxList: async(req, res) => {
		try {
			let taxlist = await stripe.taxRates.list({limit: 100})
			if(taxlist){
				res.status(200).send(taxlist)
			} else {
				res.status(400).send({
					statusCode: 400,
					message: 'There is no result'
				})
			}
				
		} catch(err) {
			console.log("err--------->", err)
			res.status(500).json({
				statusCode: 500,
				message: err.message
			})
		}
	},
	getTaxByProvince: async(req, res) => {
		try {
			const taxResult = await stripe.taxRates.list({limit: 100})
			if(taxResult && taxResult.data){
				let result = taxResult.data.find(e => e.jurisdiction === req.body.province)
				res.status(200).send(result)
			} else {
				res.status(400).send({
					statusCode: 400,
					message: 'There is no result'
				})
			}
		} catch(err) {
			res.status(500).json({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
				statusCode: 500,
				message: err.message
			})
		}
	},
	getProductPrices: async(req, res) => {
		try {
			const { selProducts, selShipValue, discountId, quantity, userInfo } = req.body

			let everything = false
			let partner = false

			let discountRate = 0
			let shippingRate = 0
			if(discountId) {
				const discountInfo = await stripe.coupons.retrieve(discountId)
				const shipInfo = couponList.find(e => e.id === discountId)
				discountRate = discountInfo.percent_off / 100
				shippingRate = shipInfo ? shipInfo.shipping / 100 : 0
				everything = (shipInfo.name === 'FREE-EVERYTHING') ? true : false
				partner = (shipInfo.name === 'LINKUPPARTNER' && selProducts.length > 1) ? true : false
			}

			let tax_rate = null

			if(userInfo.shipCountry === 'CA' || userInfo.country === 'Canada') {
				const taxResult = await stripe.taxRates.list({ limit: 100 })
				if(taxResult && taxResult.data) {
					const tResult = taxResult.data.find(e => e.jurisdiction === userInfo.province)
					tax_rate = {
						name: tResult.jurisdiction,
						value: tResult.percentage
					}
				}
			}

			let product_prices = 0
			selProducts.forEach(product => {
				let real_quantity = 1
				if(product.quantity < 10) {
					real_quantity = product.quantity
				} else if(product.quantity >= 10 && product.quantity < 30) {
					real_quantity = product.quantity - product.quantity * 0.1
				} else if(product.quantity >= 30) {
					real_quantity = product.quantity - product.quantity * 0.25
				}

				product_prices += (product.price * real_quantity) / 100
			})

			let subtotal_price = everything ? {
				new: 1.00,
				origin: parseFloat(product_prices).toFixed(2)
			} : {
				new: (discountRate ? parseFloat((product_prices - product_prices * discountRate)).toFixed(2) : parseFloat(product_prices).toFixed(2)),
            	origin: parseFloat(product_prices).toFixed(2)
			}

			let ship_price = {
				new: (shippingRate ? parseFloat((selShipValue.unit_amount / 100) - (selShipValue.unit_amount / 100) * shippingRate).toFixed(2) : parseFloat(selShipValue.unit_amount / 100).toFixed(2)),
            	origin: parseFloat(selShipValue.unit_amount / 100).toFixed(2)
			}

			let discount_price = everything ? parseFloat(parseFloat(subtotal_price.origin) + parseFloat(ship_price.origin) - 1).toFixed(2) : parseFloat(product_prices * discountRate + (selShipValue.unit_amount / 100) * shippingRate).toFixed(2)

			let tax_price = tax_rate ? {
				new: parseFloat(parseFloat(parseFloat(subtotal_price.new) + parseFloat(ship_price.new)) * (tax_rate.value / 100)).toFixed(2),
				origin: parseFloat(parseFloat(parseFloat(subtotal_price.origin) + parseFloat(ship_price.origin)) * (tax_rate.value / 100)).toFixed(2)
			} : {
				new: 0,
				origin: 0
			}

			let total_price = {
				new: parseFloat(parseFloat(subtotal_price.new) + parseFloat(ship_price.new) + parseFloat(tax_price.new)).toFixed(2),
				origin: parseFloat(parseFloat(subtotal_price.origin) + parseFloat(ship_price.origin) + parseFloat(tax_price.origin)).toFixed(2)
			}

			if(subtotal_price){
				res.status(200).send({
					subtotal_price,
					ship_price,
					discount_price,
					total_price,
					tax_rate
				})
			} else if(partner) {
				res.status(400).send({
					statusCode: 400,
					message: 'You have already redeemed this code.'
				})
			} else {
				res.status(400).send({
					statusCode: 400,
					message: 'There is no result'
				})
			}
		} catch(err) {
			console.log("err--------->", err)
			res.status(500).json({
				statusCode: 500,
				message: err.message
			})
		}
	},
	getDiscountRate: async(req, res) => {
		try {
			const discount = await stripe.coupons.retrieve('ec5lxgyq')
			// const discount = await stripe.coupons.retrieve('DlTVious')
			if(discount) {
				res.status(200).json({value: discount.percent_off})
			}
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	},
	getDiscountInfo: async(req, res) => {
		try{
			let req_value = req.body.value

			let existPCode = null
			if(req_value !== undefined || req_value !== '')
				if(req.body.userId === -1) {
					existPCode = await Code.findOne({code: new RegExp(req_value)})
				} else {
					existPCode = await Code.findOne({createdBy: { $ne: req.body.userId}, code: new RegExp(req_value)})
				}
			if(existPCode) {
				console.log(existPCode, 'true')
				if(existPCode.code === req_value) {
					const discount = await stripe.coupons.retrieve('ec5lxgyq')
					// const discount = await stripe.coupons.retrieve('DlTVious')
					if(discount) {
						console.log("------------>>>>>>", discount)
						res.status(200).json({
							result: true,
							discountName: discount.name,
							discountId: discount.id,
							discountValue: discount.percent_off,
							partner: false,
							shipping: 0
						})
					}

				} else {
					res.status(200).json({
						result: true
					})
				}
			} else {
				const cf = couponList.find(e => e.name.toLowerCase().includes(req_value.toLowerCase()))
				if(cf) {
					if(cf.name.toLowerCase() === req_value.toLowerCase()) {
						const discount = await stripe.coupons.retrieve(cf.id)
						if(discount) {
							res.status(200).json({
								result: true,
								discountName: discount.name,
								discountId: discount.id,
								discountValue: discount.percent_off,
								partner: discount.name === 'LINKUPPARTNER' ? true : false,
								shipping: cf.shipping
							})
						}
					} else {
						res.status(200).json({
							result: true
						})
					}
				} else {
					return res.status(403).json({ error: 'That code doesn\'t exist' })
				}
			}

		}catch(err) {
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	},
	getBillData: async(req, res) => {
		const { userId } = req.params
		try {
			let newResult = []
			const rOrder = await Order.find({user: userId})
			rOrder.forEach((rItem, index) => {
				let productItems = []
				if(rItem.products) {
					rItem.products.forEach(pItem => {
						productItems.push(pItem.name)
						if(productItems.logoIcon) {
							productItems.push("Logo")
						}
						if(productItems.designIcon) {
							productItems.push('Design')
						}
					})
				}
				newResult.push({
					key: index,
					orderId: rItem.paymentId,
					paymentDate: moment(rItem.updatedAt).format('MM/DD/YYYY'),
					product: productItems,
					type: '',
					paymentAmount: parseFloat(rItem.total)
				})
			})
			if(newResult) {
				res.status(200).send(newResult)
			}
		}catch(err) {
			res.status(500).json({
				statusCode: 500,
				message: err.message
			})
		}
	},
	getPlanProducts: async(req, res) => {
		try{
			const prices = await stripe.prices.list({limit: 100})

			const plan_product = await stripe.products.retrieve('prod_I4i7iUylYTqALc')
			// const plan_product = await stripe.products.retrieve('prod_IHRJrm8znPcejV')

			if(prices && plan_product) {

				let pproduct = plan_product
				pproduct['prices'] = {
					'Yearly': prices.data.find(e => e.id === 'price_1HghFEI8MHguq5jHnitJ3JAh').unit_amount / 100,
					'Monthly': prices.data.find(e => e.id === 'price_1HghG8I8MHguq5jHLj271K0z').unit_amount / 100,

					// 'Yearly': prices.data.find(e => e.id === 'price_1HgsRGH12hkmxmAWeAInPtxU').unit_amount / 100,
					// 'Monthly': prices.data.find(e => e.id === 'price_1HgsRFH12hkmxmAWWOzAEtgF').unit_amount / 100
				}

				res.status(200).send({
					product: pproduct
				})
			}
		} catch(err) {
			console.log(err)
			res.status(500).json({
				statusCode: 500,
				message: err.message
			})
		}
	},
	planPayment: async(req, res) => {
		try {
			const { amount, metadata, email, name, payment_method, billingDetails } = req.body

			const exist_customer = await stripe.customers.list({email: email})
			if(exist_customer && exist_customer.data.length > 0) {
				let curCustomer = exist_customer.data[0]
				customer = await stripe.customers.update(curCustomer.id, {
					email,
					name,
					// payment_method
				})
			} else {
				customer = await stripe.customers.create({
					email,
					name,
					payment_method
				})
			}

			if(customer) {
				const paymentMethods = await stripe.paymentMethods.list({
					customer: customer.id,
					type: 'card'
				})

				const ipv4Url = RegExp([
					'^https?:\/\/([a-z0-9\\.\\-_%]+:([a-z0-9\\.\\-_%])+?@)?',
					'((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4',
					'][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])?',
					'(:[0-9]+)?(\/[^\\s]*)?$'
				].join(''), 'i');
	
				let domain_url = req.headers.origin.includes('/www.') ? req.headers.origin : (ipv4Url.test(req.headers.origin) ? req.headers.origin :  req.headers.origin.replace('://', '://www.'))

				metadata['username'] = `${domain_url}/${metadata['username']}`
	
				const paymentIntent = await stripe.paymentIntents.create({
					amount,
					currency: 'usd',
					metadata,
					receipt_email: email,
					customer: customer.id,
					payment_method: paymentMethods.data[0].id
				})

				res.status(200).send(paymentIntent.client_secret)
			}
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	}
}
