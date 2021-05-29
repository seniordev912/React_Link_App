import React, { useEffect, useState } from 'react'
import {
    Modal,
    Tag,
    Checkbox,
    Button,
    Select
} from 'antd'

import {
	useStripe,
    useElements, 
    Elements,
    CardElement
} from '@stripe/react-stripe-js'
import axios from '../../../../../constants/axios'
import { loadStripe } from '@stripe/stripe-js'
import './index.scss'

const { Option } = Select

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

const PaymentModal = ( props ) => {

    return (
        <Modal 
            title="UPGRADE PLAN"
            visible={props.open} 
            onCancel={props.hidePModal}
            onOk={props.hidePModal}
            footer={null}
        >
            <Elements stripe={stripePromise}>
                <CheckoutForm {...props} />
            </Elements>
        </Modal>
    )
}

const CheckoutForm = props => {

    const [state, setState] = useState({
        saveCreditStatus: false,
        saveStatus: 0,
        saveType: null
    })

    useEffect(() => {
        setState({
            ...state,
            saveType: props.saveType
        })
    }, [])

    const stripe = useStripe()
    const elements = useElements()

    const handleRPayment = async(event) => {
        event.preventDefault();

        const { user, showToast, saveMoney } = props
        const { saveType } = state

        try {
            if(saveMoney) {
                const billingDetails = {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    address: {
                        country: user.payment_details.country,
                        city: user.payment_details.city,
                        line1: user.payment_details.street_num,
                        line2: user.payment_details.unit_num,
                        state: user.payment_details.state,
                        postal_code: user.payment_details.zipcode
                    }
                }
        
                if (!stripe || !elements) {
                    return;
                }

                setState({
                    ...state,
                    saveStatus: 1
                })
    
                const payload = await stripe.createPaymentMethod({
                    type: 'card',
                    card: elements.getElement(CardElement),
                    billing_details: billingDetails
                })
    
                if(payload.error) {
                    setState({
                        ...state,
                        saveStatus: 0
                    })
                    showToast('error', payload.error.message)
                    return
                }
    
                const { data: clientSecret } = await axios.post('user/planPayment', {
                    amount: parseInt(saveMoney[saveType]) * 100,
                    email: user.email,
                    metadata: {
                        firstname: user.firstName,
                        lastname: user.lastName,
                        username: user.username,
                        amount: parseInt(saveMoney[saveType]) * 100
                    },
                    name: `${user.firstName} ${user.lastName}`,
                    payment_method: payload.paymentMethod.id,
                    billingDetails
                })
    
                const { error } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: payload.paymentMethod.id
                })
    
                if(error) {
                    setState({
                        ...state,
                        saveStatus: 0
                    })
                    showToast('error', error.message)
                } else {
                    const token = localStorage.getItem('token')
                    const result = await axios.post('user/auth/savePlanStatus', {
                        token,
                        planType: 'PRO',
                        values: {
                            expYear: payload.paymentMethod.card.exp_year,
                            expMonth: payload.paymentMethod.card.exp_month,
                            card: payload.paymentMethod.card.brand,
                            cardNum: payload.paymentMethod.card.last4,
                            country: user.payment_details.country,
                            city: user.payment_details.city,
                            street_num: user.payment_details.street_num,
                            state: user.payment_details.state,
                            zipcode: user.payment_details.zipcode,
                            total: saveMoney[saveType],
                            paymentId: payload.paymentMethod.id,
                            paymentSource: 'stripe',
                            paymentDate: new Date().toISOString(),
                            isSaved: state.saveCreditStatus
                        },
                        product: props.planProduct
                    })
                    if(result) {
                        props.loadUserInfo()
                        setState({
                            ...state,
                            saveStatus: 2
                        })
                        showToast('success', 'Successfully upgraded to the PRO plan')
                    } else {
                        showToast('error', 'Something went wrong on our side. Please try again soon.')
                    }
                    
                }
            }

        }catch(err) {
            setState({
                ...state,
                saveStatus: 0
            })
            if(err.response && err.response.data) {
                setState({
                    ...state,
                    saveStatus: 0
                })
				if(err.response.data.message) {
                    showToast('error', err.response.data.message)
				}
			} else {
                setState({
                    ...state,
                    saveStatus: 0
                })
                showToast('error', err.message)
			}
        }
    }

    const handleSelect = name => e => {
        const { saveCreditStatus } = state
        
        setState({
            ...state,
            [name] : !saveCreditStatus
        })
    }

    const handleChange = value => {
        setState({
            ...state,
            saveType: value
        })
    }

    const redirectStripe = () => {
        window.open('https://stripe.com/')
    }

    return (
        <form onSubmit={handleRPayment} className="payment-modal-part">
            <div className="service-name">
                <Tag className="bgcolor-dark-blue color-white common-text-size border-radius-3">PRO</Tag>
            </div>
            <div className="service-type">
                <div className="select-part">
                    <Select className="select-service-type" value={state.saveType} onChange={handleChange} showArrow={false}>
                        <Option value="Monthly">Monthly</Option>
                        <Option value="Yearly">Yearly</Option>
                    </Select>
                </div>
                <div className="price-display-part">
                    <h1>${props.saveMoney && props.saveMoney[state.saveType]}</h1>
                    <span className="common-text-size">
                        /
                        {
                            state.saveType === 'Monthly' && `month`
                        }
                        {
                            state.saveType === 'Yearly' && `year`
                        }
                    </span>
                </div>
            </div>
            <div className="service-type-desc common-text-small-size color-soft-black">
                Your could be saving 20% with annual billing!
            </div>

            <div className="payment-part">
                <CardElement options={{hidePostalCode: true}} />
            </div>

            <div className="save-credit-part">
                <Checkbox 
                    className="checkbox-save-credit" 
                    onChange={handleSelect('saveCreditStatus')}
                    checked={state.saveCreditStatus}
                >
                </Checkbox>
                <span className="label-checkbox-credit common-text-small-size"  onClick={handleSelect('saveCreditStatus')}>
                    Save my credit card on file for future orders. Secured by 
                </span>
                <span className="open-stripe-link common-text-small-size text-underline color-sky-blue" onClick={redirectStripe}>
                    Stripe
                </span>
            </div>

            <div className="service-submit">
                <div className="common-text-small-size">
                    Questions? Ask us at 
                    <a 
                        className="mail-to-part common-text-small-size color-sky-blue" 
                        href="mailto:hello@linkupcard.com"
                    >
                        hello@linkupcard.com
                    </a>
                </div>
                <Button className="payment-btn bgcolor-dark-blue color-white border-radius-3" htmlType="submit" disabled={!stripe}>
                    {state.saveStatus === 1 && (
                        <i className="fa fa-spinner fa-spin fa-3x fa-fw" />
                    )}
                    {state.saveStatus === 2 && (
                        <i className="fa fa-check" aria-hidden="true" />
                    )}
                    GET PRO
                </Button>
            </div>
        </form>
    )
}

export default PaymentModal