import React, { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import './index.scss'
import { FontColorsOutlined } from '@ant-design/icons'
import { useStoreon } from 'storeon/react'
import classes from './color.module.scss'

const ColorPicker = () => {
	const [tVisible, setVisible] = useState(false)
	const { dispatch, authUser: user } = useStoreon('authUser')
	const [initialColor] = useState(user.card.text ? user.card.text.color : '#fff')
	const handleClick = () => setVisible(!tVisible)
	const handleChange = ({ rgb }) => {
		const { text } = user.card
		if (text) {
			console.log("------------>>>>>", `rgba(${Object.values(rgb).join(', ')})`)
			text.color = `rgba(${Object.values(rgb).join(', ')})`
			dispatch('card/change', { text })
		}
	}

	useEffect(() => {
		const uColor = user.card.text ? user.card.text.color : '#000'
		if (!tVisible && user.card.text && initialColor !== uColor) {
			const { text } = user.card
			text.color = uColor
			dispatch('card/update', { text, noCompare: true })
		}
	}, [dispatch, initialColor, tVisible, user])

	return (
		<div>
			<FontColorsOutlined className={classes.button} onClick={handleClick} />
			{tVisible && (
				<div className={classes.popover}>
					<div className={classes.cover} onClick={handleClick} />
					<SketchPicker
						color={user.card.text ? user.card.text.color : '#000'}
						onChange={handleChange}
					/>
				</div>
			)}
		</div>
	)
}

export default ColorPicker
