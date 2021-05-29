const router = require('express-promise-router')()
const passport = require('passport')
const { validateBody, authenticated } = require('../../helpers/routeHelpers')
const { user } = require('../../validators')
const AuthController = require('../../controllers/user/auth')

const passportSignIn = passport.authenticate('local', { session: false })

router
	.route('/signup')
	.post(validateBody(user.authSchema), AuthController.signUp)

router
	.route('/signin')
	.post(
		validateBody(user.signInSchema),
		passportSignIn,
		AuthController.signIn
	)

router
	.route('/google')
	.post(
		passport.authenticate('googleToken', { session: false }),
		AuthController.googleAuth
	)

router
	.route('/facebook')
	.post(
		passport.authenticate('facebookToken', { session: false }),
		AuthController.facebookAuth
	)

// router
// 	.route('/instagram')
// 	.post(
// 		passport.authenticate('instagramToken', { session: false }),
// 		AuthController.instagramAuth
// 	)

router
	.route('/link/google')
	.post(
		authenticated,
		passport.authorize('googleToken', { session: false }),
		AuthController.linkGoogle
	)

router.route('/unlink/google').post(authenticated, AuthController.unlinkGoogle)

router
	.route('/link/facebook')
	.post(
		authenticated,
		passport.authorize('facebookToken', { session: false }),
		AuthController.linkFacebook
	)

router
	.route('/unlink/facebook')
	.post(authenticated, AuthController.unlinkFacebook)

// router
// 	.route('/link/instagram')
// 	.post(
// 		authenticated,
// 		passport.authorize('instagramToken', { session: false }),
// 		AuthController.linkInstagram
// 	)

// router
// 	.route('/unlink/instagram')
// 	.post(authenticated, AuthController.unlinkInstagram)

module.exports = router
