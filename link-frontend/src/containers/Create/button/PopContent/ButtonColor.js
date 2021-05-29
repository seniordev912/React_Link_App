import React, { useState } from 'react'
import { Popover } from 'antd'
import { BgColorsOutlined } from '@ant-design/icons'
import { ButtonBase } from '@material-ui/core'
import { SketchPicker } from 'react-color'
import { useStoreon } from 'storeon/react'

const ButtonColor = () => {
	const [open, setOpen] = useState(false)
	const { dispatch, button } = useStoreon('button')
	return (
		<ButtonBase>
			<Popover
				visible={open}
				content={
					<SketchPicker
						// disableAlpha
						color={button.bgColor}
						onChange={({ rgb }) => {
							dispatch('button/change', {
								bgColor: `rgba(${Object.values(rgb).join(', ')})`
							})
						}}
					/>
				}
				style={{
					background: 'transparent !important',
					boxShadow: 'none',
					WebkitBoxShadow: 'none'
				}}
				trigger="click"
				onVisibleChange={visible => {
					// if (!visible) {
					// 	dispatch('buttons/update', button)
					// }
					setOpen(visible)
				}}
				placement="right"
			>
				<span
					style={{
						color: open ? '#2b8bfa' : 'rgba(0, 0, 0, 0.65)',
						transition: 'all 0.4s linear'
					}}
				>
					<BgColorsOutlined />
					Button Color
				</span>
			</Popover>
		</ButtonBase>
	)
}

export default ButtonColor
