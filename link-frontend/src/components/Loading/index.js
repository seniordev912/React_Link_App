import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 40, color: '#3aa3ae' }} spin />

const Loading = () => (
	<Spin
		indicator={antIcon}
		style={{
			position: 'absolute',
			top: '50%',
			left: '50%',

			transform: 'translate(-50%, -50%)'
		}}
	/>
)

export default Loading
