import React, { useState } from 'react'
import { Col, Row, Input, Button, Divider } from 'antd'
import iziToast from 'izitoast'
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement
} from '@stripe/react-stripe-js'
import axios from '../../constants/axios'

const SplitForm = props => {
	const stripe = useStripe()
	const elements = useElements()
	const [state, setState] = useState({
		displayname: '',
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
			displayName: state.displayname,
			step: 3
		}

		try{
			const step1_res = await axios.post('user/auth/confirmsignup3', input_data)
			if(step1_res.data.success) {
				const { billingInfos, user, product } = props

				const billingDetails = {
					name: `${state.firstname} ${state.lastname}`,
					email: user.email,
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
						username: user.username,
						discount: state.discount,
						subtotal: parseInt(subtotal()),
						shipping: parseInt(ship_handle()),
						total: parseInt(subtotal()) + parseInt(ship_handle())
					},
					email: user.email
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
						message: 'Success'
					})

					props.onFinishStep2({
						expYear: payload.paymentMethod.card.exp_year,
						expMonth: payload.paymentMethod.card.exp_month,
						card: payload.paymentMethod.card.brand,
						cardNum: payload.paymentMethod.card.last4,
						userName: state.username,
						discount: state.discount,
						country: billingInfos.country,
						city: billingInfos.city,
						street_num: billingInfos.street_num,
						state: billingInfos.state,
						zipcode: billingInfos.zipcode,
						subtotal: parseInt(subtotal()),
						shipping: parseInt(ship_handle()),
						// paidStatus: true
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
					userId: props.user.id
				})

				if (discountInfo && discountInfo.data.result) {
					setState({
						...state,
						successMsg: false,
						errorMsg: false,
						discountRate: 0,
						shippingRate: 0,
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
			</div>

			<div className="form-inputs" name="card_name">
				<Input
					size="large"
					className="card-name-part"
					placeholder="Name on card"
					value={state.displayname}
					defaultValue={state.displayname}
					onChange={handleChange('displayname')}
					onInput={handleChange('displayname')}
				/>
				<div className="card-info-comment">The name on your Credit Card</div>
			</div>

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

			<div className="result-msg-part">
				{state.errorMsg && (
					<div className="error-msg">
						This code does not exist or has expired. Try another one
					</div>
				)}
				{state.successMsg && <div className="success-msg">Code successfully applied</div>}
			</div>

			<div className="form-inputs">
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
