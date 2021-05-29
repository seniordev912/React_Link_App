import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Collapse,
    Button,
    Divider,
    Input,
    Tag,
    Badge,
    Checkbox
} from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import { useHistory } from "react-router-dom"
import {
	useStripe,
    useElements, 
    CardElement
} from '@stripe/react-stripe-js'
import { Breadcumb } from './Component'
import axios from '../../constants/axios'
import { useStoreon } from 'storeon/react'
import 'antd/dist/antd.css'
import { CheckOutlined } from '@ant-design/icons'
import PaypalExpressBtn from 'react-paypal-express-checkout'
// import PaypalImg from '../../assets/icons/ic-paypal.png'
import 'boxicons'

const { Panel } = Collapse


const calculateTimeLeft = (firstCall) => {

    const difference = +new Date(firstCall.date) - +new Date()

    let timeLeft = {}

    if(difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            mins: Math.floor((difference / 1000 / 60) % 60),
            sec: Math.floor((difference / 1000) % 60)
        }
    }

    return timeLeft
}

const Step3 = ({ 
    selProducts, 
    selShipValue, 
    billingInfos, 
    movePrevStep, 
    setStepsInfo, 
    stepInfo, 
    showToast,
    userInfo,
    productInfo,
    authExist,
    user,
    firstCall,
    loadUserInfo,
    selectProducts,
    setRQuantity
}) => {

    const stripe = useStripe()
    const elements = useElements()
    const history = useHistory()
    const [highlight, setHighlight] = useState({})
	const [state, setState] = useState({
        quantity: 1,
		discount: null,
		saveStatus: 0,
        discountName: '',
        discountId: null,
        saveCreditStatus: false
    })
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(firstCall))
    const [discountMsg, setDiscountMsg] = useState({
        errorDMsg: false,
        errorDNMsg: null,
		successDMsg: false,
    })

    const [paymentType, setPaymentType] = useState({
        credit: false,
        paypal: false
    })
    
    const { dispatch } = useStoreon('authUser')

    const [prices, setPrices] = useState({
        subtotal_price: { new: 0, origin: 0 },
        ship_price: { new: 0, origin: 0 },
        total_price: { new: 0, origin: 0 },
        discount_price: 0,
        tax_rate: null
    })
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(firstCall))
        }, 1000)

        return () => clearTimeout(timer)
    })

    const timerComponents = []

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }
        
        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]} {interval}
                {interval === 'sec' ? "" : interval === 'mins' ? ", and " : ", "}
            </span>
        );
    })

    useEffect(() => {
        if(stepInfo) {
            setState({
                ...state,
                quantity: stepInfo.quantity,
                discount: stepInfo.discount,
            })
            if(stepInfo.discount) {
                checkDiscountCode(stepInfo.discount)
            }
        }
    }, [stepInfo])

    useEffect(() => {
        const { discountId } = state
        if(selProducts && selShipValue && Object.keys(selShipValue).length > 0) {
            const getPriceInfos = async() => {
                const result = await axios.post('user/product/getProductPrices', 
                    {
                        selProducts,
                        selShipValue,
                        discountId,
                        userInfo,
                    }
                )
                if(result) {
                    setPrices({
                        subtotal_price: result.data.subtotal_price,
                        ship_price: result.data.ship_price,
                        total_price: result.data.total_price,
                        discount_price: result.data.discount_price,
                        tax_rate: result.data.tax_rate
                    })
                }
            }
            getPriceInfos()
        }
    }, [selProducts, selShipValue, state.discountId, state.quantity])
    
    const handleChange = key => async e => {
        e.preventDefault()

		if (e.target.value || e.target.value !== undefined) {
            setStepsInfo({
                quantity: state.quantity,
                discount: state.discount,
                [key]: e.target.value
            })
			setState({
				...state,
				[key]: e.target.value
			})
		}

		if (key === 'discount') {
			const dis_value = e.target.value
			checkDiscountCode(dis_value)
		}
    }

    const checkDiscountCode = async discountCode => {

        setDiscountMsg({
            errorDNMsg: null,
            successDMsg: false,
            errorDMsg: false,
        })
        
        setState({
            ...state,
            discountName: '',
            discountId: null,
            discount: discountCode
        })

        let cQuatity = 0
        selProducts.forEach(pItem => {
            cQuatity += parseInt(pItem.quantity)
        })

        try {
            if(discountCode) {
                const discountInfo = await axios.post('user/getDiscountInfo', {
                    value: discountCode,
                    userId: -1
                })
                if (discountInfo && discountInfo.data.result) {
                    if (discountInfo.data.discountValue) {
                        if(discountInfo.data.partner === true && ((selProducts || []).length > 1 || ((selProducts || []).length === 1 && cQuatity > 1))) { 
                            setDiscountMsg({
                                successDMsg: false,
                                errorDMsg: true,
                                errorDNMsg: 'This code can only be used with one product and one quantity!'
                            })
                            setState({
                                ...state,
                                discountName: '',
                                discountId: null,
                                discount: discountCode
                            })
                        } else {
                            setDiscountMsg({
                                successDMsg: true,
                                errorDMsg: false,
                                errorDNMsg: null,
                            })
                            setState({
                                ...state,
                                discount: discountCode,
                                discountId: discountInfo.data.discountId,
                                discountName: discountInfo.data.discountName
                            })
                            setHighlight({ backgroundColor: '#3aa3ae15', padding: '4px 5px' })
                            setTimeout(() => setHighlight({}), 3000)
                        }
                    }
                } else {
                    setDiscountMsg({
                        successDMsg: false,
                        errorDMsg: true,
                        errorDNMsg: null,
                    })
                }
            }
        } catch (err) {
            setDiscountMsg({
                successDMsg: false,
                errorDMsg: true,
                errorDNMsg: null,
            })
        }
    }
    
    const handleSubmit = async event => {
        event.preventDefault()

        if(state.quantity !== 1) {
            checkDiscountCode(state.discount)
        }

        setStepsInfo({
            quantity: state.quantity,
            discount: state.discount
        })

        try {
            if(!discountMsg.errorDMsg) {
                const billingDetails = {
                    name: authExist ? `${user.firstName} ${user.lastName}` : `${userInfo.firstname} ${userInfo.lastname}`,
                    email: authExist ? user.email : userInfo.email,
                    address: {
                        country: billingInfos.country,
                        city: billingInfos.city,
                        line1: billingInfos.street_num,
                        line2: billingInfos.unit_num,
                        state: billingInfos.province,
                        postal_code: billingInfos.zipcode
                    }
                }

                if(!stripe || !elements) {
                    return
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

                const { data : clientSecret } = await axios.post('user/payment', {
                    amount: Math.ceil(prices.total_price.new * 100),
                    email: authExist ? user.email : userInfo.email,
                    metadata: {
                        firstname: authExist ? user.firstName : userInfo.firstname,
                        lastname: authExist ? user.lastName : userInfo.lastname,
                        username: authExist ? user.username : userInfo.username,
                        discount: state.discount,
                        subtotal: Math.ceil(prices.subtotal_price.new * 100),
                        originalSubtotal: Math.ceil(prices.subtotal_price.origin * 100),
                        shipping: Math.ceil(prices.ship_price.new * 100),
                        total: Math.ceil(prices.total_price.new * 100),
                        originTotal: Math.ceil(prices.total_price.origin * 100),
                        discountValue: -Math.ceil(prices.discount_price * 100),
                        taxRate: prices.tax_rate ? prices.tax_rate.value : 0
                    },
                    name: authExist ? `${user.firstName} ${user.lastName}` : `${userInfo.firstname} ${userInfo.lastname}`,
                    payment_method: payload.paymentMethod.id,
                    billingDetails,
                    discount: state.discountId,
                    selProducts
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
                    setState({
                        ...state,
                        saveStatus: 2
                    })
                    
                    showToast('success', 'Your payment has been successfully processed. Welcome to your profile, everything you need to set up your account is here!')

                    if(!authExist) {
                        registerUserInfo1(payload, 'stripe')
                    } else {
                        registerUserInfo2(payload, 'stripe')
                    }
                }
            } else {
                setState({
                    ...state,
                    saveStatus: 0
                })
                showToast('error', 'Please fix the above validation error')
            }
        } catch(err) {
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
				} else if(err.response.data.error) {
					if(Array.isArray(err.response.data.error)) {
                        showToast('error', 'All input fields are mandatory, with the exception of the discount code.')
					} else {
                        showToast('error', err.response.data.error || err.response.data.error[0])
					}
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
    
    const registerUserInfo1 = async(payload, type) => {
        const input_data = {
            email: userInfo.email,
            password: userInfo.password,
            firstName: userInfo.firstname,
            lastName: userInfo.lastname,
            username: userInfo.username,
            displayName: productInfo.displayName ? productInfo.displayName : `${userInfo.firstname} ${userInfo.lastname}`,
            cardOrder: true,
            payment_details: {
                country: userInfo.shipCountry,
                city: userInfo.city,
                street_num: userInfo.street_num,
                unit_num: userInfo.unit_num,
                state: userInfo.province,
                zipcode: userInfo.zipcode,
                paymentId: type === 'stripe' ? payload.paymentMethod.id : payload.paymentID,
                paymentSource: type,
                paymentDate: new Date().toISOString(),
                discount: state.discount,
                subtotal: prices.subtotal_price.new,
                shipping: prices.ship_price.new,
                total: prices.total_price.new,
                quantity: state.quantity,
                isSaved: state.saveCreditStatus
            },
            selProducts
        }
        const { data } = await axios.post('user/auth/signup', input_data)
        axios.defaults.headers.authorization = `Bearer ${data.token}`
        dispatch('session/set', data.user)
        localStorage.setItem('token', data.token)
    }

    const registerUserInfo2 = async(payload, type) => {
        const token = localStorage.getItem('token')
        const payment_details = {
            country: userInfo.shipCountry,
            city: userInfo.city,
            street_num: userInfo.street_num,
            unit_num: userInfo.unit_num,
            state: userInfo.province,
            zipcode: userInfo.zipcode,
            paymentId: type === 'stripe' ? payload.paymentMethod.id : payload.paymentId,
            paymentSource: type,
            paymentDate: new Date().toISOString(),
            discount: state.discount,
            subtotal: prices.subtotal_price.new,
            shipping: prices.ship_price.new,
            total: prices.total_price.new,
            quantity: state.quantity,
            isSaved: state.saveCreditStatus
        }
        if(token) {
            const res = await axios.post('user/auth/setShippingDetails', {
                token,
                data: {payment_details},
                selProducts
            })

            if(res) {
                loadUserInfo()
            }
        }
        history.push('/create')
    }

    const removeSelProduct = product_id => event => {
        if(selProducts.length > 1) {
            let rIndex = selProducts.findIndex(e => e.id === product_id)
            let quantity = 0

            selProducts.splice(rIndex, 1)

            selectProducts(selProducts)

            selProducts.map(product => {
                if(product.id === product_id) {
                    product.quantity = event.target.value ? parseInt(event.target.value) : 0
                    quantity += product.quantity
                    return product
                } else {
                    quantity += product.quantity
                }
            })
            checkDiscountCode(state.discount)
            setRQuantity(quantity)
            setState({
                ...state,
                quantity
            })
        } else {
            showToast('error', 'At least one product is required for check out.')
        }
    }

    const changeProductQuantity = product_id => event => {
        let quantity = 0
        selProducts.map(product => {
            if(product.id === product_id) {
                product.quantity = event.target.value && event.target.value !== '' ? parseInt(event.target.value) : 0
                quantity += product.quantity
                return product
            } else {
                quantity += product.quantity
            }
        })
        checkDiscountCode(state.discount)
        setState({
            ...state,
            quantity
        })
        setRQuantity(quantity)
        selectProducts(selProducts)
    }

    const handleSelect = name => e => {
        const { saveCreditStatus } = state
        
        setState({
            ...state,
            [name] : !saveCreditStatus
        })
    }

    const handleChangePType = name => () => {
        const { credit, paypal } = paymentType

        if(!credit && !paypal) {
            setPaymentType({
                ...paymentType,
                [name]: true
            })
        } else if(name === 'credit') {
            setPaymentType({
                credit: true,
                paypal: false
            })
        } else if(name === 'paypal') {
            setPaymentType({
                credit: false,
                paypal: true
            })
        }
    }

    const redirectStripe = () => {
        window.open('https://stripe.com/')
    }

    const paypalPaymentPart = () => {
        return (
            <PaypalExpressBtn 
                env='production' 
                client={{
                    sandbox: process.env.REACT_APP_PAYPAL_SANDBOX_KEY,
                    production: process.env.REACT_APP_PAYPAL_PRODUCTION_KEY
                }}
                currency="USD"
                total={Number(prices.total_price.new)}
                onSuccess={(payment) => {
                    handleChangePType('paypal')
                    if(!authExist) {
                        registerUserInfo1(payment, 'paypal')
                    } else {
                        registerUserInfo2(payment, 'paypal')
                    }
                    showToast('success', 'Your payment has been successfully processed. Welcome to your profile, everything you need to set up your account is here!')
                }}
                onCancal={(data) => {
                    handleChangePType('paypal')
                    showToast('error', '')
                }}
                onError = {(err) => {
                    handleChangePType('paypal')
                    showToast('error', '')
                }}
                style={{
                    size: 'responsive',
                    color: 'white',
                    shape: 'rect',
                    height: window.innerWidth <= 991 ? 40 : 50,
                    label: ''
                }}
            />
        )
    }

    return (
        <form onSubmit={handleSubmit} className="step-form step3">

            <Breadcumb currentStep={2} />

            <div className="step-top-part">
                <h2>Confirm and pay.</h2>
                <div className="common-subtitle-size">
                    Finalize your payment method and receive your tap product in 3-10 business days.
                </div>
            </div>

            <Collapse 
                className="collapse-container"
                defaultActiveKey={['1', '2']}
                expandIconPosition="right"
                expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>} >
                <Panel header="Order Details" key="1" className="order-details-container">

                    {
                        selProducts && selProducts.map((value, index) => {
                            return (
                                <div className="product-item" key={index}>
                                    <div className="product-first-item">
                                        <div className="name">
                                            <Tag className="product-item-name">{value.name}</Tag>
                                            <div className="availabe-logos">
                                                {
                                                    value.logoIcon && (
                                                        <Tag className="product-item-name">Logo</Tag>
                                                    )
                                                }
                                                {
                                                    value.designIcon && (
                                                        <Tag className="product-item-name">Design</Tag>
                                                    )
                                                }
                                            </div> x 
                                            <Input 
                                                className="quantity-price-input" 
                                                value={value.quantity} 
                                                onChange={changeProductQuantity(value.id)}
                                            />
                                        </div>
                                        <div className="price">
                                            
                                            {
                                                value.quantity < 10 && `${parseFloat((value.price * value.quantity) / 100).toFixed(2)}`
                                            }
                                            {
                                                (value.quantity >= 10 && value.quantity < 30) && 
                                                    `${parseFloat((value.price * (value.quantity - value.quantity * 0.1)) / 100).toFixed(2)}`
                                            }
                                            {
                                                value.quantity > 30 && 
                                                    `${parseFloat((value.price * (value.quantity - value.quantity * 0.25)) / 100).toFixed(2)}`
                                            }
                                        </div>
                                    </div>
                                    <div className="product-second-item">
                                        <div className="remove-btn" onClick={removeSelProduct(value.id)}>remove</div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {
                        prices.ship_price.origin !== prices.ship_price.new && (
                            <div className="sub-calc-old-price-part">
                                <div className="name" />
                                <div className="value">${prices.ship_price.origin}</div>
                            </div>
                        )
                    }
                    
                    <div className="sub-calc-part">
                        <div className="name">Shipping</div>
                        <div className="value">
                            ${prices.ship_price.new}
                        </div>
                    </div>
                    
                    <div className="sub-calc-part">
                        <div className="name">Subtotal</div>
                        <div className="value">
                            ${parseFloat(prices.subtotal_price.new).toFixed(2)}
                        </div>
                    </div>

                    {
                        prices && prices.tax_rate && (
                            <div className="sub-calc-part">
                                <div className="name">
                                    {`Tax - ${prices.tax_rate.name} @ ${prices.tax_rate.value}%`}
                                </div>
                                <div className="value">
                                    ${
                                        parseFloat((prices.tax_rate.value / 100) * (parseFloat(prices.subtotal_price.new) + parseFloat(prices.ship_price.new))).toFixed(2)
                                    }
                                </div>
                            </div>
                        )
                    }

                    {
                        state.discountName && (
                            <>
                                <div className="sub-calc-old-price-part">
                                    <div className="name" />
                                    <div className="value"></div>
                                </div>
                                <div className="sub-calc-part">
                                    <div className="name">Discount</div>
                                    <div className="value">
                                        {prices.discount_price > 0 ? `-$${prices.discount_price}` : 0 }
                                    </div>
                                </div>
                                <div className="discount-name">
                                    {state.discountName}
                                </div>
                            </>
                        )
                    }

                    <div className="form-inputs input-discount" name="discount_code">
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
                        {discountMsg.errorDMsg && (
                            <div className="error-msg">
                                {
                                    discountMsg.errorDNMsg ? discountMsg.errorDNMsg : 'This code does not exist or has expired. Try another one'
                                }
                            </div>
                        )}
                        {discountMsg.successDMsg && <div className="success-msg">Code successfully applied</div>}
                    </div>

                    <Divider />

                </Panel>

                <div className="total-calc-container">
                    {
                        (prices.total_price.origin !== prices.total_price.new) && (
                            <div className="sub-calc-old-price-part">
                                <div className="name" />
                                <div className="value">
                                    ${ prices.total_price.origin }
                                </div>
                            </div>
                        )
                    }

                    <div className="total-calc-part">
                        <div className="name">Total</div>
                        <div className="value">
                            <label>${ prices.total_price.new }</label>
                        </div>
                    </div>
                </div>

                {
                    discountMsg.successDMsg && (
                        <div className="expire-timer">
                            {
                                timerComponents.length ? 
                                    <div>Discount expires in &nbsp;<span>{timerComponents}</span></div> : 
                                    <span>Time's up!</span>
                            }
                        </div>
                    )
                }
                

                <Panel header="Payment Details" key="2" className="payment-details-container">

                    <Row gutter={window.innerWidth <= 991 ? 0 : 16} className="payment-badge-parts">
                        <Col className="payment-badge-part" xs={24} sm={12}>
                            {paymentType.credit ? (
                                    <Badge 
                                        className="payment-badge-item active"
                                        count={<CheckOutlined className="payment-badge-icon" />}
                                    >
                                        <Button className="payment-badge-item-btn-active" onClick={handleChangePType('credit')}>Pay with Credit Card</Button>
                                    </Badge>
                                ) : (
                                    <Button className="payment-badge-item-btn" onClick={handleChangePType('credit')}>Pay with Credit Card</Button>
                                )
                            }
                        </Col>
                        <Col className="payment-badge-part" xs={24} sm={12}>
                            {paymentType.paypal ? (
                                    <Badge 
                                        className="payment-badge-item active"
                                        count={<CheckOutlined className="payment-badge-icon" />}
                                    >
                                        <div onClick={handleChangePType('paypal')}>
                                            { paypalPaymentPart() }
                                            {/* <Button className="paypal-btn" onClick={handleChangePType('paypal')}></Button> */}
                                        </div>
                                    </Badge>
                                ) : (
                                    // <Button className="payment-badge-item-btn" onClick={handleChangePType('paypal')}>
                                    //     Pay with
                                    //     <img className="img-paypal" src={PaypalImg} />
                                    // </Button>

                                    <div className="payment-badge-item" onClick={handleChangePType('paypal')}>
                                        { paypalPaymentPart() }
                                        {/* <Button className="paypal-btn" onClick={handleChangePType('paypal')}></Button> */}
                                    </div>
                                )
                            }
                        </Col>
                    </Row>

                    {
                        paymentType.credit && (
                            <div className="form-inputs" name="card_num">
                                <CardElement className="card-num-input" options={{hidePostalCode: true}} />
                            </div>
                        )
                    }

                    {
                        paymentType.credit && (
                            <div className="form-inputs">
                                <div className="save-credit-part">
                                    <Checkbox 
                                        className="checkbox-save-credit" 
                                        onChange={handleSelect('saveCreditStatus')}
                                        checked={state.saveCreditStatus}
                                    >
                                    </Checkbox>
                                    <span className="label-checkbox-credit" onClick={handleSelect('saveCreditStatus')}>Save my credit card on file for future orders. Secured by </span>
                                    <span className="open-stripe-link" onClick={redirectStripe}>Stripe</span>
                                </div>
                            </div>
                        )
                    }

                </Panel>
            </Collapse>

            <div className="form-inputs btn-group step3">
                <Button size="large" className="prev-button" onClick={movePrevStep} disabled={state.saveStatus === 1 ? true : false }>
                    BACK
                </Button>

                <Button size="large" className="next-button" htmlType="submit" disabled={!stripe}>
                    {state.saveStatus === 0 && 'ORDER'}
					{state.saveStatus === 1 && (
						<>
							<i className="fa fa-spinner fa-spin fa-3x fa-fw" />
							Loading...
						</>
					)}
					{state.saveStatus === 2 && (
						<>
							<i className="fa fa-check" aria-hidden="true" />
							ORDER
						</>
					)}
                    
                </Button>
            </div>

            <div className="step-bottom-part step3">
                <div className="lock-icon-div">
                    <box-icon type='solid' name='lock-alt' className="lock-icon"></box-icon>
                </div>
                <div className="desc">
                    Your information is securely stored. See our {' '}
                    <a>privacy policy</a>
                </div>
            </div>
        </form>
    )
}

export default Step3