import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Tooltip } from 'antd'

const CreateIcon = () => {
	const { pathname } = useLocation()
	return (
		<Tooltip title="Profile" placement="bottom">
			<Link to="/create" className="pos--1">
				<svg
					width="15px"
					height="14px"
					viewBox="0 0 15 14"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
						<g id="Design" transform="translate(-776.000000, -48.000000)">
							<g id="Group-2" transform="translate(776.000000, 48.000000)">
								<rect
									id="Rectangle"
									stroke={
										pathname === '/create' || pathname === '/' ? '#3aa3ae' : '#9FA9BA'
									}
									strokeWidth="0.5"
									fill="#FAFAFA"
									x="0.25"
									y="5.25"
									width="14.5"
									height="3.5"
									rx="0.5"
								/>
								<rect
									id="Rectangle"
									fill={pathname === '/create' || pathname === '/' ? '#3aa3ae' : '#9FA9BA'}
									x="0"
									y="0"
									width="15"
									height="3"
									rx="0.5"
								/>
								<rect
									id="Rectangle"
									fill={pathname === '/create' || pathname === '/' ? '#3aa3ae' : '#9FA9BA'}
									x="0"
									y="11"
									width="15"
									height="3"
									rx="0.5"
								/>
							</g>
						</g>
					</g>
				</svg>
			</Link>
		</Tooltip>
	)
}

export default CreateIcon
