const key = require('./key.json')
require('dotenv').config()

module.exports = {
	JWT_SECRET: process.env.SESS_SECRET || 'LinkupCardTOKEN',
	IN_PROD: process.env.NODE_ENV === 'production',
	PORT: process.env.PORT || 9100,
	MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/linkup',
	SESS_SECRET: process.env.SESS_SECRET || 'conduit',
	SERVER_URL: process.env.SERVER_URL || 'http://localhost:9100',
	CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
	EMAIL_FROM: process.env.EMAIL_FROM,
	EMAIL_USERNAME: process.env.EMAIL_USERNAME,
	EMAIL_CLIENT_ID: key.client_id,
	PRIVATE_KEY_ID: key.private_key,
	GOOGLE_CLIENT_ID:
		'625799337149-lsii2ae1u7bjvr3psohm5k4533vrf3vf.apps.googleusercontent.com',
	GOOGLE_CLIENT_SECRET: 'mazUwHUyaqIVDA0TGgGsTUlf',
	// GOOGLE_CLIENT_ID:
	// '1014050097178-jgrecianr45gh1de7i8pqdr8pof9kdke.apps.googleusercontent.com',
	// GOOGLE_CLIENT_SECRET: '3XCNBYLzl8hJ1J4fI17vanXp',
	FACEBOOK_CLIENT_ID: '2529818080622281',
	FACEBOOK_CLIENT_SECRET: '8d11d40b85e64b1b20c1f771e231353a',
	INSTAGRAM_CLIENT_ID: '-',
	INSTAGRAM_CLIENT_SECRET: '-',
	AWS_SECRET_ACCESS: process.env.AWS_SECRET_ACCESS,
	AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
	AWS_BUCKET: process.env.AWS_BUCKET,
	AWS_REGION: process.env.AWS_REGION
}
