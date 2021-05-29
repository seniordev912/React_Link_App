import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Badge
} from 'antd'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Loading from '../../components/Loading'
import iziToast from 'izitoast'
import 'boxicons'
import MetaTags from 'react-meta-tags'
import Navigation from '../../components/Navigation'
import AuthNavigation from '../../components/AuthNavigation'
import WelcomeModal from '../../components/WelcomeModal'
import { PaymentModal } from '../Pricing/components'
import Step1 from './Step1'
import Step2 from './Step2'
import OStep2 from './OStep2'
import Step3 from './Step3'
import axios from '../../constants/axios'
import './index.scss'
import 'izitoast/dist/css/iziToast.min.css'
import SocialMetaImg from '../../assets/images/meta-social.png'

iziToast.settings({
	position: 'bottomLeft',
    maxWidth: '400px'
})

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

const Payment = props => {

    const [step, setStep] = useState(0)
    const [state, setState] = useState({
        product: {},
        shipValues: null,
        selProducts: [],
        selShipValue: {},
        userDetailsInfo: {},
        visibleWModal: false,
        plan: false
    })
    const [showPModal, setShowPModal] = useState(true)

    const [firstCall, setFirstCall] = useState({
        count: 0,
        date: null
    })

    const [step1Info, setStep1Info] = useState({
        pCategory: 'Card',
        checkedProducts: [],
        displayName: ''
    })
    const [step2Info, setStep2Info] = useState({
        username: '',
		lastname: '', 
		firstname: '',
        email: '',
        password: '',

        street_num: '',
        unit_num: '',
        city: '',
        province: '',
        zipcode: '',
        country: '',
        shipCountry: ''
    })
    const [ostep2Info, setOStep2Info] = useState({
        street_num: '',
        unit_num: '',
        city: '',
        province: '',
        zipcode: '',
        country: '',
        shipCountry: ''
    })
    const [step3Info, setStep3Info] = useState({
        quantity: 0,
		discount: null,
    })

    const [ loadingProducts, setLoadingProducts ] = useState(false)

    const [rquantity, setRQuantity] = useState(0)

    useEffect(() => {
		const newScript = document.createElement('script')
		newScript.type = 'text/javascript'
		newScript.async = true
		newScript.innerHTML =
			"!function(d,s,c){s=d.createElement('script');s.src='https://widget.indemand.ly/launcher.js';s.onload=function(){indemandly=new Indemandly({domain:'david-phan'})};c=d.getElementsByTagName('script')[0];c.parentNode.insertBefore(s,c)}(document)"
		document.head.appendChild(newScript)

		return () => {
			document.head.removeChild(newScript)
        }

    }, [])

    useEffect(() => {
        const getProductList = async() => {
            setLoadingProducts(true)
            const productList = await axios.get('user/getProductList')
            const shipResult = await axios.get('user/payment')

            if(productList && shipResult && shipResult.data.ship) {
                setState({
                    ...state,
                    productCategories: productList.data,
                    shipValues: shipResult.data.ship
                })
                setLoadingProducts(false)
            } else {
                setLoadingProducts(false)
                showToast('error', 'There is no data to display. Please check your network status')
            }
        }
        getProductList()

        if(firstCall.count + 1 === 1) {
            let year = new Date().getFullYear()
            let month = new Date().getMonth()
            let date = new Date().getDate() + 7
            let hours = new Date().getHours()
            let mins = new Date().getMinutes()
            let seconds = new Date().getSeconds()

            setFirstCall({
                count: firstCall.count + 1,
                date: new Date(year, month, date, hours, mins, seconds)
            })
        } else {
            setFirstCall({
                ...firstCall,
                count: firstCall.count + 1
            })
        }

        if(props.user && props.user.firstSignUp) {
            setState({
                ...state,
                visibleWModal: true
            })
        }
        if(props.user && props.user.plan === 'pro') {
            setState({
                ...state,
                plan: true
            })
        }
    }, [])

    const selectProducts = products => {
        if(products && products.length > 0) {
            if(step === 0) {
                setStep(1)
            }
            
            setState({
                ...state,
                selProducts: products
            })
        } else {
            iziToast.warning({
                title: 'Warning',
                message: 'Please select one or more products'
            })
        }
    }

    const selectUserDetails = userInfo => {
        if(userInfo) {
            let cName = userInfo.country
            if(cName !== 'CA' && cName !== 'US') {
                cName = 'WW'
            }
            setStep(2)
            setState({
                ...state,
                userDetailsInfo: userInfo,
                selShipValue: state.shipValues[cName]
            })
        }
    }

    const showToast = (type, content) => {
        if(type === 'success') {
            iziToast.success({
                title: 'Success',
                message: content
            })
        } else if(type === 'error') {
            iziToast.error({
                title: 'Error',
                message: content
            })
        }
    }

    const movePrevStep = () => {
        setStep(step - 1)
    }

    const rightCartPart = () => {
        return (
            <div className="right-center-cart-part">
                <Badge count={rquantity} showZero="true" offset={[-50, 0]}>
                    <div className="main-part">
                        <box-icon color="white" className="cart-img" type='solid' name='cart'></box-icon>
                    </div>
                </Badge>
            </div>
        )
    }
    
    const handleCloseWelcomeModal = () => {
        props.user.firstSignUp = false
        setState({
            ...state,
            visibleWModal: false
        })
    }

    const handleClosePModal = () => {
        setShowPModal(false)
    }

    return (
        <div>
            <div className="rest-left-part bgcolor-payment-leftpart">
                <div></div>
            </div>
            <div className="container payment-content-container">
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
                
                {
                    props.user && props.user ? (
                        <AuthNavigation user={props.user} />
                    ) : (
                        <Navigation status={step} />
                    )
                }

                <Row className="steps-container">
                {
                    (step === 0 || step === 1 || step === 2) && (
                        <Col className="steps-container-left-part" lg={9} xs={24}>
                            <div className="description">
                                <h4 className="text-weight-bold">
                                    How do I use this?
                                </h4>
                                <div className="desc-text common-text-size color-payment-leftpart-text">
                                    LinkUp is made easy to share wherever your audience is including offline with any of our tap products! Everywhere you are online and offline can now be in one place  to share anything with one tap or scan.
                                </div>
                            </div>
                        </Col>
                    )
                }

                {
                    step === 0 && (
                        <Col className="steps-container-right-part" lg={10} xs={24}>
                            <div className="steps-form">
                                {
                                    loadingProducts ? (
                                        <Loading className="blank-loading-icon" />
                                    ) : (
                                        <Step1 
                                            categoryList={state.productCategories} 
                                            selectProducts={selectProducts}
                                            setStepsInfo={setStep1Info}
                                            showToast={showToast}
                                            user={props.user}
                                            setRQuantity={setRQuantity}
                                            stepInfo={step1Info}
                                            setLoadingProducts={setLoadingProducts}
                                            selProducts={state.selProducts} 
                                        />
                                    )
                                }
                            </div>

                            { rightCartPart() }
                        </Col>
                    )
                }

                {
                    step === 1 && (
                        <Col className="steps-container-right-part" lg={10} xs={24}>
                            <div className="steps-form">
                                {
                                    props.user && props.user ? (
                                        <OStep2 
                                            selectUserDetails={selectUserDetails} 
                                            movePrevStep={movePrevStep} 
                                            setStepsInfo={setOStep2Info}
                                            showToast={showToast}
                                            authExist={props.user ? true : false}
                                            stepInfo={ostep2Info} />
                                    ) : (
                                        <Step2 
                                            selectUserDetails={selectUserDetails} 
                                            movePrevStep={movePrevStep} 
                                            setStepsInfo={setStep2Info}
                                            showToast={showToast}
                                            authExist={props.user ? true : false}
                                            stepInfo={step2Info} />
                                    )
                                }
                            </div>

                            { rightCartPart() }
                        </Col>
                    )
                }

                {
                    step === 2 && (
                        <Col className="steps-container-right-part" lg={10} xs={24}>
                            <div className="steps-form">
                                <Elements stripe={stripePromise}>
                                    <Step3 
                                        selProducts={state.selProducts} 
                                        selShipValue={state.selShipValue} 
                                        billingInfos={state.userDetailsInfo} 
                                        movePrevStep={movePrevStep} 
                                        setStepsInfo={setStep3Info}
                                        productInfo={step1Info}
                                        userInfo={props.user ? ostep2Info : step2Info}
                                        user={props.user}
                                        showToast={showToast}
                                        authExist={props.user ? true : false}
                                        firstCall={firstCall}
                                        loadUserInfo={props.loadUserInfo}
                                        setRQuantity={setRQuantity}
                                        selectProducts={selectProducts}
                                        stepInfo={step3Info} />
                                </Elements>
                            </div>

                            { rightCartPart() }
                        </Col>
                    )
                }
            </Row>
            </div>

            <WelcomeModal visibleModal={state.visibleWModal} closeModal={handleCloseWelcomeModal} />

            {
                props.user && props.user.plan && (
                    <PaymentModal 
                        {...props}
                        open={showPModal} 
                        hidePModal={handleClosePModal}
                        showToast={showToast}
                    />
                )
            }
        </div>
        
    )
}

export default Payment