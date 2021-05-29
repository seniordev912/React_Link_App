const JWT = require('jsonwebtoken')
const moment = require('moment')
const nodemailer = require('nodemailer')
const _ = require('lodash')
const cors = require('cors')
const uuid = require('uuid/v4')
const { use } = require('passport')
const User = require('../../models/user')
const Code = require('../../models/code')
const Card = require('../../models/card')
const GeoInfo = require('../../models/geoInfo')
const Order = require('../../models/order')
const Social = require('../../models/social')
const { sendSignEmail } = require('../../helpers/sendgridHelper')
const {
	JWT_SECRET,
	EMAIL_USERNAME,
	EMAIL_FROM,
	EMAIL_CLIENT_ID,
	PRIVATE_KEY_ID
} = require('../../config')
const { 
	getGeoInfo, 
	getRestArray, 
	htmlPurchaseMail, 
	validateUName, 
	validateUppercase,
	validateEmail, 
	validatePostCode 
} = require('../../utils')
const { me } = require('.')
require('dotenv').config()


const signToken = user => {
	return JWT.sign(
		{
			iss: 'LinkUp',
			sub: user.id,
			iat: new Date().getTime(), // current time
			exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
		},
		JWT_SECRET
	)
}

module.exports = {
	signUp: async (req, res) => {
		try{

			const {
				email,
				password,
				username,
				firstName,
				lastName,
				displayName,
				// referralCode,
				cardOrder,
				payment_details,
				selProducts
			} = req.body

			const foundUser = await User.exists({
				$or: [
					{ 'google.email': email },
					{ 'facebook.email': email },
					{ 'instagram.email': email },
					{ 'local.email': email },
					{ email }
				]
			})
			if (foundUser) {
				return res.status(403).json({ error: 'Email is already in use' })
			}

			const newUser = new User({
				username,
				firstName,
				lastName,
				displayName,
				email,
				cardOrder,
				// referralCode: existsCode,
				payment_details,
				methods: ['local'],
				local: {
					email,
					password
				}
			})
			const geo = getGeoInfo(req)
			if (geo) {
				await GeoInfo.create({ ...geo, user: newUser })
			}
 			let code = {}
			newUser.save()
				.then(async resp => {
					Code.create({ createdBy: newUser, code: username })
						.then(async resp => {
							code = await Code.findOne({createdBy: newUser})
							const token = signToken(newUser)
							const user = newUser.toJSON()
							let newPResult = []
							if(selProducts || payment_details) {
								selProducts.forEach(val => {
									let obj = {}
									obj['id'] = val.id
									obj['name'] = val.name
									obj['quantity'] = val.quantity
									if(val.logoIcon) {
										obj['logoIcon'] = val.logoIcon
									}
									if(val.designIcon) {
										obj['designIcon'] = val.designIcon
									}
									newPResult.push(obj)
								})
								await Order.create({
									isSaved: payment_details.isSaved,
									country: payment_details.country,
									city: payment_details.city,
									line1: payment_details.street_num,
									line2: payment_details.unit_num,
									province: payment_details.state,
									postal_code: payment_details.zipcode,
									subtotal: payment_details.subtotal,
									shipping: payment_details.shipping,
									paymentId: payment_details.paymentId,
									paymentSource: payment_details.paymentSource,
									total: payment_details.total,
									user: user.id,
									products: newPResult
								})
							}
							require('dns').resolve('sendgrid.com', function(err) {
								if(err) {
									console.log("No connection")
								} else {
									console.log("Connected")
									sendSignEmail(req, {
										to: email
									})
								}
							})
							res.status(200).json({
								token,
								user: {
									...user,
									code,
									card: null
								}
							})
						})
						.catch()
				})
				.catch(err => {
					res.status(500).json({ statusCode: 500, message: err.message })
				})
		}catch(err) {
			console.log(err)
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	},
	newsignup: async (req, res) => {
		try{
			const {
				email,
				username,
				firstName,
				lastName,
				// referralCode,
				cardOrder,
				payment_details
			} = req.body

			const foundUser = await User.exists({
				$or: [
					{ 'google.email': email },
					{ 'facebook.email': email },
					{ 'instagram.email': email },
					{ 'local.email': email },
					{ email }
				]
			})
			if (foundUser) {
				return res.status(403).json({ error: 'Email is already in use' })
			}
			let existsCode
			// if (referralCode) {
			// 	existsCode = await Code.findOne({ code: referralCode })
			// 	if (!existsCode) {
			// 		return res
			// 			.status(403)
			// 			.json({ error: `This referral code doesn't exists` })
			// 	}
			// }

			const newUser = new User({
				username,
				firstName,
				lastName,
				email,
				cardOrder,
				// referralCode: existsCode,
				payment_details,
				methods: ['local']
			})
			const geo = getGeoInfo(req)
			if (geo) {
				await GeoInfo.create({ ...geo, user: newUser })
			}
			const code = await Code.create({ createdBy: newUser })
			await newUser.save()
			// const token = signToken(newUser)
			const user = newUser.toJSON()
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
				subject: 'Linkup: Thanks for your purchase',
				html: htmlPurchaseMail(email, `${firstName} ${lastName}`)
			}
			transporter.sendMail(mailOptions, function (error) {
				if (error) {
					console.log(error)
					// return res.json({ result: 'failed' })
				}
				// return res.json({ result: 'success' })
			})
			res.status(200).json({
				// token,
				user: {
					...user,
					code,
					card: null
				}
			})
		}catch(err) {
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	},
	confirmsignup: async (req, res) => {
		const { billingInfos } = req.body

		if(req.body.step === 1) {
			const errorMsg = []
			Object.keys(billingInfos).forEach(item => {
				console.log(billingInfos[item])
				if(billingInfos[item] === '' || !billingInfos[item]) {
					errorMsg.push(item)
				}
				if(item === 'username') {
					if(billingInfos[item].includes(' ')){
						res.status(200).json({ success: false, message: 'Username must not contain any spaces' })
					} else if(validateUppercase(billingInfos[item])) {
						res.status(200).json({ success: false, message: 'Username must not contain any uppercase letters' })
					} else if (!validateUName(billingInfos[item])){
						res.status(200).json({ success: false, message: 'Username must contain letters, numbers, hyphen, underscore' })
					}
				}
			})

			if(!validatePostCode(billingInfos.country, billingInfos.zipcode)){
				res.status(200).json({ success: false, message: 'Please enter a valid zip code.' })
			} else if(errorMsg && errorMsg.length > 0) {
				res.status(200).json({ success: false, message: 'All input fields are mandatory' })
			} else {
				res.status(200).json({ success: true })
			}
		} else if(req.body.step === 2) {
			const { userInfo } = req.body
			const errorMsg = []
			const requireList = ['email', 'username', 'lastname', 'firstname']
			requireList.forEach(k => {
				if(userInfo[k] === '' || !userInfo[k]) {
					errorMsg.push(k)
				}
				if(userInfo[k] && k === 'username') {
					if(userInfo[k].includes(' ')){
						res.status(200).json({ success: false, message: 'Username must not contain any spaces' })
					} else if (!validateUName(userInfo[k])){
						res.status(200).json({ success: false, message: 'Username must contain letters, numbers, hyphen, underscore' })
					} else if (userInfo[k] && userInfo[k].length < 3) {
						res.status(200).json({ success: false, message: 'Username length must be at least 3 characters' })
					}
				}
			})
			if(errorMsg && errorMsg.length > 0) {
				res.status(200).json({ success: false, message: 'All input fields are mandatory, with the exception of the discount code.' })
			} else {
				res.status(200).json({ success: true })
			}
		} else if(req.body.step === 3) {
			res.status(200).json({ success: true })
		}
	},
	signIn: async (req, res) => {
		const token = signToken(req.user)
		res.status(200).json({ token, user: req.user })
	},
	socialUpdate: async (req, res) => {
		var userId = req.body.userId;
		var updatedSocialOrder = req.body.socialArray;
		User.findByIdAndUpdate(userId, {socialArray: req.body.socialArray})
			.then(resp =>{
				var user = User.findById(userId)
				Card.findOne({account: userId})
					.then(resCard => {
							Social.find({fromCard: resCard._id})
								.then(async resAllSocials => {
									for(var i = 0; i < resAllSocials.length; i++){
										for(var j = 0; j < updatedSocialOrder.length; j++){
											if(resAllSocials[i].name.toLowerCase() === updatedSocialOrder[j].toLowerCase()){
												await Social.findByIdAndUpdate(resAllSocials[i]._id, {index: (j + 1)});
											}
										}
									}
								})
								.catch()
					})
					.catch()
				res.status(200).json({success: true});
			})
			.catch(err=> {
				res.status(500).json({ statusCode: 500, message: err.message })
			})
	}, 
	auth: async (req, res) => {
		try{
			const token = signToken(req.user)
			if(!req.user.cardOrder) {
				if(req.user.payment_details && Object.keys(req.user.payment_details).length > 4) {
					await User.findOneAndUpdate({_id: req.user.id}, {cardOrder: true})
						.then(resp => {
							if(resp) {
								req.user.cardOrder = true
							}
						})
						.catch()
				}
			}

			var card = {}
			await Card.findOne({
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
			]).then(resp =>{
				card = resp
			})
			
			var code = {}
			await Code.findOne({ createdBy: req.user._id }).populate(
				'usedBy',
				'id username firstName lastName email createdAt'
			).then(resp => {
				code = resp
			})

			let usedByOthers = []
			await User.find({ 'payment_details.discount': code.code })
				.then(uList =>{
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
				})
				.catch()
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
				token,
				user: { ...user,
					card,
					code,
					usedByOthers: usedByOthers.filter(e => monthDataKeys.includes(moment(e.paymentDate).format('YYYY-MM'))),
					monthData
				}
			})
		} catch(err) {
		}
	},
	googleAuth: async (req, res) => {
		const token = signToken(req.user)
		res.status(200).json({ token, user: req.user })
	},
	linkGoogle: async (req, res) => {
		res.json({
			result: true,
			methods: req.user.methods,
			message: 'Successfully linked account with Google'
		})
	},
	unlinkGoogle: async (req, res) => {
		if (req.user.google) {
			req.user.google = undefined
		}
		const googleStrPos = req.user.methods.indexOf('google')
		if (googleStrPos >= 0) {
			req.user.methods.splice(googleStrPos, 1)
		}
		await req.user.save()
		res.json({
			result: true,
			methods: req.user.methods,
			message: 'Successfully unlinked account from Google'
		})
	},
	facebookAuth: async (req, res) => {
		const token = signToken(req.user)
		res.status(200).json({ token, user: req.user })
	},
	linkFacebook: async (req, res) => {
		res.json({
			result: true,
			methods: req.user.methods,
			message: 'Successfully linked account with Facebook'
		})
	},
	unlinkFacebook: async (req, res) => {
		if (req.user.facebook) {
			req.user.facebook = undefined
		}
		const facebookStrPos = req.user.methods.indexOf('facebook')
		if (facebookStrPos >= 0) {
			req.user.methods.splice(facebookStrPos, 1)
		}
		await req.user.save()
		res.json({
			result: true,
			methods: req.user.methods,
			message: 'Successfully unlinked account from Facebook'
		})
	},
	instagramAuth: async (req, res) => {
		const token = signToken(req.user)
		res.status(200).json({ token, user: req.user })
	},
	linkInstagram: async (req, res) => {
		res.json({
			result: true,
			methods: req.user.methods,
			message: 'Successfully linked account with Instagram'
		})
	},
	unlinkInstagram: async (req, res) => {
		if (req.user.instagram) {
			req.user.instagram = undefined
		}
		const instagramStrPos = req.user.methods.indexOf('instagram')
		if (instagramStrPos >= 0) {
			req.user.methods.splice(instagramStrPos, 1)
		}
		await req.user.save()

		res.json({
			result: true,
			methods: req.user.methods,
			message: 'Successfully unlinked account from Instagram'
		})
	},
	setShippingDetails: async(req, res) => {
		const { token, data, selProducts } = req.body
		const user = JWT.verify(token, JWT_SECRET)
		const sel_user = await User.findOne({_id: user.sub})
		let ship_details = {}
		if(sel_user && sel_user.payment_details) {
			ship_details = { ...sel_user.payment_details, ...data }
		} else {
			ship_details = data
		}
		console.log(user, sel_user, data)
		let newPResult = []
		selProducts.forEach(val => {
			let obj = {}
			obj['id'] = val.id
			obj['name'] = val.name
			obj['quantity'] = val.quantity
			if(val.logoIcon) {
				obj['logoIcon'] = val.logoIcon
			}
			if(val.designIcon) {
				obj['designIcon'] = val.designIcon
			}
			newPResult.push(obj)
		})
		ship_details.paymentDate = moment()
		const result = await User.findOneAndUpdate({_id: user.sub}, { cardOrder: true, payment_details: ship_details })
		await Order.create({
			isSaved: data.isSaved,
			country: data.payment_details.country,
			city: data.payment_details.city,
			line1: data.payment_details.street_num,
			line2: data.payment_details.unit_num,
			province: data.payment_details.state,
			postal_code: data.payment_details.zipcode,
			subtotal: data.payment_details.subtotal,
			shipping: data.payment_details.shipping,
			paymentId: data.payment_details.paymentId,
			paymentSource: data.payment_details.paymentSource,
			total: data.payment_details.total,
			user: user.sub,
			products: newPResult
		})
		res.status(200).json({ result })
	},
	savePlanStatus: async(req, res) => {
		try{
			const { token, planType, values, product } = req.body
			const user = JWT.verify(token, JWT_SECRET)
			console.log('---------->>>>>>', values)
			const result = await User.findOneAndUpdate({_id: user.sub}, { planType })
			if(values) {
				await Order.create({
					isSaved: values.isSaved,
					country: values.country,
					city: values.city,
					line1: values.street_num,
					line2: values.unit_num,
					province: values.state,
					postal_code: values.zipcode,
					paymentId: values.paymentId,
					total: values.total,
					user: user.sub,
					paymentSource: values.paymentSource,
					products: [
						{
							id: product.id,
							name: product.name,
							quantity: 1
						}
					]
				})
			}
			res.status(200).json({ result })
		} catch(err) {
			console.log('err-------------->>>>>>', err)
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	},
	setPassword: async(req, res) => {
		try{
			const user = await User.findOne({email: req.body.email}, 'firstName, local')
			const uData = user.toJSON()
			if(!uData.local) {
				user.local = {
					email: req.body.email,
					password: req.body.password
				}
				user.save(async() => {
					const nUser = await User.findOne({email: req.body.email})
					const code = await Code.findOne({createdBy: nUser._id})
					// const token = signToken(new User({
					//  username: nUser.username,
					// 	firstName: nUser.firstName,
					// 	lastName: nUser.lastName,
					// 	email: nUser.email,
					// 	cardOrder: nUser.cardOrder,
					// 	payment_details: nUser.payment_details,
					// 	methods: nUser.methods,
					// 	local: {
					// 		email: nUser.email,
					// 		password: nUser.local.password
					// 	},
					// }))

					const token = signToken({
						username: nUser.username,
						firstName: nUser.firstName,
						lastName: nUser.lastName,
						email: nUser.email,
						cardOrder: nUser.cardOrder,
						payment_details: nUser.payment_details,
						methods: nUser.methods,
						id: nUser._id,
						local: {
							email: nUser.email,
							password: nUser.local.password
						}
					})

					res.status(200).json({
						success: true,
						message: 'Password set successfully',
						token,
						user: {
							...nUser.toJSON(),
							code,
							card: null
						}
					})
				})
			} else {
				return res.status(400).json({
					success: false,
					message: 'Password already exists'
				})
			}
		}catch(err){
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	},
	
	checkUniqueEmail: async(req, res) => {
		try {
			const count = await User.countDocuments({email: req.params.email})

			res.status(200).json({value: count})
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	},
	checkUniqueUserName: async(req, res) => {
		try {
			const count = await User.countDocuments({username: req.params.userName})

			res.status(200).json({value: count})
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	}
}
