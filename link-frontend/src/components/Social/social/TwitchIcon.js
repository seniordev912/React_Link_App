import React from 'react'

const TwitchIcon = ({ color }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			fill={color || '#E2E2E2'}
			style={{ transition: 'all 0.4s linear' }}
		>
			<path d="M4.265,3L3,6.236v13.223h4.502V21l2.531,0.85l2.392-2.391h3.658l4.923-4.924V3H4.265z M19.317,13.691l-2.813,2.814h-4.502 l-2.391,2.391v-2.391H5.813V4.688h13.504V13.691z M16.505,7.924v4.923h-1.688V7.924H16.505z M12.003,7.924v4.923h-1.688V7.924   H12.003z" />
		</svg>
	)
}

export default TwitchIcon
