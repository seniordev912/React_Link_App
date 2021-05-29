import React, { useState, useEffect } from 'react'
import { useMediaQuery } from '@material-ui/core'
import { Col, Avatar } from 'antd'
import { ThunderboltFilled, ThunderboltOutlined } from '@ant-design/icons'
import { useStoreon } from 'storeon/react'
import takeAnimation from './animation'
import 'animate.css/animate.min.css'
import './style.scss'

const gray = '#E2E2E2'

const Button = ({ value, enteredTime, isAnimation }) => {
	const [animation, setAnimation] = useState('')
	const { dispatch } = useStoreon()
	const isMobile = useMediaQuery('(max-width: 480px)')
	// const handleClick = () => {
	// 	if (animation === null && disabled) {
	// 		setAnimation(takeAnimation(value.animation))
	// 		setDisabled(false)
	// 	} else {
	// 		setAnimation(null)
	// 		setDisabled(true)
	// 	}
	// 	// if (animation !== null) {
	// 	// } else {
	// 	// 	setAnimation(takeAnimation(value.animation))
	// 	// }
	// }
	useEffect(() => {
		setAnimation(takeAnimation(value.animation))
	}, [value.animation])
	useEffect(() => {
		if (animation !== null) {
			setTimeout(() => {
				if (isAnimation) {
					if (animation !== null) {
						if (animation.includes('animated')) {
							setAnimation('')
						} else {
							setAnimation(takeAnimation(value.animation))
						}
					}
				}
			}, 3000)
		}
	}, [animation, isAnimation, value.animation])
	return (
		<div
			onClick={() => {
				dispatch('users/buttonClick', { id: value.id, enteredTime })
				window.open(`${value.protocol}${value.url}`)
			}}
			className={`ant-row button--card ${isAnimation ? animation : ''}`}
			style={{ backgroundColor: value.bgColor, height: 80, cursor: 'pointer' }}
		>
			{value.imageUrl && (
				<Col span={isMobile ? 6 : 4}>
					{/* {value.imageUrl && ( */}
					<Avatar
						shape="square"
						size={64}
						src={value.imageUrl}
						className={!value.imageUrl ? 'noBackground' : ''}
						// style={
						// 	!value.imageUrl ? { background: 'transparent !important' } : {}
						// }
					/>
					{/* )} */}
				</Col>
			)}
			<Col
				span={!value.imageUrl ? 24 : isMobile ? 14 : 16}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<span
					style={{
						maxWidth: '80%',
						lineHeight: 1.2,
						textAlign: 'center',
						wordBreak: 'keep-all',
						border: 'none',
						outline: 'none',
						transition: 'all 0.2s linear',
						color: value.titleColor
					}}
				>
					{value.title}
				</span>
			</Col>
			{/* {value.animation !== 'none' && (
				<Col
					span={4}
					style={{
						color: animation ? '#2b8bfa' : 'black',
						transition: 'all 0.4s ease-in-out'
					}}
					onClick={handleClick}
				>
					<ThunderboltFilled />
				</Col>
			)} */}
		</div>
	)
}

export default Button
