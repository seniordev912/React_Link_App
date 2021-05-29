const router = require('express-promise-router')()
const {
	isIdValid,
	validateBody,
	isPublicOrFromUser
} = require('../helpers/routeHelpers')
const { clickSchema } = require('../validators')
const UsersController = require('../controllers/users')

router.route('/:username').get(UsersController.getUser)

router.route('/:username/checkusername').get(UsersController.checkUser)

// here I did the verification inside the controller because was unique
router.route('/:username/cards').get(UsersController.getCards)

router
	.route('/:username/cards/:cardId')
	.get(isIdValid('cardId'), isPublicOrFromUser(), UsersController.getCard)
	.post(
		isIdValid('cardId'),
		isPublicOrFromUser('card', true),
		UsersController.addView
	)

router
	.route('/:username/cards/:cardId/buttons')
	.get(isIdValid('cardId'), isPublicOrFromUser(), UsersController.getButtons)

router
	.route('/:username/cards/:cardId/buttons/:buttonId')
	.get(
		isIdValid('cardId'),
		isIdValid('buttonId'),
		isPublicOrFromUser('button'),
		UsersController.getButton
	)
	.post(
		isIdValid('cardId'),
		isIdValid('buttonId'),
		validateBody(clickSchema),
		isPublicOrFromUser('button', true),
		UsersController.clickButton
	)

router
	.route('/:username/cards/:cardId/socials')
	.get(isIdValid('cardId'), isPublicOrFromUser(), UsersController.getSocials)

router
	.route('/:username/cards/:cardId/socials/:socialId')
	.get(
		isIdValid('cardId'),
		isIdValid('socialId'),
		isPublicOrFromUser('social'),
		UsersController.getSocial
	)
	.post(
		isIdValid('cardId'),
		isIdValid('socialId'),
		validateBody(clickSchema),
		isPublicOrFromUser('social', true),
		UsersController.clickSocial
	)

module.exports = router
