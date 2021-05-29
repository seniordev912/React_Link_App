import React, { Component } from 'react'
// import { withRouter } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Col, Row, Form, Input, Button, AutoComplete } from 'antd'
import { connectStoreon } from 'storeon/react'
import countryList from 'react-select-country-list'
import AuthNavigation from '../../components/AuthNavigation'
import axios from '../../constants/axios'
import iziToast from 'izitoast'
// import Heart from '../../assets/images/heart.svg'
import MetaTags from 'react-meta-tags'
import Footer from '../../components/Footer'
import SplitForm from './SplitForm'
import LUCard from './LUCard'
import SocialMetaImg from '../../assets/images/meta-social.png'
import './index.scss'

const { Option } = AutoComplete

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

class Card extends Component {
	constructor(props) {
		super(props)
		this.state = {
			step: 0,
			billingInfos: null,
			country_option: countryList().getData(),
			country_value: null,
			product: {
				name: 'linkup',
				productBy: 'Linkup'
			},
			payment_prices: null,
			fullname: null,
			street_num: '',
			city: '',
			province: '',
			zipcode: '',
			country: '',
			countryName: ''
		}
	}

	async componentDidMount() {
		const { user } = this.props
		if (user && user.cardOrder) {
			this.setState({
				step: 2
			})
		} else {
			const { product } = this.state
			const result = await axios.get('user/payment')
			if (result && result.data && result.data.amount) {
				this.setState({
					product: {
						...product,
						price: (Math.round(result.data.amount.unit_amount) / 100).toFixed(2)
					},
					payment_prices: result.data
				})
			}
		}

		const newScript = document.createElement('script')
		newScript.type = 'text/javascript'
		newScript.async = true
		newScript.innerHTML =
			'!function(d,s,c){s=d.createElement(\'script\');s.src=\'https://widget.indemand.ly/launcher.js\';s.onload=function(){indemandly=new Indemandly({domain:\'david-phan\'})};c=d.getElementsByTagName(\'script\')[0];c.parentNode.insertBefore(s,c)}(document)'
		document.head.appendChild(newScript)
	}

	handleChange = key => event => {
		if (event.target.value) {
			this.setState({
				[key]: event.target.value
			})
		}
	}

	handleSelect = key => event => {
		if (key === 'country') {
			const { country_option, product, payment_prices } = this.state
			let findResult = country_option.find(e => e.label === event)

			console.log(findResult && findResult.value)

			if (payment_prices && findResult) {
				let cSName = findResult.value
				this.setState({
					product: {
						...product,
						ship:
							cSName === 'CA'
								? (Math.round(payment_prices.ship.CA.unit_amount) / 100).toFixed(2)
								: cSName === 'US'
									? (Math.round(payment_prices.ship.US.unit_amount) / 100).toFixed(2)
									: (Math.round(payment_prices.ship.WW.unit_amount) / 100).toFixed(2)
					},
					countryValue: cSName
				})
			}
		}
		this.setState({
			[key]: event
		})
	}

	handlePrevButton = () => {
		const { step } = this.state
		if (step === 1) {
			this.setState({
				step: 0
			})
		}
	}

	changeHandler = value => {
		this.setState({
			country_value: value
		})
	}

	onFinishStep1 = async values => {
		const { step, product, street_num, city, province, zipcode, countryValue } = this.state
		console.log("country value", countryValue)
		let input_data =  {
			billingInfos: {
				street_num,
				city,
				province,
				zipcode: zipcode.toUpperCase(),
				country: countryValue
			},
			step: 1
		}
		try{
			const step1_res = await axios.post('user/auth/confirmsignup1', input_data)
			if(step1_res.data.success && product && product.ship) {
				values['country'] = countryValue
				this.setState({
					step: step + 1,
					billingInfos: values
				})
			} else {
				iziToast.error({
					title: 'Error',
					message: step1_res.data.message
				})
			}
		} catch(err) {
			if(err.response && err.response.data) {
				if(err.response.data.message) {
					iziToast.error({
						title: 'Error',
						message: err.response.data.message
					})
				} else if(err.response.data.error) {
					if(Array.isArray(err.response.data.error)) {
						iziToast.error({
							title: 'Error',
							message: 'All input fields are mandatory.'
						})
					} else {
						iziToast.error({
							title: 'Error',
							message: err.response.data.error || err.response.data.error[0]
						})
					}
				}
				
			} else {
				iziToast.error({
					title: 'Error',
					message: err.message
				})
			}
			
		}
	}

	onFinishStep2 = async values => {
		const { step } = this.state
		const token = localStorage.getItem('token')
		if (token) {
			console.log(values)
			const res = await axios.post('user/auth/setShippingDetails', {
				token,
				data: values
			})
			if (res) {
				this.setState({
					step: step + 1,
					fullname: values.userName
				})
			}

			this.props.loadUserInfo()
		}
	}

	skipCardStep = () => {
		const { user } = this.props
		user.order = false
		this.props.dispatch('session/set', user)
		this.props.history.push('/create')
	}

