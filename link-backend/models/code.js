const mongoose = require('mongoose')
const { slug } = require('cuid')

const { Schema } = mongoose

const codeSchema = new Schema(
	{
		code: {
			type: String,
			unique: true,
			// default: function () {
			// 	return slug()
			// }
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		}
	},
	{
		toJSON: {
			virtuals: true,
			transform: function (doc, ret) {
				if (ret.__v) {
					delete ret.__v
				}
				if (ret._id) {
					ret.id = ret._id
					delete ret._id
				}
				return ret
			}
		},
		toObject: {
			virtuals: true
		}
	}
)

codeSchema.virtual('usedBy', {
	ref: 'user',
	localField: '_id',
	foreignField: 'referralCode'
})

const Code = mongoose.model('code', codeSchema)

module.exports = Code
