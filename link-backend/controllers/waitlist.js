const WaitlistUser = require('../models/waitlist')

module.exports = {
	// add waitlist user
	newWaitlistUser: async (req, res) => {
		const newUser = new WaitlistUser(req.body)

		const user = await newUser.save()
		res.status(201).json({ Added: user })
	},

	getWaitlistUsers: async (req, res) => {
		const users = await WaitlistUser.find({})
		res.status(200).json(users)
	}
}
