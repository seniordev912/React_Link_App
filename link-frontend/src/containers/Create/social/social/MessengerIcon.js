import React from 'react'

const MessengerIcon = ({ color }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" 
			width="1em" height="1em" viewBox="0 0 24 24">
				<path fill={color} d="M12,3c-4.92,0-8.91,3.729-8.91,8.332c0,2.616,1.291,4.952,3.311,6.479V21l3.041-1.687	c0.811,0.228,1.668,0.35,2.559,0.35c4.92,0,8.91-3.73,8.91-8.331C20.91,6.729,16.92,3,12,3z M12.938,14.172l-2.305-2.394	l-4.438,2.454l4.865-5.163l2.305,2.395l4.439-2.455L12.938,14.172z"/>
		</svg>
	)
}

export default MessengerIcon
