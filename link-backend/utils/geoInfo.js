const { lookup } = require('geoip-lite')

const getClientIp = req => {
	let ipAddress
	// The request may be forwarded from local web server.
	const forwardedIps = req.headers['x-forwarded-for']
	if (forwardedIps && typeof forwardedIps !== 'string') {
		;[ipAddress] = forwardedIps
	} else if (typeof forwardedIps === 'string') {
		ipAddress = forwardedIps
	}
	if (!ipAddress) {
		ipAddress = req.connection.remoteAddress
	}
	return ipAddress[0] !== ':' ? ipAddress : null
}

const formatGeo = (
	{ country, city, timezone, eu, ll: [latitute, longitude], metro, area },
	ip
) => ({
	country,
	city,
	timezone,
	eu: !eu,
	latitute,
	longitude,
	metro,
	area,
	ip
})

exports.getGeoInfo = req => {
	let geo = null
	const ip = getClientIp(req)
	if (ip) {
		geo = formatGeo(lookup(ip), ip)
		geo = {
			...geo,
			device: req.device.type
		}
	}
	return geo
}

exports.getClientIp = getClientIp
