import React from 'react'
import PropTypes from 'prop-types'
import * as Social from './social/'

const SocialIcon = ({ name, color }) => {
	switch (name) {
		case 'facebook':
			return <Social.Facebook color={color} />
		case 'twitter':
			return <Social.Twitter color={color} />
		case 'linkedin':
			return <Social.Linkedin color={color} />
		case 'instagram':
			return <Social.Instagram color={color} />
		case 'youtube':
			return <Social.YouTube color={color} />
		case 'spotify':
			return <Social.Spotify color={color} />
		case 'blogger':
			return <Social.Blogger color={color} />
		case 'snapchat':
			return <Social.Snapchat color={color} />
		case 'tiktok':
			return <Social.Tiktok color={color} />
		case 'twitch':
			return <Social.Twitch color={color} />
		case 'github':
			return <Social.Github color={color} />
		case 'dribbble':
			return <Social.Dribbble color={color} />
		case 'yelp':
			return <Social.Yelp color={color} />
		case 'airbnb': 
			return <Social.Airbnb color={color} />
		case 'amazon': 
			return <Social.Amazon color={color} />
		case 'discord': 
			return <Social.Discord color={color} />
		case 'ebay': 
			return <Social.Ebay color={color} />
		case 'etsy': 
			return <Social.Etsy color={color} />
		case 'messenger': 
			return <Social.Messenger color={color} />
		case 'reddit': 
			return <Social.Reddit color={color} />
		case 'soundcloud': 
			return <Social.SoundCloud color={color} />
		case 'whatsapp': 
			return <Social.Whatsapp color={color} />
		default:
			return null
	}
}

SocialIcon.propTypes = {
	name: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired
}

export default SocialIcon
