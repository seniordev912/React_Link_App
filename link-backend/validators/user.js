const Joi = require('@hapi/joi')
const { refCode } = require('./utils')

const firstName = Joi.string().min(2).max(20).label('First name')
const lastName = Joi.string().max(30).label('Last name')
const username = Joi.string().min(3).max(15).label('Username')
const email = Joi.string().email().label('Email')
const password = Joi.string().required().label('Password')
const cardOrder = Joi.boolean()
const payment_details = Joi.object()

const street_num = Joi.string().min(2).max(50).label('Street Number')
const city = Joi.string().min(1).max(50).label('City')
const province = Joi.string().min(1).max(50).label('Province(State)')
const country = Joi.string().label('Country')
const zipcode = Joi.string().min(1).max(50).label('Zipcode')

const billingInfos = Joi.object()
const step = Joi.number()
const quantity = Joi.number()
const displayName = Joi.string().label('Name on Card')
const selProducts = Joi.array()

module.exports = {
	authSchema: Joi.object({
		firstName: firstName.required(),
		lastName,
		username: username.required(),
		displayName,
		referralCode: refCode.label('Referral Code'),
		email: email.required(),
		cardOrder,
		password,
		payment_details,
		selProducts
	}),
	oauthSchema: Joi.object({
		firstName: firstName.required(),
		lastName,
		username: username.required(),
		referralCode: refCode.label('Referral Code'),
		email: email.required(),
		cardOrder,
		payment_details
	}),
	oauthSchema1: Joi.object({
		billingInfos: {
			email: email.required(),
			username: username.required(),
			lastname: lastName.required(),
			firstname: firstName.required(),
			password: password.required(),

			street_num: street_num.required(),
			city: city.required(),
			province: province.required(),
			country: country.required(),
			zipcode: zipcode.required()
		},
		step
	}),
	oauthSchema2: Joi.object({
		billingInfos: {
			street_num: street_num.required(),
			city: city.required(),
			province: province.required(),
			country: country.required(),
			zipcode: zipcode.required()
		},
		step
	}),
	oauthSchema3: Joi.object({
		displayName: displayName.required(),
		step
	}),
	signInSchema: Joi.object({
		email: email.required(),
		password
	}),
	updateSchema: Joi.object({
		firstName,
		lastName,
		username,
		email
	})
}
