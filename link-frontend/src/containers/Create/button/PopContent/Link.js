import React, { useState, useEffect } from 'react'
import { Popover, Input, Select } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { ButtonBase } from '@material-ui/core'
import { useStoreon } from 'storeon/react'

const { Option } = Select

const Link = () => {
	const [open, setOpen] = useState(false)
	const { dispatch, button } = useStoreon('button')
	const [value, setValue] = useState(button.url)

	useEffect(() => {
		if (value.includes('http')) {
			if (value.includes('http://')) {
				dispatch('button/change', { protocol: 'http://' })
				setValue(oldValue => oldValue.replace('http://', ''))
			} else if (value.includes('https://')) {
				dispatch('button/change', { protocol: 'https://' })
				setValue(oldValue => oldValue.replace('https://', ''))
			}
		}
	}, [dispatch, value])

	return (
		<ButtonBase>
			<Popover
				visible={open}
				content={
					<Input
						addonBefore={
							<Select
								value={button.protocol}
								onChange={protocol => dispatch('button/change', { protocol })}
								className="select-before"
							>
								<Option value="http://">http://</Option>
								<Option value="https://">https://</Option>
							</Select>
						}
						value={value}
						onChange={e => setValue(e.target.value)}
						onDoubleClick={e => e.currentTarget.select()}
						onPaste={() => setValue('')}
						onBlur={() => dispatch('button/change', { url: value })}
						placeholder="add your link"
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
					<LinkOutlined />
					Link
				</span>
			</Popover>
		</ButtonBase>
	)
}

export default Link
