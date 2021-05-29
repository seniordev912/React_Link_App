import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Tooltip } from 'antd'

const AnalyticsIcon = () => {
	const { pathname } = useLocation()
	return (
		<Tooltip title="Analytics" placement="bottom">
			<Link to="/analytics" className="pos--2">
				<svg
					width="14px"
					height="17px"
					viewBox="0 0 14 17"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
						<g id="Design" transform="translate(-727.000000, -45.000000)">
							<g id="Group-5" transform="translate(727.000000, 45.000000)">
								<g
									id="Group-3"
									transform="translate(7.000000, 8.500000) rotate(90.000000) translate(-7.000000, -8.500000) translate(-1.500000, 1.500000)"
								/>
								<rect
									id="Rectangle"
									fill={pathname === '/analytics' ? '#3aa3ae' : '#9FA9BA'}
									transform="translate(12.500000, 13.000000) rotate(90.000000) translate(-12.500000, -13.000000) "
									x="8.5"
									y="11.5"
									width="8"
									height="3"
									rx="0.5"
								/>
								<rect
									id="Rectangle"
									fill={pathname === '/analytics' ? '#3aa3ae' : '#9FA9BA'}
									transform="translate(1.500000, 11.500000) rotate(90.000000) translate(-1.500000, -11.500000) "
									x="-4"
									y="10"
									width="11"
									height="3"
									rx="0.5"
								/>
								<rect
									id="Rectangle"
									fill={pathname === '/analytics' ? '#3aa3ae' : '#9FA9BA'}
									transform="translate(7.000000, 8.500000) rotate(90.000000) translate(-7.000000, -8.500000) "
									x="-1.5"
									y="7"
									width="17"
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

export default AnalyticsIcon
