import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useStoreon } from 'storeon/react'
import SocialIcon from './SocialIcon'

// const gray = '#E2E2E2'

const Link = styled.a`
	margin: 0 15px;
	font-size: 24px;
	cursor: pointer;
	transition: all 0.4s linear;
	color: ${({ color }) => color};
	&:hover {
		color: ${({ color }) => color};
		opacity: 0.6;
	}
`
// ${({ colorOnHover, color }) =>
// 	colorOnHover
// 		? `
// 	color: ${gray};
// 	&:hover {
// 		color: ${color};
// 	}
// `
// 		: `
// 		color: ${color};
// 		&:hover {
// 			color: ${color};
// 		}
// 	`}

const Social = ({ social, enteredTime }) => {
	const { dispatch } = useStoreon()
	// const [state, setState] = useState({
	// 	color: colorOnHover ? gray : color,
	// 	rest: {}
	// })
	// useEffect(() => {
	// 	if (colorOnHover) {
	// 		setState({
	// 			...state,
	// 			rest: {
	// 				onMouseEnter: () => setState({ ...state, color }),
	// 				onMouseLeave: () => setState({ ...state, color: gray })
	// 			}
	// 		})
	// 	}
	// }, [])
	const realUrl = () => {
		let link = social.link
		if(link) {
			if(link.includes('http') || link.includes('https') || link.includes('//www.')) {
				return link
			} else {
				if(link.includes('www.')) {
					return `//${link}`
				}
				return `//www.${link}`
			}
		}
		return ''
	}
	return (
		<Link
			href={realUrl()}
			onClick={() => dispatch('users/socialClick', { id: social.id, enteredTime })}
			colorOnHover={social.colorOnHover}
			color={social.color}
			target="_blank"
			rel="noopener noreferrer"
		>
			<SocialIcon name={social.name} color={social.color} />
		</Link>
	)
	// return (
	// 	<a
	// 		style={{
	// 			marginRight: 30,
	// 			fontSize: 24,
	// 			cursor: 'pointer'
	// 		}}
	// 		href={link}
	// 		target="_blank"
	// 		rel="noopener noreferrer"
	// 		{...state.rest}
	// 	>
	// 		<SocialIcon name={name} color={state.color} />
	// 	</a>
	// )
}

// Social.propTypes = {
// 	color: PropTypes.string.isRequired,
// 	colorOnHover: PropTypes.bool.isRequired,
// 	link: PropTypes.string.isRequired,
// 	name: PropTypes.string.isRequired
// }

export default Social
