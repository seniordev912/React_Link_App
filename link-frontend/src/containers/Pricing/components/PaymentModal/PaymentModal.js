import React, { useState, useEffect } from 'react'
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
import { loadStripe } from '@stripe/stripe-js'
import axios from '../../../../constants/axios'
import LinkUpMark from '../../../../assets/icons/linkup_icon.png'
import './index.scss'

const { Option } = Select

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

const PaymentModal = (props) => {

    return (
        <Modal 
            visible={props.open} 
            onCancel={props.hidePModal}
            onOk={props.hidePModal}
            footer={null}
        >
            <div className="top-part">
                <div className="top-part-img">
                    <img src={LinkUpMark} />
                </div>
                <div className="top-part-title text-center page-subtitle-size">
                    Finish Payment
                </div>
            </div>
            <Elements stripe={stripePromise}>
                <CheckoutForm {...props} />
            </Elements>
        </Modal>
    )
}

const CheckoutForm = props => {

    const [state, setState] = useState({
        saveCreditStatus: false,
        serviceType: 'Monthly',
        saveStatus: 0
    })

    const [saveMoney, setSaveMoney] = useState(null)
    const [planProduct, setPlanProduct] = useState(null)

    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
        const getPProducts = async() => {
            const pproducts = await axios.get('user/getPlanProducts')
            console.log(pproducts.data)
            setSaveMoney(pproducts.data.product.prices)
            setPlanProduct(pproducts.data.product)
        }
        getPProducts()
    }, [])

    const handleRPayment = async(event) => {
        event.preventDefault();

        console.log("--------->>>>", props)

        const { user, showToast } = props

        try {
            if(saveMoney) {
                const billingDetails = {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    // address: {
                    //     country: user.payment_details.country,
                    //     city: user.payment_details.city,
                    //     line1: user.payment_details.street_num,
                    //     line2: user.payment_details.unit_num,
                    //     state: user.payment_details.state,
                    //     postal_code: user.payment_details.zipcode
                    // }
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
                    amount: parseInt(saveMoney[state.serviceType]) * 100,
                    email: user.email,
                    metadata: {
                        firstname: user.firstName,
                        lastname: user.lastName,
                        username: user.username,
                        amount: parseInt(saveMoney[state.serviceType]) * 100
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
                    console.log("---------->>>>>>", planProduct, payload)
                    const token = localStorage.getItem('token')
                    const result = await axios.post('user/auth/savePlanStatus', {
                        token,
                        planType: 'PRO',
                        values: {
                            expYear: payload.paymentMethod.card.exp_year,
                            expMonth: payload.paymentMethod.card.exp_month,
                            card: payload.paymentMethod.card.brand,
                            cardNum: payload.paymentMethod.card.last4,
                            // country: user.payment_details.country,
                            // city: user.payment_details.city,
                            // street_num: user.payment_details.street_num,
                            // state: user.payment_details.state,
                            // zipcode: user.payment_details.zipcode,
                            total: saveMoney[state.serviceType],
                            paymentId: payload.paymentMethod.id,
                            paymentSource: 'stripe',
                            paymentDate: new Date().toISOString(),
                            isSaved: state.saveCreditStatus
                        },
                        product: planProduct
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

    const handleChange = name => value => {
        setState({
            ...state,
            [name]: value
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
                    <Select value={state.serviceType} onChange={handleChange('serviceType')} showArrow={false}>
                        <Option value="Monthly">Monthly</Option>
                        <Option value="Yearly">Yearly</Option>
                    </Select>
                </div>
                <div className="price-display-part">
                    {saveMoney && (
                        <>
                            <h1>${saveMoney[state.serviceType]}</h1>
                            <span className="common-text-size">
                                / {state.serviceType === 'Yearly' ? 'year' : state.serviceType === 'Monthly' && 'month'}
                            </span>
                        </>
                    )}
                </div>
            </div>
            <div className="service-type-desc common-text-small-size color-soft-black">
                {
                    saveMoney && state.serviceType === 'Monthly' && (
                        `You could be saving $${Math.ceil(saveMoney['Monthly'] * 12 * 0.2)} on the annual plan!`
                    )
                }
                {
                    saveMoney && state.serviceType === 'Yearly' && (
                        `You're saving $${Math.ceil(saveMoney['Monthly'] * 12 * 0.2)}!`
                    )
                }
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

            <div className="question-text common-text-small-size text-center">
                Questions? Ask us at 
                <a className="mail-to-part common-text-small-size color-sky-blue" href="mailto:hello@linkupcard.com">
                    hello@linkupcard.com
                </a>
            </div>

            <div className="service-submit">
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