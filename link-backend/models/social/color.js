/**
 * Return the default color of the social icon
 * @param {'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'spotify' | 'blogger' | 'tiktok' | 'snapchat' | 'twitch' | 'github' | 'dribbble' | 'yelp'} name
 */
const defaultColor = name => {
	switch (name) {
		case 'facebook':
			return 'rgba(31, 85, 229, 1)'
		case 'twitter':
			return 'rgba(0, 169, 235, 1)'
		case 'linkedin':
			return 'rgba(14, 118, 168, 1)'
		case 'instagram':
			return 'rgba(252, 46, 121, 1)'
		case 'youtube':
			return 'rgba(255, 16, 16, 1)'
		case 'spotify':
			return 'rgba(30, 215, 96, 1)'
		case 'snapchat':
			return 'rgba(255, 252, 0, 1)'
		case 'blogger':
			return 'rgba(252, 79, 8, 1)'
		case 'tiktok':
			return 'rgba(0, 0, 0, 1)'
		case 'twitch':
			return 'rgba(144, 71, 255, 1)'
		case 'github':
			return 'rgba(19, 20, 24, 1)'
		case 'dribbble':
			return 'rgba(234, 76, 137, 1)'
		case 'yelp':
			return 'rgba(216, 35, 46, 1)'
		case 'airbnb':
			return 'rgba(255, 88, 93, 1)'
		case 'amazon':
			return 'rgba(255, 153, 0, 1)'
		case 'discord':
			return 'rgba(115, 138, 219, 1)'
		case 'ebay':
			return 'rgba(32, 102, 204, 1)'
		case 'etsy':
			return 'rgba(241, 100, 30, 1)'
		case 'messenger':
			return 'rgba(0, 132, 255, 1)'
		case 'reddit':
			return 'rgba(255, 87, 0, 1)'
		case 'soundscloud':
			return 'rgba(255, 51, 0, 1)'
		case 'whatsapp':
			return 'rgba(37, 211, 102, 1)'
		default:
			return 'rgba(0, 0, 0, 1)'
	}
}

module.exports = defaultColor
