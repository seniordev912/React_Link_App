import React from 'react'
import { Popover } from 'antd'
import { BellFilled } from '@ant-design/icons'
import '../index.scss'

const NotificationIcon = () => {
	const content = (
			<div>
					You're all caught up!
			</div>
	);

	return (
		<Popover placement="bottom" content={content} trigger="click">
			<BellFilled id="notificationButton" />
		</Popover>
	)
}

export default NotificationIcon
