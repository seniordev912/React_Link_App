import React, { useState } from 'react'
import { Col, Row, Input, Button, Divider } from 'antd'
import iziToast from 'izitoast'
import moment from 'moment'
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement
} from '@stripe/react-stripe-js'
import axios from '../../constants/axios'

import 'izitoast/dist/css/iziToast.min.css'

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})

const SplitForm = props => {
	const stripe = useStripe()
	const elements = useElements()
	const [state, setState] = useState({
		username: '',
		lastname: '',
		firstname: '',
		email: '',
		discount: null,
		save_status: 0,
		errorMsg: false,
		successMsg: false,
		discountRate: 0,
		shippingRate: 0,
		highlightStyle: {}
	})

	const [highlight, setHighlight] = useState({})

	const handleSubmit = async event => {
		event.preventDefault()

		let input_data = {
			userInfo: {
				email: state.email,
				firstname: state.firstname,
				lastname: state.lastname,
				username: state.username,
			},
			step: 2
		}

		try{
			const step1_res = await axios.post('user/auth/confirmsignup2', input_data)
			if(step1_res.data.success) {
				
				if(!state.errorUNameMsg && !state.errorEmailMsg && !state.errorMsg) {
					const { billingInfos, product } = props

					const billingDetails = {
						name: `${state.firstname} ${state.lastname}`,
						email: state.email,
						address: {
							country: billingInfos.country,
							city: billingInfos.city,
							line1: billingInfos.street_num,
							state: billingInfos.state,
							postal_code: billingInfos.zipcode
						}
					}
					event.preventDefault()
					if (!stripe || !elements) {
						return
					}

					setState({
						...state,
						save_status: 1
					})

					const { data: clientSecret } = await axios.post('user/payment', {
						amount: (parseInt(subtotal()) + parseInt(ship_handle())) * 100,
						metadata: {
							username: state.username,
							discount: state.discount,
							subtotal: parseInt(subtotal()),
							shipping: parseInt(ship_handle()),
							total: parseInt(subtotal()) + parseInt(ship_handle())
						},
						email: state.email
					})

					const payload = await stripe.createPaymentMethod({
						type: 'card',
						card: elements.getElement(CardNumberElement),
						billing_details: billingDetails
					})

					if (payload.error) {
						setState({
							...state,
							save_status: 0
						})
						iziToast.error({
							title: 'Error',
							message: payload.error.message
						})
						return
					}

					const { error } = await stripe.confirmCardPayment(clientSecret, {
						payment_method: payload.paymentMethod.id
					})

					if (error) {
						setState({
							...state,
							save_status: 0
						})
						iziToast.error({
							title: 'Error',
							message: error.message
						})
					} else {
						setState({
							...state,
							save_status: 2
						})
						iziToast.success({
							title: 'Success',
							message: 'Paid successfully'
						})

						setTimeout( async () => {
							try {
								const input_data = {
									email: state.email,
									firstName: state.firstname,
									username: state.username,
									lastName: state.lastname,
									cardOrder: true,
									payment_details: {
										expYear: payload.paymentMethod.card.exp_year,
										expMonth: payload.paymentMethod.card.exp_month,
										card: payload.paymentMethod.card.brand,
										cardNum: payload.paymentMethod.card.last4,
										discount: state.discount,
										country: billingInfos.country,
										city: billingInfos.city,
										street_num: billingInfos.street_num,
										state: billingInfos.state,
										zipcode: billingInfos.zipcode,
										subtotal: parseInt(subtotal()),
										shipping: parseInt(ship_handle()),
										paymentDate: moment()
										// paidStatus: true
									}
									// referralCode: referralCode !== '' ? referralCode : undefined
								}
								const { data } = await axios.post('user/auth/newsignup', input_data)
								// axios.defaults.headers.authorization = `Bearer ${data.token}`
								
								if(data && data.user) {
									props.history.push(`/set-password/${state.email}`)
									iziToast.success({
										title: 'Success',
										message: 'Registered successfully'
									})
								}
							} catch (err) {
								if (err.response.data && err.response.data.error) {
									console.log(err.response.data.error)
									iziToast.error({
										title: 'Error',
										message: err.response.data.error
									})
								}
							}
						}, 3000)
						
					}
				} else {
					iziToast.error({
						title: 'Error',
						message: "Please fix the above validation errors"
					})
				}
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
							message: 'All input fields are mandatory, with the exception of the discount code.'
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

	const handleChange = key => async e => {
		// e.preventDefault()

		if (e.target.value) {
			setState({
				...state,
				[key]: e.target.value
			})
		} else if (e.target.checked) {
			setState({
				...state,
				[key]: e.target.checked
			})
		}

		if(key === 'email') {
			const emailVal = e.target.value
			setState({
				...state,
				errorEmailMsg: false,
				successEmailMsg: false
			})
			try{
				const emailCount = await axios.get(`user/auth/checkUniqueEmail/${emailVal}`)
				if(emailCount) {
					if(emailCount.data && emailCount.data.value === 0) {
						setState({
							...state,
							email: emailVal,
							successEmailMsg: false,
							errorEmailMsg: false
						})
					} else {
						setState({
							...state,
							email: '',
							successEmailMsg: false,
							errorEmailMsg: true
						})
					}
				}
			}catch(err){
				setState({
					...state,
					email: '',
					successEmailMsg: false,
					errorEmailMsg: false
				})
			}
		}

		if(key === 'username') {
			const userName = e.target.value
			setState({
				...state,
				errorUNameMsg: false,
				successUNameMsg: false
			})
			try{
				const uNameCount = await axios.get(`user/auth/checkUniqueUserName/${userName}`)
				if(uNameCount) {
					if(uNameCount.data && uNameCount.data.value === 0) {
						setState({
							...state,
							username: userName,
							successUNameMsg: false,
							errorUNameMsg: false
						})
					} else {
						setState({
							...state,
							username: '',
							successUNameMsg: false,
							errorUNameMsg: true
						})
					}
				}
			}catch(err){
				setState({
					...state,
					username: '',
					successUNameMsg: false,
					errorUNameMsg: false
				})
			}
		}

		if (key === 'discount') {
			const dis_value = e.target.value
			setState({
				...state,
				errorMsg: false,
				successMsg: false
			})
			try {
				const discountInfo = await axios.post('user/getDiscountInfo', {
					value: e.target.value,
					userId: -1
				})

				if (discountInfo && discountInfo.data.result) {
					setState({
						...state,
						successMsg: false,
						errorMsg: false,
						discountRate: 0,
						discount: dis_value,
						highlightStyle: {}
					})

					if (discountInfo.data.discountValue) {
						setState({
							...state,
							successMsg: true,
							errorMsg: false,
							discount: dis_value,
							discountRate: discountInfo.data.discountValue / 100,
							shippingRate: discountInfo.data.shipping / 100
						})
						setHighlight({ backgroundColor: '#3aa3ae15', padding: '4px 5px' })

						setTimeout(() => setHighlight({}), 3000)
					}
				} else {
					setState({
						...state,
						discountRate: 0,
						shippingRate: 0,
						discount: dis_value,
						successMsg: false,
						errorMsg: true
					})
				}
			} catch (err) {
				setState({
					...state,
					discountRate: 0,
					shippingRate: 0,
					discount: dis_value,
					successMsg: false,
					errorMsg: true
				})
			}
		}
	}

	const subtotal = () => {
		const { discountRate } = state
		const { product } = props
		return discountRate
			? parseFloat(product.price - product.price * discountRate).toFixed(2)
			: parseFloat(product.price).toFixed(2)
	}

	const ship_handle = () => {
		const { shippingRate } = state
		const { product } = props
		return shippingRate
			? parseFloat(product.ship - product.ship * shippingRate).toFixed(2)
			: parseFloat(product.ship).toFixed(2)
	}

	return (
		<form name="step1-form" onSubmit={handleSubmit}>
			<div className="header">
				<div className="title">You're Almost there!</div>
				<div className="desc">
					Add your credit card information and we'll ship the card right away. We ship
					globally!
				</div>
			</div>

			<div className="calc-part">
				{parseInt(props.product.price) !== parseInt(subtotal()) && (
					<div className="sub-calc-old-price-part">
						<div className="name" />
						<div className="value">${parseFloat(props.product.price).toFixed(2)}</div>
					</div>
				)}
				<div className="sub-calc-part">
					<div className="name">Subtotal</div>
					<div className="value" style={highlight}>
						${subtotal()}
					</div>
				</div>

				{parseInt(props.product.ship) !== parseInt(ship_handle()) && (
					<div className="sub-calc-old-price-part">
						<div className="name" />
						<div className="value">${parseFloat(props.product.ship).toFixed(2)}</div>
					</div>
				)}
				<div className="sub-calc-part">
					<div className="name">Shipping & Handling</div>
					<div className="value">
						${ship_handle()}
					</div>
				</div>

				<Divider />

				{parseFloat(props.product.price) + parseFloat(props.product.ship) !== parseFloat(subtotal()) + parseFloat(ship_handle()) && (
					<div className="sub-calc-old-price-part">
						<div className="name" />
						<div className="value">
							$
							{parseFloat(
								parseFloat(props.product.price) + parseFloat(props.product.ship)
							).toFixed(2)}
						</div>
					</div>
				)}

				<div className="total-calc-part">
					<div className="name">Total</div>
					<div className="value" style={highlight}>
						$
						{parseFloat(parseFloat(subtotal()) + parseFloat(ship_handle())).toFixed(2)}
					</div>
				</div>

				{/* <small>Est. delivery time: 1-7 days</small> */}
			</div>

			<div className="form-inputs" name="email">
				<Input
					size="large"
					className="card-name-part"
					placeholder="Email"
					value={state.email}
					defaultValue={state.email}
					onChange={handleChange('email')}
					onInput={handleChange('email')}
					type="email"
				/>
				<div className="result-msg-part" style={ state.errorEmailMsg || state.successEmailMsg ? {display: 'block'} : {display: 'none'} }>
					{state.errorEmailMsg && (
						<div className="error-msg">
							Someone else is using this ...
						</div>
					)}
				</div>
				{/* <div className="card-info-comment">Email</div> */}
			</div>

			<div className="form-inputs" name="username">
				<Input
					size="large"
					className="card-name-part"
					placeholder="Username"
					value={state.username}
					defaultValue={state.username}
					onChange={handleChange('username')}
					onInput={handleChange('username')}
				/>
				<div className="result-msg-part" style={ state.errorUNameMsg || state.successUNameMsg ? {display: 'block'} : {display: 'none'} }>
					{state.errorUNameMsg && (
						<div className="error-msg">
							Someone else is using this ...
						</div>
					)}
				</div>
				<div className="card-info-comment">
					This will be the username attached to your profile link like : 
					{` ${window.location.protocol}//${window.location.host}/${state.username}`}
				</div>
			</div>

			<Row gutter={8}>
				<Col lg={12} xs={24} md={24}>
					<div className="form-inputs" name="firstname">
						<Input
							size="large"
							className="card-name-part"
							placeholder="First Name"
							value={state.firstname}
							defaultValue={state.firstname}
							onChange={handleChange('firstname')}
							onInput={handleChange('firstname')}
						/>
						{/* <div className="card-info-comment">First Name</div> */}
					</div>
				</Col>
				<Col lg={12} xs={24} md={24}>
					<div className="form-inputs" name="lastname">
						<Input
							size="large"
							className="card-name-part"
							placeholder="Last Name"
							value={state.lastname}
							defaultValue={state.lastname}
							onChange={handleChange('lastname')}
							onInput={handleChange('lastname')}
						/>
						{/* <div className="card-info-comment">Last Name</div> */}
					</div>
				</Col>
			</Row>

			<div className="form-inputs" name="card_num">
				<CardNumberElement className="card-num-input" />
				<div className="card-info-comment">Card Number</div>
			</div>
			<Row gutter={8}>
				<Col lg={12} xs={24} md={24}>
					<div className="form-inputs" name="exp_date">
						<CardExpiryElement className="exp-date-input" />
						<div className="card-info-comment">Expiry Date</div>
					</div>
				</Col>
				<Col lg={12} xs={24} md={24}>
					<div className="form-inputs" name="cvc">
						<CardCvcElement className="card-cvc-input" />
						<div className="card-info-comment">Three digits on the back of your card</div>
					</div>
				</Col>
			</Row>

			<div className="form-inputs" name="discount_code">
				<Input
					size="large"
					placeholder="Have a discount code? Add it here"
					value={state.discount}
					defaultValue={state.discount}
					onChange={handleChange('discount')}
					onInput={handleChange('discount')}
				/>
			</div>

			<div className="result-msg-part" style={ state.errorMsg || state.successMsg ? {display: 'block'} : {display: 'none'} }>
				{state.errorMsg && (
					<div className="error-msg">
						This code does not exist or has expired. Try another one
					</div>
				)}
				{state.successMsg && <div className="success-msg">Code successfully applied</div>}
			</div>

			<div className="form-inputs button-group">
				<Button
					size="large"
					className="confirm-button"
					disabled={!stripe}
					htmlType="submit"
				>
					{state.save_status === 0 && 'Pay'}
					{state.save_status === 1 && (
						<>
							<i className="fa fa-spinner fa-spin fa-3x fa-fw" />
							Loading...
						</>
					)}
					{state.save_status === 2 && (
						<>
							<i className="fa fa-check" aria-hidden="true" />
							Pay
						</>
					)}
				</Button>

				<Button size="large" className="prev-button" onClick={props.handlePrevButton}>
					Back
				</Button>
			</div>
		</form>
	)
}

export default SplitForm
