import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Space, Menu } from 'antd'
import { LinkOutlined, DeleteOutlined } from '@ant-design/icons'
import Link from './Link'
import Animation from './Animation'
import TextColor from './TextColor'
import ButtonColor from './ButtonColor'
import Delete from './Delete'

const useStyles = makeStyles(() => ({
	root: {
		// display: 'flex',
		// flexDirection: 'column',
		'& > div > button': {
			cursor: 'pointer',
			width: '100%',
			'& > span': {
				display: 'flex',
				width: '100%',
				alignItems: 'center'
			},
			'& span[role=img]': {
				marginRight: 10
			}
		}
	}
}))

const PopContent = ({ state, isMenu = false }) => {
	const classes = useStyles()
	return (
		<>
			{isMenu ? (
				<div className="ant-popover-inner">
					<div className="ant-popover-inner-content">
						<Space direction="vertical" className={classes.root}>
							<TextColor />
							<ButtonColor />
							<Link />
							<Animation />
							<Delete />
						</Space>
					</div>
				</div>
			) : (
				<Space direction="vertical" className={classes.root}>
					<TextColor />
					<ButtonColor />
					<Link />
					<Animation />
					<Delete />
				</Space>
			)}
		</>
	)
}

export default PopContent
