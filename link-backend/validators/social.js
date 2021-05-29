const Joi = require('@hapi/joi')
const { color, reorder } = require('./utils')

const name = Joi.string()
	.valid(
		'facebook',
		'twitter',
		'linkedin',
		'instagram',
		'youtube',
		'spotify',
		'blogger',
		'snapchat',
		'tiktok',
		'twitch',
		'github',
		'dribbble',
		'yelp',
		'airbnb',
		'amazon',
		'discord',
		'ebay',
		'etsy',
		'messenger',
		'reddit',
		'soundcloud',
		'whatsapp'
	)
	.lowercase()
	.label('Social Name')

module.exports = {
	newSocialSchema: Joi.object({
		name: name.required(),
		color: color.label('Color'),
		colorOnHover: Joi.boolean().label('Color on hover'),
		link: Joi.string().required().label('Link'),
		isActive: Joi.boolean().label('Is Active')
	}),
	reorderSchema: Joi.object({
		socials: reorder.label('Social Ids')
	}),
	updateSocialSchema: Joi.object({
		name,
		color: color.label('Color'),
		colorOnHover: Joi.boolean().label('Color on hover'),
		link: Joi.string().label('Link'),
		isActive: Joi.boolean().label('Is Active')
	})
}
