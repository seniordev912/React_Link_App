import React, { useState } from 'react'
import { Row, Col, Input, Button, Form } from 'antd'
import { Link } from 'react-router-dom'
import './index.css'
import iziToast from 'izitoast'
import LogoIcon from '../Navigation/images/linkup_icon.png'
import { signToNewsletter } from '../../constants/airtable'
import 'izitoast/dist/css/iziToast.min.css'
import { ArrowRightOutlined } from '@ant-design/icons'

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})

function FooterApp() {
	const [loading, setLoading] = useState(false)
	const onFinish = async values => {
		try {
			setLoading(true)
			await signToNewsletter(values.email)
			iziToast.success({
				message: `You're in! Your email has been recorded`
			})
		} catch {
			iziToast.error({
				title: 'Error',
				message: `Try again later! We couldn't add your email at this time.`
			})
		} finally {
			setLoading(false)
		}
	}
	return (
		<div className="container">
			<div className="footer">
				<Row>
					<Col className={"logo"} xs={24} lg={4}>
						<Link to="/">
							<img src={LogoIcon} className="icon-width" alt="linkupcard" />
						</Link>
					</Col>
					<Col align="left" xs={24} lg={4} className="marginTop2">
						<h5>General</h5>
						<Link 
							to="/" 
						>
							<p className={"footer-link"} type="secondary">Home</p>
						</Link>
						<Link 
							to="/signup" 
						>
							<p className={"footer-link"} type="secondary">Sign up</p>
						</Link>
						<Link
							to="/signin"
						>
							<p className={"footer-link"} type="secondary">Sign in</p>
						</Link>
						<Link
							to="/contact"
						>
							<p className={"footer-link"} type="secondary">Contact us</p>
						</Link>
					</Col>
					<Col align="left" xs={24} lg={4} className="marginTop">
						<h5>Community</h5>
						<Link
							to="/testimonials"
						>
							<p className={"footer-link"} type="secondary">Testimonials</p>
						</Link>
						<a
							href="https://www.instagram.com/linkupcard/"
							rel="noopener noreferrer"
							target="_blank"
						>
							<p className={"footer-link"} type="secondary">Instagram</p>
						</a>
						<a
							href="https://www.notion.so/Linkup-Wiki-e55bf19c02c1454dabbf31d2ab66f268"
							rel="noopener noreferrer"
							target="_blank"
						>
							<p className={"footer-link"} type="secondary">
								Linkup Wiki
							</p>
						</a>
					</Col>
					<Col align="left" xs={24} lg={5} className="marginTop">
						<h5>More</h5>
						<Link 
							to="/privacy" 
							rel="noopener noreferrer" 
							target="_blank">
								<p className={"footer-link"} type="secondary">Privacy</p>
						</Link>
						<Link 
							to="/terms" 
							rel="noopener noreferrer" 
							target="_blank">
								<p className={"footer-link"} type="secondary">Terms & Conditions</p>
						</Link>
						<Link
							to="https://linkupcard.statuspage.io/"
							rel="noopener noreferrer"
							target="_blank"
						>
							<p className={"footer-link"} type="secondary">App status</p>
						</Link>
					</Col>
					<Col align="left" xs={24} lg={7} className="marginTop">
						<h5>Stay updated</h5>
						<Form onFinish={onFinish} className={"email--input--container"}>
							
							<Form.Item>
								<div className={"join-container"}>
									<div >
										<Form.Item
										name="email"
										rules={[
											{
												type: 'email',
												message: 'The input is not a valid email!'
											},
											{
												required: true,
												message: 'Please input your email!'
											}
										]}
										>
											<Input
												className="email--input"
												placeholder="Email"
											/>
										</Form.Item>
									</div>
									<Button className={"join"} htmlType="submit" loading={loading}>
										<ArrowRightOutlined />
									</Button>
								</div>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</div>
		</div>
	)
}

export default FooterApp
