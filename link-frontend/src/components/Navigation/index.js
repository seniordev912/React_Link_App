import React from 'react'
import { Col, Row, Dropdown } from 'antd'
import Logo from './images/linkup_icon.png'
import { Link } from 'react-router-dom'
import { MenuOutlined } from '@ant-design/icons'
import './index.css'


function Navigation(props) {

	const menu = (
		<Row className={"menu-container"}>
			<Col span={24}>
				<Link to="/contact" className="ant-btn login-menu color-grey-black">
					Contact
				</Link>
			</Col>
			<Col span={24}>
				<Link to="/testimonials" className="ant-btn login-menu color-grey-black">
					Testimonials
				</Link>
			</Col>
			<Col span={24}>
				<Link to="/signin" className="ant-btn login-menu color-grey-black">
					Login
				</Link>
			</Col>
			<Col span={24}>
				<Link to="/signup" className="ant-btn signup-menu">
					Sign Up
				</Link>
			</Col>
		</Row>
	)	
	
	return (
		<main className={`main--nav ${props.status && props.status === 2 ? 'signup-finish' : ''}`}>
			<Row>
				<Col className="left-part" span={9} style={props.navColor && props.navColor[0]}>
					<Link to="/">
						<img className="logo-img" src={Logo} alt="linkup logo" />
					</Link>
				</Col>
				<Col className="right-part" span={15} style={props.navColor && props.navColor[1]}>
					<Row className="profile">
						<Link className="ant-btn signup" to="/signup">
							Sign Up
						</Link>
						<Link className="ant-btn login" to="/signin">
							Login
						</Link>
						<Link className="ant-btn login" to="/testimonials">
							Testimonials
						</Link>
						<Link className="ant-btn login" to="/contact">
							Contact
						</Link>
						<Dropdown overlay={menu} trigger={['click']}>
							<div >
								<MenuOutlined className={"main-menu"}/>
							</div>
						</Dropdown>
					</Row>
				</Col>
			</Row>

			
		</main>
	)
}

export default Navigation
