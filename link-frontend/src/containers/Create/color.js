import React, { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import './index.scss'
import { BgColorsOutlined } from '@ant-design/icons'
import { useStoreon } from 'storeon/react'
import classes from './color.module.scss'

const ColorPicker = () => {
	const [visible, setVisible] = useState(false)
	const { dispatch, authUser: user } = useStoreon('authUser')
	const [initial] = useState(user.card.bgColor)
	const handleClick = () => setVisible(!visible)
	const handleChange = ({ rgb }) => {
		console.log("------------>>>>>", `rgba(${Object.values(rgb).join(', ')})`)
		dispatch('card/change', {
			bgColor: `rgba(${Object.values(rgb).join(', ')})`
		})
	}
	useEffect(() => {
		if (!visible) {
			console.log("------------>>>>>", initial, user.card.bgColor)
			if (initial !== user.card.bgColor) {
				dispatch('card/update', { bgColor: user.card.bgColor, noCompare: true })
			}
		}
	}, [dispatch, initial, user.card.bgColor, visible])
	return (
		<div>
			<BgColorsOutlined className={classes.button} onClick={handleClick} />
			{visible && (
				<div className={classes.popover}>
					<div className={classes.cover} onClick={handleClick} />
					<SketchPicker color={user.card.bgColor} onChange={handleChange} />
				</div>
			)}
		</div>
	)
}

export default ColorPicker
