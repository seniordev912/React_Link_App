export const removeProps = obj => {
	let novoObj = {}
	// eslint-disable-next-line no-restricted-syntax
	for (const x in obj) {
		if (obj[x] || obj[x] === false) {
			novoObj = {
				...novoObj,
				[x]: obj[x]
			}
		}
	}
	return novoObj
}

export const removePropsNew = obj => {
	let novoObj = {}
	// eslint-disable-next-line no-restricted-syntax
	for (const x in obj) {
		if (obj[x]) {
			if (
				typeof obj[x] === 'object' &&
				typeof obj[x].length !== 'undefined' &&
				obj[x].length === 0
			) {
				continue
			}
		}
		if (obj[x] || obj[x] === false) {
			novoObj = {
				...novoObj,
				[x]: obj[x]
			}
		}
	}
	return Object.keys(novoObj).length === 0 ? null : novoObj
}

export const removeEquals = (newObj, compareObj, add = null) => {
	let ret = null
	for (const x in newObj) {
		if (newObj[x] !== compareObj[x]) {
			if (ret === null) {
				ret = {}
			}
			ret[x] = newObj[x]
		}
	}
	if (add && add.length > 0) {
		if (ret === null) {
			ret = {}
		}
		add.forEach(value => {
			ret[value] = newObj[value]
		})
	}
	return ret
}

export const extractDomain = url => {
	let domain
	if (url.indexOf('://') > -1) {
		domain = url.split('/')[2]
	} else {
		domain = url.split('/')[0]
	}

	if (domain.indexOf('www.') > -1) {
		domain = domain.split('www.')[1]
	}

	domain = domain.split(':')[0]
	domain = domain.split('?')[0]

	return domain
}

const sources = [
	'facebook',
	'twitter',
	'instagram',
	'linkedin',
	'telegram',
	'youtube',
	'blogspot',
	'medium'
]

export const displaySource = source => {
	switch (source) {
		case 'linkedin':
			return 'LinkedIn'
		case 'youtube':
			return 'YouTube'
		default:
			return source[0].toUpperCase() + source.slice(1)
	}
}

export const getSource = value => {
	let ret = 'other'
	value = extractDomain(value)
	if (value !== '') {
		for (let i = 0; i < sources.length; i++) {
			const source = sources[i]
			const re = new RegExp(source, 'i')
			const isIt = value.search(re) !== -1
			if (isIt) {
				ret = source
				if (source === 'blogspot') {
					ret = 'blogger'
				}
				break
			}
		}
	}
	return ret
}

/**
 * This function will return the social name in the way it should be displayed
 * @param {string} value The social name
 */
export const socialDisplayName = value => {
	switch (value.toLowerCase()) {
		case 'facebook':
			return 'Facebook'
		case 'twitter':
			return 'Twitter'
		case 'linkedin':
			return 'LinkedIn'
		case 'instagram':
			return 'Instagram'
		case 'youtube':
			return 'YouTube'
		case 'spotify':
			return 'Spotify'
		case 'snapchat':
			return 'Snapchat'
		case 'blogger':
			return 'Blogger'
		case 'tiktok':
			return 'TikTok'
		case 'twitch':
			return 'Twitch'
		case 'github':
			return 'GitHub'
		case 'dribbble':
			return 'Dribbble'
		case 'yelp':
			return 'Yelp'
		default:
			return 'Other'
	}
}

/**
 * This function will return the source name in the way it should be displayed
 * @param {string} value The source name
 */
export const sourceDisplayName = value => {
	switch (value.toLowerCase()) {
		case 'facebook':
			return 'Facebook'
		case 'twitter':
			return 'Twitter'
		case 'linkedin':
			return 'LinkedIn'
		case 'instagram':
			return 'Instagram'
		case 'youtube':
			return 'YouTube'
		case 'spotify':
			return 'Spotify'
		case 'blogspot':
			return 'Blogger'
		case 'snapchat':
			return 'Snapchat'
		case 'blogger':
			return 'Blogger'
		case 'tiktok':
			return 'TikTok'
		case 'twitch':
			return 'Twitch'
		case 'telegram':
			return 'Telegram'
		case 'medium':
			return 'Medium'
		case 'other':
			return 'Other'
		default:
			return value
	}
}
