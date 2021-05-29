import React, { useState } from 'react'
import { Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { ButtonBase } from '@material-ui/core'
import { useStoreon } from 'storeon/react'

const Delete = () => {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState('')
	const { dispatch, buttons, button } = useStoreon('button', 'buttons')
	return (
		<ButtonBase>
			<Popconfirm
				visible={open}
				title="Are you sure delete this button?"
				onConfirm={() => {
					dispatch('buttons/remove', button.id)
				}}
				onVisibleChange={visible => setOpen(visible)}
				placement="right"
			>
				<span
					style={{
						color: open ? '#2b8bfa' : 'rgba(0, 0, 0, 0.65)',
						transition: 'all 0.4s linear'
					}}
				>
					<DeleteOutlined />
					Delete
				</span>
			</Popconfirm>
		</ButtonBase>
	)
}

export default Delete
