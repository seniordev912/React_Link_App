const router = require('express-promise-router')()

const WaitlistController = require('../controllers/waitlist')

router
	.route('/')
	// save waitlist user
	.post(WaitlistController.newWaitlistUser)
	// get waitlist users
	.get(WaitlistController.getWaitlistUsers)

module.exports = router
