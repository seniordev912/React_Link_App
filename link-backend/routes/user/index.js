const router = require('express-promise-router')()
const {
	isIdValid,
	validateBody,
	isFromAuthUser,
	authenticated
} = require('../../helpers/routeHelpers')
const { button, social, user, card } = require('../../validators')
const UserController = require('../../controllers/user')
const auth = require('./auth')

router
	.route('/')
	.get(authenticated, UserController.me)
	// .put(authenticated, UserController.replaceUser)
	.patch(
		validateBody(user.updateSchema),
		authenticated,
		UserController.updateUser
	)
	.delete(authenticated, UserController.deleteUser)

router
	.route('/cards')
	.post(authenticated, validateBody(card.createUSchema), UserController.newCard)

router
	.route('/cards/:cardId')
	.patch(
		isIdValid('cardId'),
		// validateBody(card.createUSchema),
		authenticated,
		isFromAuthUser(),
		UserController.updateCard
	)
	.delete(
		isIdValid('cardId'),
		authenticated,
		isFromAuthUser(),
		UserController.deleteCard
	)

router
	.route('/cards/:cardId/clicks')
	.get(
		isIdValid('cardId'),
		authenticated,
		isFromAuthUser(),
		UserController.getClicks
	)

router
	.route('/cards/:cardId/buttons')
	.post(
		isIdValid('cardId'),
		validateBody(button.newButtonSchema),
		authenticated,
		isFromAuthUser(),
		UserController.newButton
	)
	.patch(
		isIdValid('cardId'),
		validateBody(button.reorderSchema),
		authenticated,
		isFromAuthUser(),
		UserController.reorderButtons
	)

router
	.route('/cards/:cardId/buttons/:buttonId')
	.patch(
		isIdValid('cardId'),
		isIdValid('buttonId'),
		validateBody(button.updateButtonSchema),
		authenticated,
		isFromAuthUser('button'),
		UserController.updateButton
	)
	.delete(
		isIdValid('cardId'),
		isIdValid('buttonId'),
		authenticated,
		isFromAuthUser('button'),
		UserController.deleteButton
	)

router
	.route('/cards/:cardId/socials')
	.post(
		isIdValid('cardId'),
		validateBody(social.newSocialSchema),
		authenticated,
		isFromAuthUser(),
		UserController.newSocial
	)
	.patch(
		isIdValid('cardId'),
		validateBody(social.reorderSchema),
		authenticated,
		isFromAuthUser(),
		UserController.reorderSocials
	)

router
	.route('/cards/:cardId/socials/:socialId')
	.patch(
		isIdValid('cardId'),
		isIdValid('socialId'),
		validateBody(social.updateSocialSchema),
		authenticated,
		isFromAuthUser('social'),
		UserController.updateSocial
	)
	.delete(
		isIdValid('cardId'),
		isIdValid('socialId'),
		authenticated,
		isFromAuthUser('social'),
		UserController.deleteSocial
	)

router.route('/payment')
	.post(UserController.payment)
	.get(UserController.getProductValues)
router.route('/getProductList').get(UserController.getProductList)
router.route('/product/getProductPrices').post(UserController.getProductPrices)
router.route('/product/getBillingData/:userId').get(UserController.getBillData)
router.route('/getTaxList').get(UserController.getTaxList)
router.route('/taxes/getTaxByProvince').post(UserController.getTaxByProvince)
router.route('/sendContactInfo').post(UserController.sendContactInfo)
router.route('/getPlanProducts').get(UserController.getPlanProducts)
router.route('/getDiscountInfo').post(UserController.getDiscountInfo)
router.route('/getDiscountRate').get(UserController.getDiscountRate)
router.route('/planPayment').post(UserController.planPayment)

router.route('/forgotPwd').post(UserController.forgotPwd)

router.route('/resetPwd').post(UserController.resetPwd)

router.use('/auth', auth)

require('./upload')(router)

module.exports = router
