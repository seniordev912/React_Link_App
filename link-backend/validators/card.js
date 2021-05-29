const Joi = require('@hapi/joi')
const { color } = require('./utils')
const { isFzValid } = require('./regexs')

exports.createUSchema = Joi.object({
	bgColor: color.label('Background Color'),
	title: Joi.string().min(1).label('Title'),
	// titleFontSize: Joi.string().pattern(isFzValid),
	// titleColor: color.label('Title Color'),
	// desc: Joi.string(),
	// descColor: color.label('Description Color'),
	isPublic: Joi.boolean().label('Is Public'),
	text: Joi.object(),
	usernameVisible: Joi.boolean(),
	isRectangle: Joi.boolean()
}).optional()
