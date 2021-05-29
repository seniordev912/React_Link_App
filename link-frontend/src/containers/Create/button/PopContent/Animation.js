import React, { useState } from 'react'
import { Popover, Radio } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import { ButtonBase } from '@material-ui/core'
import './animation.scss'
import { useStoreon } from 'storeon/react'

const radioStyle = {
	display: 'block',
	height: '30px',
	lineHeight: '30px'
}

const Animation = () => {
	const [open, setOpen] = useState(false)
	const { dispatch, button } = useStoreon('button')
	return (
		<ButtonBase>
			<Popover
				visible={open}
				content={
					<Radio.Group
						onChange={e => dispatch('button/change', { animation: e.target.value })}
						value={button.animation}
					>
						<Radio style={radioStyle} value="none">
							None
						</Radio>
						<Radio style={radioStyle} value="shake">
							Shake
						</Radio>
						<Radio style={radioStyle} value="bounce">
							Bounce
						</Radio>
						<Radio style={radioStyle} value="fade-up">
							Fade Up
						</Radio>
						<Radio style={radioStyle} value="fade-down">
							Fade Down
						</Radio>
						<Radio style={radioStyle} value="flip">
							Flip
						</Radio>
						<Radio style={radioStyle} value="jello">
							Jello
						</Radio>
						<Radio style={radioStyle} value="pulse">
							Pulse
						</Radio>
						<Radio style={radioStyle} value="flash">
							Flash
						</Radio>
						<Radio style={radioStyle} value="swing">
							Swing
						</Radio>
						<Radio style={radioStyle} value="tada">
							Tada
						</Radio>
					</Radio.Group>
				}
				trigger="click"
				onVisibleChange={visible => setOpen(visible)}
				placement="right"
			>
				<span
					style={{
						color: open ? '#2b8bfa' : 'rgba(0, 0, 0, 0.65)',
						transition: 'all 0.4s linear'
					}}
				>
					<ThunderboltOutlined />
					Animation
				</span>
			</Popover>
		</ButtonBase>
	)
}

export default Animation
