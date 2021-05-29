const User = require('../models/user')
const Card = require('../models/card')
const Button = require('../models/button')
const Social = require('../models/social')
const GeoInfo = require('../models/geoInfo')
const Session = require('../models/session')
const { getId, getClientIp, getGeoInfo } = require('../utils')
const { IN_PROD } = require('../config')

module.exports = {
	// get users
	index: async (_req, res) => {
		// TODO: Pagination
		const users = await User.find().limit(20)
		res.status(200).json(users)
	},

	addView: async (req, res) => {
		const { enteredTime, source, userAgent } = req.body
		const { userId, accountId } = res.locals
		const { cardId } = req.params
		if (req.device.type === 'bot') {
			return res.status(403).send(`Bots don't have access`)
		}
		const ip = getClientIp(req)
		if (!ip && IN_PROD) {
			return res.status(400).send(`Couldn't add a view to this card`)
		}
		if (ip) {
			const geoInfo = await GeoInfo.exists({ ip, user: accountId })
			if (geoInfo) {
				return res.status(400).send(`You can't add views to your own card!`)
			}
		}
		const geo = getGeoInfo(req)
		if (!geo && IN_PROD) {
			return res.status(400).send(`Couldn't track views in this card`)
		}
		const sessionObj = {
			enteredTime,
			source,
			type: 'card',
			fromUser: accountId,
			device: req.device.type,
			userAgent
		}
		const currentDate = new Date()
		const existsSess = await Session.exists({
			$or: [
				{
					createdAt: {
						$gte: new Date(
							new Date(
								currentDate.setHours(currentDate.getHours() - 1)
							).setMinutes(currentDate.getMinutes() - 5)
						)
					},
					user: userId,
					fromUser: accountId,
					type: 'card'
				},
				{
					ip,
					createdAt: {
						$gte: new Date(
							new Date(
								currentDate.setHours(currentDate.getHours() - 1)
							).setMinutes(currentDate.getMinutes() - 5)
						)
					},
					fromUser: accountId,
					type: 'card'
				}
			]
		})
		if (existsSess) {
			return res
				.status(400)
				.send(
					'To add a new view need to await at least 1 hour since your last view'
				)
		}
		const isUnique = !(await Session.exists({
			$or: [
				{
					user: userId,
					fromUser: accountId,
					type: 'card'
				},
				{
					ip,
					fromUser: accountId,
					type: 'card'
				}
			]
		}))
		if (isUnique) {
			sessionObj.unique = true
		}
		if (geo) {
			const exists = await GeoInfo.findOne(
				{ ip, device: req.device.type },
				'_id'
			)
			if (!exists) {
				const geoDoc = await GeoInfo.create({ ...geo, userAgent })
				sessionObj.geoInfo = geoDoc
				sessionObj.ip = ip
			} else {
				sessionObj.geoInfo = exists
				sessionObj.ip = ip
			}
		}
		if (userId) {
			sessionObj.user = userId
		}
		const session = await Session.create(sessionObj)
		const card = await Card.updateOne(
			{ _id: cardId },
			{ $push: { views: session } }
		)
		res.status(200).json({ result: card.nModified === 1 })
	},

	getUser: async (req, res) => {
		const { username } = req.params
		// Mongoose function to get username
		const userBase = await User.findOne(
			{ username },
			'username firstName createdAt'
		)
		if (!userBase) {
			return res.json({ result: false, error: `This user doesn't exist.` })
		}
		const user = userBase.toJSON()
		const rest = {}
		// this will be handled with populate later
		let card = null
		const existCard = await Card.findOne({ account: user.id }, 'isPublic -_id')
		if (!existCard) {
			rest.error = `This user hasn't setup his card yet`
		} else if (!existCard.isPublic) {
			rest.error = 'Something cool is brewing here, come back later!'
		} else {
			const cardBase = await Card.findOne({
				account: user.id
			}).populate([
				{
					path: 'buttons',
					select: '-clicks',
					options: { sort: { index: 1 } }
				},
				{
					path: 'socials',
					select: '-clicks',
					match: { isActive: true },
					options: { sort: { index: 1 } }
				}
			])
			card = cardBase.toJSON()
		}

		res.status(200).json({
			result: true,
			user: {
				...user,
				card
			},
			...rest
		})
	},

	getCards: async (req, res) => {
		const { username } = req.params
		let id = null
		try {
			id = getId(req)
		} catch (error) {
			res.status(403).send('Invalid Token')
			return
		}
		const user = await User.findOne({ username }, '_id')
		if (id === user.id) {
			const cards = await Card.find({ account: id })
			return res.status(200).json(cards)
		}
		const cards = await Card.find({
			account: user.id,
			isPublic: true
		}).populate('account', 'firstName username')
		res.status(200).json(cards)
	},

	getCard: async (req, res) => {
		const { cardId } = req.params
		const { state } = res.locals
		if (state === 'isFromUser') {
			const card = await Card.findById(cardId)
			return res.status(200).json(card)
		}
		const card = await Card.findById(cardId).populate(
			'account',
			'firstName username'
		)
		res.status(200).json(card)
	},

	getButtons: async (req, res) => {
		const { cardId } = req.params
		const buttons = await Button.find({ fromCard: cardId }, '-clicks').sort(
			'index'
		)
		res.status(200).json({
			result: true,
			value: buttons
		})
	},

	getButton: async (req, res) => {
		const { buttonId } = req.params
		const button = await Button.findById(buttonId, '-clicks')
		res.status(200).json({
			result: true,
			value: button
		})
	},

	clickButton: async (req, res) => {
		const { enteredTime, source } = req.body
		const { userId, accountId, clickedTime } = res.locals
		const { buttonId } = req.params
		if (req.device.type === 'bot') {
			return res.status(403).send(`Bots don't have access`)
		}
		const ip = getClientIp(req)
		if (!ip && IN_PROD) {
			return res.status(400).send(`Couldn't add clicks in this button`)
		}
		if (ip) {
			const geoInfo = await GeoInfo.exists({ ip, user: accountId })
			if (geoInfo) {
				return res.status(400).send(`You can't add clicks to your own card!`)
			}
		}
		const geo = getGeoInfo(req)
		if (!geo && IN_PROD) {
			return res.status(400).send(`Couldn't track clicks in this button`)
		}
		const sessionObj = {
			enteredTime,
			source,
			type: 'button',
			fromUser: accountId,
			device: req.device.type,
			clickedTime
		}
		const currentDate = new Date()
		const existsSess = await Session.find(
			{
				$or: [
					{
						createdAt: {
							$gte: new Date(
								new Date(
									currentDate.setHours(currentDate.getHours() - 1)
								).setMinutes(currentDate.getMinutes() - 5)
							)
						},
						user: userId,
						fromUser: accountId,
						type: 'button'
					},
					{
						ip,
						createdAt: {
							$gte: new Date(
								new Date(
									currentDate.setHours(currentDate.getHours() - 1)
								).setMinutes(currentDate.getMinutes() - 5)
							)
						},
						fromUser: accountId,
						type: 'button'
					}
				]
			},
			'_id'
		)

		if (existsSess.length > 0) {
			let shouldCount = true
			for (let i = 0; i < existsSess.length; i++) {
				const { id } = existsSess[i]
				// eslint-disable-next-line no-await-in-loop
				const isFromButton = await Button.exists({ views: { $elemMatch: id } })
				if (isFromButton) {
					shouldCount = false
					break
				}
			}
			sessionObj.count = shouldCount
			// existsSess.forEach(async value => {
			// 	if (!shouldCount) {
			// 		const { id } = value
			// 		const isFromButton = await Button.exists({ views: { $elemMatch: id } })
			// 		if (isFromButton) {
			// 			shouldCount = true
			// 		}
			// 	}
			// })
		} else {
			sessionObj.count = true
		}
		if (geo) {
			const exists = await GeoInfo.findOne(
				{ ip, device: req.device.type },
				'_id'
			)
			if (!exists) {
				const geoDoc = await GeoInfo.create(geo)
				sessionObj.geoInfo = geoDoc
				sessionObj.ip = ip
			} else {
				sessionObj.geoInfo = exists
				sessionObj.ip = ip
			}
		}
		if (userId) {
			sessionObj.user = userId
		}
		const session = await Session.create(sessionObj)
		const button = await Button.updateOne(
			{ _id: buttonId },
			{ $push: { clicks: session } }
		)
		res.status(200).json({ result: button.nModified === 1 })
	},

	getSocials: async (req, res) => {
		const { cardId } = req.params
		const socials = await Social.find({ fromCard: cardId }, '-clicks').sort(
			'index'
		)
		res.status(200).json({
			result: true,
			value: socials
		})
	},

	getSocial: async (req, res) => {
		const { socialId } = req.params
		const social = await Social.findById(socialId, '-clicks')
		res.status(200).json({
			result: true,
			value: social
		})
	},

	clickSocial: async (req, res) => {
		const { enteredTime, source } = req.body
		const { userId, accountId, clickedTime } = res.locals
		const { socialId } = req.params
		if (req.device.type === 'bot') {
			return res.status(403).send(`Bots don't have access`)
		}
		const ip = getClientIp(req)
		if (!ip && IN_PROD) {
			return res.status(400).send(`Couldn't add clicks in this social icon`)
		}
		if (ip) {
			const geoInfo = await GeoInfo.exists({ ip, user: accountId })
			if (geoInfo) {
				return res.status(400).send(`You can't add clicks to your own card!`)
			}
		}
		const geo = getGeoInfo(req)
		if (!geo && IN_PROD) {
			return res.status(400).send(`Couldn't track clicks in this social icon`)
		}
		const sessionObj = {
			enteredTime,
			source,
			type: 'social',
			fromUser: accountId,
			device: req.device.type,
			clickedTime
		}
		const currentDate = new Date()
		const existsSess = await Session.exists({
			$or: [
				{
					createdAt: {
						$gte: new Date(
							new Date(
								currentDate.setHours(currentDate.getHours() - 1)
							).setMinutes(currentDate.getMinutes() - 5)
						)
					},
					user: userId,
					fromUser: accountId,
					type: 'social'
				},
				{
					ip,
					createdAt: {
						$gte: new Date(
							new Date(
								currentDate.setHours(currentDate.getHours() - 1)
							).setMinutes(currentDate.getMinutes() - 5)
						)
					},
					fromUser: accountId,
					type: 'social'
				}
			]
		})
		if (existsSess.length > 0) {
			let shouldCount = true
			for (let i = 0; i < existsSess.length; i++) {
				const { id } = existsSess[i]
				// eslint-disable-next-line no-await-in-loop
				const isFromButton = await Button.exists({ views: { $elemMatch: id } })
				if (isFromButton) {
					shouldCount = false
					break
				}
			}
			sessionObj.count = shouldCount
			// existsSess.forEach(async value => {
			// 	if (!shouldCount) {
			// 		const { id } = value
			// 		const isFromButton = await Button.exists({ views: { $elemMatch: id } })
			// 		if (isFromButton) {
			// 			shouldCount = true
			// 		}
			// 	}
			// })
		} else {
			sessionObj.count = true
		}
		if (existsSess) {
			sessionObj.count = false
		}
		if (geo) {
			const exists = await GeoInfo.findOne(
				{ ip, device: req.device.type },
				'_id'
			)
			if (!exists) {
				const geoDoc = await GeoInfo.create(geo)
				sessionObj.geoInfo = geoDoc
				sessionObj.ip = ip
			} else {
				sessionObj.geoInfo = exists
				sessionObj.ip = ip
			}
		}
		if (userId) {
			sessionObj.user = userId
		}
		const session = await Session.create(sessionObj)
		const social = await Social.updateOne(
			{ _id: socialId },
			{ $push: { clicks: session } }
		)
		res.status(200).json({ result: social.nModified === 1 })
	}
}
