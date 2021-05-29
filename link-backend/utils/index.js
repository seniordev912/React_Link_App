const { ExtractJwt } = require('passport-jwt')
const { verify } = require('jsonwebtoken')
const moment = require('moment')
const { JWT_SECRET } = require('../config')
const geoInfo = require('./geoInfo')
const email = require('./email')

const getId = req => {
	if (req.headers.authorization) {
		const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
		const payload = verify(token, JWT_SECRET)
		return payload.sub
	}
	return null
}

const getRestArray = (originArray, limit) => {
	let tempArr = []
	let temp = 0
	console.log()
	if(!originArray.find(e => Object.keys(e)[0] === moment().format("YYYY-MM"))) {
		originArray.push({
			[moment().format("YYYY-MM")] : 0
		})
	}
	let len = originArray.length
	if(len > 1) {
		for(let i = 0; i < len - 1; i++) {
			if(Object.values(originArray[i])[0] < limit) {
				temp += Object.values(originArray[i])[0]
				tempArr.push(originArray[i])
			} else if(Object.values(originArray[i])[0] >= limit || temp >= limit) {
				temp = 0
				tempArr = []
			}
		}
		
		return tempArr.concat(originArray[len - 1])
	} else {
		return originArray
	}
}

const removeProps = obj => {
	let novoObj = {}
	let x
	// eslint-disable-next-line no-restricted-syntax
	for (x in obj) {
		if (obj[x]) {
			novoObj = {
				...novoObj,
				[x]: obj[x]
			}
		} else if (obj[x] === false) {
			novoObj = {
				...novoObj,
				[x]: obj[x]
			}
		}
	}
	return novoObj
}

const displaySource = source => {
	switch (source) {
		case 'linkedin':
			return 'LinkedIn'
		case 'youtube':
			return 'YouTube'
		default:
			return source[0].toUpperCase() + source.slice(1)
	}
}

const validateEmail = email => {
	const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase())
}

const validateUName = username => {
	const re = new RegExp("^[a-z0-9_-]+$")
	console.log(username, re.test(username))
    return re.test(username)
}

const validateUppercase = username => {
	console.log((/[A-Z]/.test(username)))
	return (/[A-Z]/.test(username))
}

const validatePostCode = (countryCode, code) => {
	switch (countryCode) {
        case "US":
            postalCodeRegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
            break;
        case "CA":
            postalCodeRegex = /^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/;
            break;
        default:
            postalCodeRegex = /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/;
	}
	return postalCodeRegex.test(code)
}

const getProductDetails = (name, productList, priceList) => {
	let nPList = productList.filter(e => (e.metadata.category || '').toLowerCase() === name)
	nPList.map(e => {
		const price = priceList.find(val => val.product === e.id) 
		e.price = price ? price.unit_amount : 0
		e.prices = priceList.filter(val => val.product === e.id)
	})
	return nPList || []
}

module.exports = {
	getId,
	displaySource,
	removeProps,
	getRestArray,
	getProductDetails,
	validateEmail,
	validateUName,
	validateUppercase,
	validatePostCode,
	...email,
	...geoInfo
}
