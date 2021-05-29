import React, { useState, useMemo, useEffect } from 'react'
import { Input, Popover, Button, Popconfirm } from 'antd'
import { SketchPicker } from 'react-color'
import { useStoreon } from 'storeon/react'
import { DeleteOutlined } from '@ant-design/icons'
import SocialIcon from './SocialIcon'
import styles from './social.module.scss'

const Social = ({ value, current, currentColor, handleVisibleChange, socialData }) => {
	const [color, setColor] = useState('#E2E2E2')
	const [showColor, setShowColor] = useState(value.color)
	const [updating, setUpdating] = useState(false)
	const [first, setFirst] = useState(true)
	const [link, setLink] = useState(value.link)
	const [visible, setVisible] = useState(false)
	const { dispatch } = useStoreon()
	const handleColor = () => setVisible(!visible)
	const handleDisplayName = () => {
		const { name } = socialData.find(
			({ name }) => name.toLowerCase() === value.name.toLowerCase()
		)
		return name
	}
	const title = useMemo(handleDisplayName, [value.name])

	useEffect(() => {
		if (current === value.id) {
			setUpdating(true)
			setFirst(false)
		} else {
			setUpdating(false)
		}
	}, [current, value.id])
	useEffect(() => {
		if (!updating && !first) {
			if (typeof value.id === 'string') {
				dispatch('socials/update', {
					...value,
					id: value.id,
					name: value.name,
					color: showColor,
					link
				})
			} else {
				dispatch('socials/addorupdate', {
					id: value.id,
					name: value.name.toLowerCase(),
					color: showColor,
					link
				})
			}
		}
	}, [dispatch, first, link, showColor, updating, value])
	const handleDelete = () => {
		dispatch('socials/delete', value.id)
	}
	return (
		<Popover
			content={
				<div>
					<div style={{ marginBottom: 16 }}>
						{/* create save handler to BE */}
						<Input
							// addonBefore={value.proxy}
							style={{ width: 300 }}
							value={link}
							onChange={e => setLink(e.target.value)}
							placeholder="Add your link"
						/>
						<div className={styles.row}>
							<div className={styles.swatch} onClick={handleColor}>
								<div className={styles.color} style={{ backgroundColor: showColor }} />
							</div>
							{visible && (
								<div className={styles.popover}>
									<div className={styles.cover} onClick={handleColor} />
									<SketchPicker
										color={showColor}
										// disableAlpha
										onChange={({ rgb }) =>
											setShowColor(`rgba(${Object.values(rgb).join(', ')})`)
										}
									/>
								</div>
							)}
							{typeof value.id === 'string' && (
								<Popconfirm
									title="Are you sure?"
									okText="Yes"
									cancelText="No"
									onConfirm={handleDelete}
								>
									<Button danger type="primary" icon={<DeleteOutlined />}>
										Delete
									</Button>
								</Popconfirm>
							)}
						</div>
					</div>
				</div>
			}
			title={title}
			trigger="click"
			key={value.id}
			visible={current === value.id}
			onVisibleChange={handleVisibleChange(value)}
		>
			<span
				className={`${styles.showColor} ${
					typeof value.id === 'string' ? styles.isCreated : ''
				}`}
				onMouseOver={() => setColor(showColor)}
				onMouseLeave={() => setColor('#E2E2E2')}
			>
				<SocialIcon
					name={value.name.toLowerCase()}
					color={typeof value.id === 'string' ? showColor : color}
				/>
			</span>
		</Popover>
	)
}

export default Social
