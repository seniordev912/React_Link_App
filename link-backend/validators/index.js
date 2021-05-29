const Joi = require('@hapi/joi')

exports.clickSchema = Joi.object({
	enteredTime: Joi.string()
		.isoDate()
		.error(new Error('There was an error please try again'))
		.required(),
	source: Joi.string()
		.valid(
			'facebook',
			'twitter',
			'instagram',
			'linkedin',
			'telegram',
			'youtube',
			'blogspot',
			'medium',
			'other'
		)
		.label('Source'),
	userAgent: Joi.string().required().label('User Agent')
})
exports.button = require('./button')
exports.user = require('./user')
exports.social = require('./social')
exports.card = require('./card')