	render() {
		const { user } = this.props
		const {
			step,
			billingInfos,
			product,
			country_option,
			street_num,
			city,
			province,
			country,
			zipcode
		} = this.state

		let navColor = []
		if (step === 0 || step === 1) {
			navColor = [{ backgroundColor: '#d6eff1' }, {}]
		} else if (step === 2) {
			navColor = [{ backgroundColor: '#d6eff1' }, { backgroundColor: '#d6eff1' }]
		}

		const selectedCList = (country_option || []).filter(e => e.label.toLowerCase().includes(country.toLowerCase()))

		user['fullname'] = this.state.fullname

		return (
			<div className="container-fluid card-main-container">

				<MetaTags>
					<meta name="title" content="LinkUp - All your links in one place" />
					<meta name="description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
					<meta name="image" content={SocialMetaImg} />

					<meta itemProp="title" content="LinkUp - All your links in one place" />
					<meta itemProp="description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
					<meta itemProp="image" content={SocialMetaImg} />

					<meta name="twitter:title" content="LinkUp - All your links in one place" />
					<meta name="twitter:description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
					<meta name="twitter:image" content={SocialMetaImg} />

					<meta property="fb:title" content="LinkUp - All your links in one place" />
					<meta property="fb:description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
					<meta property="fb:image" content={SocialMetaImg} />
				</MetaTags>

				<AuthNavigation user={user} navColor={navColor} cardActive={step === 2} />

				<Row className="step-container">
					{(step === 0 || step === 1) && (
						<>
							<Col className="s-left-part" lg={8} xs={24} md={24}>
								<div className="top-part">
									<div className="comment">
										<div className="comment-title">What's this card for?</div>
										<div className="comment-text">
											Link Up is made easy to share wherever your audience is including
											offline with our new Link Up Card! Share anything with one tap or
											scan! Everywhere you are online and offline can now be in one place.
											Get it soon while quantities last!
										</div>
									</div>
								</div>
							</Col>
							<Col className="s-right-part" lg={16} xs={24} md={24}>
								{step === 0 && (
									<div className="step-input-form">
										<Form name="step0-form" onFinish={this.onFinishStep1}>
											<div className="header">
												<div className="title">Let's get started!</div>
												<div className="desc">
													In under 1 minute, you can order your card and engage with fans
												</div>
											</div>

											<div className="ship-comment">
												We ship worldwide. Start by entering your <b>shipping address</b>
											</div>

											<Form.Item name="street_num">
												<Input
													id="stripe-input-tag"
													size="large"
													value={street_num}
													defaultValue={street_num}
													placeholder="Street number and name"
													onChange={this.handleChange('street_num')}
												/>
											</Form.Item>

											<Form.Item name="city">
												<Input
													id="stripe-input-tag"
													size="large"
													value={city}
													defaultValue={city}
													placeholder="City"
													onChange={this.handleChange('city')}
												/>
											</Form.Item>

											<Form.Item name="state">
												<Input
													id="stripe-input-tag"
													size="large"
													value={province}
													defaultValue={province}
													placeholder="State/Province"
													onChange={this.handleChange('province')}
												/>
											</Form.Item>

											<Form.Item
												name="country"
											>
												{/* <Input size="large" placeholder="Country" /> */}
												<AutoComplete
													size="large"
													value={country}
													defaultValue={country}
													placeholder="Country"
													onChange={this.handleSelect('country')}
												>
													{ (selectedCList || []).map((val, index) => (
															<Option key={index} value={val.label}>
																{val.label}
															</Option>
														))}
												</AutoComplete>
											</Form.Item>

											<Form.Item name="zipcode">
												<Input
													id="stripe-input-tag"
													size="large"
													value={zipcode}
													defaultValue={zipcode}
													placeholder="Zip code"
													onChange={this.handleChange('zipcode')}
												/>
											</Form.Item>

											<Form.Item>
												<Button size="large" className="confirm-button" htmlType="submit">
													Next
												</Button>
											</Form.Item>
										</Form>
									</div>
								)}

								{step === 1 && (
									<div className="step-input-form">
										<Elements stripe={stripePromise}>
											<SplitForm
												onFinishStep2={this.onFinishStep2}
												handlePrevButton={this.handlePrevButton}
												billingInfos={billingInfos}
												user={user}
												product={product}
											/>
										</Elements>
									</div>
								)}

								<div className="skip-step-part">
									<a onClick={this.skipCardStep} href="#">Skip this step</a>
								</div>
							</Col>
						</>
					)}

					{step === 2 && (
						<div className="finish-part">
							<div className="top-back-part" />
							<div className="bottom-back-part">
								<Footer />
							</div>
							<div className="main-card-part">
								<LUCard user={user} />
								<div className="comment">
									Your card is ready to go. Snap a 📷 of the QR code to see it in action!
									Your physical card will be nfc-chip enabled so you can easily tap on the
									go.
								</div>
							</div>
						</div>
					)}
				</Row>
			</div>
		)
	}
}

export default connectStoreon('session', Card)
