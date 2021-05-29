import React, { useState } from 'react'
import { Popover } from 'antd'
import { FontColorsOutlined } from '@ant-design/icons'
import { ButtonBase } from '@material-ui/core'
import { SketchPicker } from 'react-color'
import { useStoreon } from 'storeon/react'

const TextColor = ({ color }) => {
	const [open, setOpen] = useState(false)
	const { dispatch, button } = useStoreon('button')
	return (
		<ButtonBase>
			<Popover
				visible={open}
				content={
					<SketchPicker
						// disableAlpha
						color={button.titleColor}
						onChange={({ rgb }) => {
							dispatch('button/change', {
								titleColor: `rgba(${Object.values(rgb).join(', ')})`
							})
						}}
					/>
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
					<FontColorsOutlined />
					Text Color
				</span>
			</Popover>
		</ButtonBase>
	)
}

export default TextColor
