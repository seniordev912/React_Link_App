import React from 'react'
import { Col, Row, Typography, Menu, Dropdown, Popover } from 'antd'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import Logo from '../../assets/icons/linkup_icon.png'
import AnalyticsIcon from './images/AnalyticsIcon'
import CreateIcon from './images/CreateIcon'
import NotificationIcon from './images/NotificationIcon'
import axios from '../../constants/axios'
import 'boxicons'
// import tabs from './data'
import './index.scss'

const { Text } = Typography

function AuthNavigation({ user, navColor, pathKey, isShowPlan }) {
	
	const { dispatch } = useStoreon()

	const logout = () => {
		dispatch('session/logout')
		delete axios.defaults.headers.authorization
	}

	return (
		<main className="authNav">
			<Row>
				<Col xs={5} lg={9} className="left-part" style={navColor && navColor[0]}>
					<Link to="/">
						<img src={Logo} className="linkupIcon" alt="linkup logo" />
					</Link>
					
					{
						user.planType === 'PRO' && (
							<div className="plan-type-part bgcolor-dark-blue color-white common-text-size ">{user.planType}</div>
						)
					}

					{
						user.planType === 'Starter' && (
							<div className="plan-type-part bgcolor-soft-blue color-black common-text-size ">{user.planType}</div>
						)
					}
				</Col>

				<Col xs={3} lg={11} className="spacing" style={navColor && navColor[1]}>
					<Row className="icons active--icon">

						<CreateIcon />

						<AnalyticsIcon />

						<NotificationIcon />

					</Row>
				</Col>

				<Col xs={16} lg={4} style={navColor && navColor[1]}>
					<Row className="profile">
						<Popover
							placement="bottomRight"
							trigger={['click', 'hover']}
							content={(
								<div>
									<Menu
										className="profile-menu-part"
										style={{
											width: '150px',
											borderRight: "none",
											backgroundColor: "transparent"
										}}
									>
										<Menu.Item
										id="order-menu-item"
										style={{
											textAlign: "center"
										}}
										>
											<Link to={"/order-tap-product"}>
												<Text style={{color: "white"}}>Order</Text>
											</Link>
										</Menu.Item>
									</Menu>
									<Menu
										id="mainmenu"
										style={{
											width: '150px',
											marginTop: "16px",
											border: "solid 1px #F0F0F0"
										}}
									>
										<Menu.Item
											style={{
												marginTop: '10px',
												marginBottom: '10px',
											}}
										>
											<Link to={`/${user && user.username}`}>
												<Text style={{color: "#20B2AA"}}>/{user && user.username}</Text>
											</Link>
										</Menu.Item>
										<Menu.Item
											style={{
												marginTop: '10px',
												marginBottom: '10px'
											}}
											className="nav-link"
										>
											<Link to="/create">
												<Text>Profile</Text>
											</Link>
										</Menu.Item>
										<Menu.Item
											style={{
												marginTop: '10px',
												marginBottom: '10px'
											}}
											className="nav-analytics"
										>
											<Link to="/analytics">
												<Text>Analytics</Text>
											</Link>
										</Menu.Item>
										{/* <Menu.Item
											style={{
												marginTop: '10px',
												marginBottom: '10px'
											}}
											className="nav-settings"
										>
											<Link to="/settings/billing">
												<Text>Billing</Text>
											</Link>
										</Menu.Item> */}
										<Menu.Item
											style={{
												marginTop: '10px',
												marginBottom: '10px'
											}}
											className="nav-billing"
										>
											<Link to="/settings/billing">
												<Text>Billing</Text>
											</Link>
										</Menu.Item>
										<Menu.Item
											style={{
												marginTop: '10px',
												marginBottom: '10px'
											}}
											className="nav-referrals"
										>
											<Link to="/settings/referrals">
												<Text>Referrals</Text>
											</Link>
										</Menu.Item>
										{/* <Menu.Item
											style={{
												marginTop: '10px',
												marginBottom: '10px'
											}}
											className="nav-plan"
										>
											<Link to="/settings/plan">
												<Text>Plan</Text>
											</Link>
										</Menu.Item> */}
										<Menu.Item
											className="logout-nav-part"
											style={{
												marginTop: '10px',
												marginBottom: '10px'
											}}
										>
											<div onClick={logout}>Logout</div>
										</Menu.Item>
									</Menu>
								</div>		
							)}
						>
							<div className="text ant-dropdown-link" onClick={e => e.preventDefault()}>
								<span className="ant-dropdown-label">
									Hey, {(user && user.firstName) || 'there'}!
								</span>
								<box-icon id="ant-dropdown-menu" name="menu"></box-icon>
							</div>
							
						</Popover>
					</Row>
				</Col>
			</Row>
		</main>
	)
}

export default AuthNavigation
