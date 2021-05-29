const Joi = require('@hapi/joi')
const mongoose = require('mongoose')
const { isSlug } = require('cuid')
const { isColorValid } = require('./regexs')

const custom = Joi.extend(joi => {
	return {
		type: 'objectId',
		base: joi.string(),
		messages: {
			objectId: '"{{#label}}" must be valid'
		},
		validate(value, helpers) {
			if (!mongoose.Types.ObjectId.isValid(value)) {
				return { value, errors: helpers.error('objectId') }
			}
		}
	}
})

const objectId = Joi.string()
	.messages({ objectId: '"{{#label}}" must be valid' })
	.custom((value, helpers) => {
		if (!mongoose.Types.ObjectId.isValid(value)) {
			return { value, errors: helpers.error('objectId') }
		}
	})
	.label('ID')

exports.objectId = objectId

exports.refCode = Joi.string()
	.messages({ refCode: `This "{{#label}}" isn't valid` })
	.custom((value, helpers) => {
		if (!isSlug(value)) {
			return { value, errors: helpers.error('refCode') }
		}
	})

exports.color = Joi.string().pattern(isColorValid)

exports.reorder = Joi.array()
	.min(2)
	.unique()
	.items(custom.objectId().required())
	.required()
// .required()
