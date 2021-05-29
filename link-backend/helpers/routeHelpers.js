const passport = require('passport')
const mongoose = require('mongoose')
const Card = require('../models/card')
const User = require('../models/user')
const Button = require('../models/button')
const Social = require('../models/social')
const { getId } = require('../utils')

module.exports = {
	/**
	  Check if the user is authenticated
	 */
	authenticated: passport.authenticate('jwt', { session: false }),

	validateBody: schema => {
		return (req, res, next) => {
			const result = schema.validate(req.body, { abortEarly: false })
			if (result.error) {
				return res
					.status(400)
					.json({
						error:
							result.error.details.length > 1
								? result.error.details.map(({ message }) => message)
								: result.error.message
					})
				// return res.status(400).send(result.error.message)
			}
			if (!req.value) {
				req.value = {}
			}
			req.value.body = result.value
			next()
		}
	},
	/**
	 * This function is to check if the informed Id is valid or not
	 * @param {string} value which param is to validate
	 */
	isIdValid: value => {
		return (req, res, next) => {
			if (!mongoose.Types.ObjectId.isValid(req.params[value])) {
				return res.status(400).send('The informed ID is not valid')
			}
			next()
		}
	},
	/**
	 * To check if the card belongs to the authenticaded user
	 * @param {'card' | 'button' | 'social'} model
	 */
	isFromAuthUser: (model = 'card') => {
		return async (req, res, next) => {
			const { cardId } = req.params
			const card = await Card.findById(cardId, 'account -_id')
			if (!card) {
				return res.status(400).send(`This card doesn't exist`)
			}
			const accountId = card.account.toString()
			if (accountId !== req.user.id) {
				return res.status(403).send('This card is not yours')
			}
			if (model === 'button') {
				const { buttonId } = req.params
				const button = await Button.findById(buttonId, 'fromCard -_id')
				if (!button) {
					return res.status(400).send(`This button doesn't exist`)
				}
				const fromCardId = button.fromCard.toString()
				if (fromCardId !== cardId) {
					return res.status(400).send(`This button doesn't belong to this card`)
				}
			}
			if (model === 'social') {
				const { socialId } = req.params
				const social = await Social.findById(socialId, 'fromCard -_id')
				if (!social) {
					return res.status(400).send(`This social doesn't exist`)
				}
				const fromCardId = social.fromCard.toString()
				if (fromCardId !== cardId) {
					return res.status(400).send(`This social doesn't belong to this card`)
				}
			}
			next()
		}
	},
	/**
	 * To check if the card isPublic or from user if authorization is set
	 * @param {'card' | 'button' | 'social'} model
	 * @param {boolean} isClick
	 */
	isPublicOrFromUser: (model = 'card', isClick = false) => {
		return async (req, res, next) => {
			const { cardId, username } = req.params
			if (isClick) {
				res.locals.clickedTime = new Date()
			}
			let id = null
			try {
				id = getId(req)
			} catch (error) {
				res.status(403).send('Invalid Token')
				return
			}
			const user = await User.findOne({ username }, '_id')
			if (!user) {
				return res.status(400).send(`This user doesn't exist`)
			}
			const card = await Card.findById(cardId).select('isPublic account -_id')
			if (!card) {
				return res.status(400).send(`This card doesn't exist`)
			}
			const accountId = card.account.toString()
			if (accountId !== user.id) {
				return res.status(400).send(`This card doesn't belong to this user`)
			}
			if (accountId === id && isClick) {
				return res
					.status(400)
					.send(`You can't add link views to your own card!`)
			}
			if (!card.isPublic && accountId === id) {
				res.locals.state = 'isFromUser'
			} else if (card.isPublic) {
				res.locals.state = 'isPublic'
				if (isClick) {
					res.locals.userId = id
					res.locals.accountId = accountId
				}
			} else {
				return res
					.status(403)
					.send(
						'Something cool is brewing here. This card is private, so check back later'
					)
			}
			if (model === 'button') {
				const { buttonId } = req.params
				const button = await Button.findById(buttonId, 'fromCard -_id')
				if (!button) {
					return res.status(400).send(`This button doesn't exist`)
				}
				const fromCardId = button.fromCard.toString()
				if (fromCardId !== cardId) {
					return res.status(400).send(`This button doesn't belong to this card`)
				}
			} else if (model === 'social') {
				const { socialId } = req.params
				const social = await Social.findById(socialId, 'fromCard -_id')
				if (!social) {
					return res.status(400).send(`This social doesn't exist`)
				}
				const fromCardId = social.fromCard.toString()
				if (fromCardId !== cardId) {
					return res
						.status(400)
						.send(`This social icon doesn't belong to this card`)
				}
			}
			next()
		}
	}
}
