import React from 'react'
import { Drawer } from 'antd'

const CustomDrawer = ({ name, children, visible, onClose }) => {
	return (
		<Drawer title={name || 'Unknown'} placement="right" visible={visible} onClose={onClose}>
			{children}
		</Drawer>
	)
}

export default CustomDrawer
