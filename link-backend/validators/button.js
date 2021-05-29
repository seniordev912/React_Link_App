const Joi = require('@hapi/joi')
const { color, reorder } = require('./utils')

const titleColor = color.label('Title Color')
const bgColor = color.label('Background Color')
// add tilt later
const animation = Joi.string()
	.valid('none', 'shake', 'bounce', 'fade-up', 'fade-down', 'flip', 'jello', 'pulse', 'flash',  'swing',  'tada')
	.label('Animation')
const url = Joi.string()
const protocol = Joi.string().valid('http://', 'https://').label('Protocol')
const title = Joi.string().max(50).label('Title')

module.exports = {
	newButtonSchema: Joi.object({
		title: title.required(),
		titleColor,
		imageUrl: url.label('Image Url'),
		bgColor,
		animation,
		url: url.optional().label('Link'),
		protocol
	}),
	reorderSchema: Joi.object({
		buttons: reorder.label('Button IDs')
	}),
	updateButtonSchema: Joi.object({
		title,
		titleColor,
		imageUrl: url.label('Image Url'),
		bgColor,
		animation,
		url: url.label('Link'),
		protocol
	})
}
