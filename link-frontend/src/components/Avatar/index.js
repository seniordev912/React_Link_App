import React, { useState, useEffect } from 'react'
import { Avatar as AvatarBase } from 'antd'
import useStyles from './styles'

const Avatar = ({ imagesUrl, ...props }) => {
	const [state, setState] = useState({
		image: imagesUrl[0],
		animationClass: ''
	})
	const classes = useStyles()

	useEffect(() => {
		let index = 0
		const timer = setInterval(() => {
			const animation = localStorage.getItem('animation')
			if (imagesUrl.length > 1 && animation !== 'false') {
				if (index === imagesUrl.length - 1) {
					index = 0
					setState({
						image: imagesUrl[0],
						animationClass: classes.changingImage
					})
				} else {
					index++
					setState({
						image: imagesUrl[index],
						animationClass: classes.changingImage
					})
				}
			}
		}, 3000)

		return () => {
			clearInterval(timer)
		}
	}, [classes.changingImage, imagesUrl])

	let imageTimer

	useEffect(() => {
		if (imageTimer) {
			clearTimeout(imageTimer)
		}
		imageTimer = setTimeout(() => {
			setState({
				...state,
				animationClass: ''
			})
		}, 500)
	}, [state.image])

	return (
		<AvatarBase
			size={100}
			src={state.image}
			className={`${classes.root} ${state.animationClass}`}
			{...props}
		/>
	)
}

export default Avatar
