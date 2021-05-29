import React, { useState, useEffect } from 'react'
import {
    Button,
    Row,
    Col,
    Radio,
    Card,
    Tag,
} from 'antd'
import {
    CheckOutlined
} from '@ant-design/icons'
import SaveImage from '../../../../../assets/images/save-20.png'
import 'boxicons'
import axios from '../../../../../constants/axios'
import { PaymentModal } from '../'
import ServiceCard from '../../../../Pricing/components/ServiceCard'
import './index.scss'

const radioSItems = [
    'Monthly',
    'Yearly'
]

const cardItems = [
    {
        title: 'Starter',
        bgcolor: '#dfe7f6',
        color: 'grey-black',
        description: 'Everything you need to get started sharing unlimited links from one place',
        details: [
            'Unlimited links',
            'Newsletter email signup',
            'SMS link',
            'QR Code',
            'Level 1 analytics'
        ],
    }, {
        title: 'PRO',
        bgcolor: '#253858',
        color: 'white',
        description: 'For creators that want to unlock the power of customizing their profiles and collecting payments',
        details: [
            'Remove LinkUp logo',
            'Premium themes',
            'Collect payments',
            'Video intergations',
            'Level 2 analytics',
        ]
    }
]

const Services = props => {

    const [ state, setState ] = useState({
        serviceType: 'Yearly'
    })

    const [showPModal, setShowPModal] = useState(false)

    const [saveMoney, setSaveMoney] = useState(null)
    const [planProduct, setPlanProduct] = useState(null)

    useEffect(() => {
        const getPProducts = async() => {
            const pproducts = await axios.get('user/getPlanProducts')
            console.log(pproducts.data)
            setSaveMoney(pproducts.data.product.prices)
            setPlanProduct(pproducts.data.product)
        }
        getPProducts()
    }, [])

    const assignClassName = (index, isLast) => {
        let res = 'item '
        if(index === 0) {
            res += 'item-first '
        }
        if (isLast) {
            res += 'item-last '
        }
        return res
    }

    const handleShowPaymentModal = (title, type) => {
        setShowPModal(true)
    }

    const handleClosePModal = () => {
        setShowPModal(false)
    }

    const handleSavePlan = async name => {
        const { showToast } = props
        const token = localStorage.getItem('token')
        const result = await axios.post('user/auth/savePlanStatus', {
            token,
            planType: name
        })
        if(result) {
            props.loadUserInfo()
            showToast('success', 'Successfully downgraded to the Starter plan')
        } else {
            showToast('error', 'Something went wrong on our side. Please try again soon.')
        }
    }

    return (
        <div className="container">
            <div className="pricing-page-container">
                
                {
                    props.user.planType === 'PRO' && (
                        <>
                            <div className="page-subtitle common-subtitle-size color-black">
                                You're on the
                                <Tag className="title-tag common-subtitle-size color-white bgcolor-dark-blue border-radius-3">{props.user.planType}</Tag>
                                plan
                            </div>
                            <div className="subscript-manage-part">
                                <h4 className="s-title text-weight-bold">
                                    Subscription Management
                                </h4>
                                <div className="s-desc common-text-size">
                                    Manage subscription and billing details through your customer portal.
                                </div>
                                <Button className="s-button common-text-small-size bgcolor-dark-blue color-white border-radius-3">Manage my plan</Button>
                            </div>
                        </>
                    )
                }

                {
                    props.user.planType === 'Starter' && (
                        <div className="upgarde-to-pro-part text-center">
                            <div className="upgrade-title common-subtitle-size">
                                Upgrade to
                                <Tag className="title-tag common-subtitle-size color-white bgcolor-dark-blue border-radius-3">PRO</Tag>
                            </div>
                            <div className="upgrade-desc common-text-small-size color-grey-black">
                                Flexible payment plans for creators and influencers of all sizes
                            </div>
                        </div>
                    )
                }

                <div className="plan-switch-period-part margin-center">
                    <img className="save-image" src={SaveImage} alt="" />
                    <Radio.Group 
                        className="plan-switch-period element-center"
                        buttonStyle="solid"
                        defaultValue={state.serviceType}
                    >
                        {
                            radioSItems.map((item, index) => (
                                <Radio.Button 
                                    className={assignClassName(index, radioSItems.length - 1 === index)} 
                                    value={item}
                                    key={index}
                                    onChange={event => {
                                        console.log(event.target.value)
                                        setState({
                                            ...state,
                                            serviceType: event.target.value
                                        })
                                    }}
                                >
                                    {item}
                                </Radio.Button>
                            ))
                        }
                    </Radio.Group>
                </div>

                <Row className="plan-cards" gutter={16}>
                    {
                        cardItems.map((item, index) => {
                            return(
                                <Col className="plan-card-part" xs={24} sm={24} md={24} lg={12} key={index}>
                                    <div className="plan-card--part" style={item.title === props.user.planType ? {backgroundColor: '#8f98a8'} : {backgroundColor: 'transparent'}}>

                                        <ServiceCard 
                                            data={item} 
                                            serviceType={state.serviceType} 
                                            saveMoney={saveMoney} 
                                            handleSavePlan={handleSavePlan}
                                            handleShowPaymentModal={handleShowPaymentModal}
                                        />

                                        {/* <Card 
                                            className="plan-card" 
                                            style={{backgroundColor: item.bgcolor}}
                                        >
                                            <div className={`title text-center common-text-size color-${item.color}`}>
                                                {item.title}
                                            </div>
                                            <div className={`description text-center common-text-size color-${item.color}`}>
                                                {item.description}
                                            </div>

                                            <div className="service-list">
                                                {
                                                    item.details.map((dItem, dIndex) => {
                                                        return (
                                                            <div className="service-item" key={dIndex}>
                                                                <box-icon class="checkbox" type='solid' name='check-circle' ></box-icon>
                                                                <span className={`color-${item.color}`}>{dItem}</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    item.title === 'PRO' && (
                                                        <div className="service-item bgcolor-soft-yellow border-radius-3">
                                                            <box-icon class="checkbox" type='solid' name='check-circle' ></box-icon>
                                                            <span className="color-black">
                                                                {`Limited Time Only: Get a `}
                                                                <span className="text-underline">free</span>
                                                                {` LinkUp Card`}✨
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            </div>

                                            <Button className="decision-btn">
                                                {item.title === 'Starter' && (
                                                    <div onClick={() => handleSavePlan('Starter')}>Free Forever</div>
                                                )}
                                                {item.title === 'PRO' && saveMoney && state.serviceType === 'Monthly' && (
                                                    <div onClick={() => handleShowPaymentModal(item.title, 'Monthly')}>Get {item.title} @ ${saveMoney['Monthly']} / month</div>
                                                )}
                                                {item.title === 'PRO' && saveMoney && state.serviceType === 'Yearly' && (
                                                    <div onClick={() => handleShowPaymentModal(item.title, 'Yearly')}>Get {item.title} @ ${saveMoney['Yearly']} / year</div>
                                                )}
                                            </Button>

                                            <div className="saving-money text-center">
                                                {
                                                    item.title === 'PRO' && saveMoney && state.serviceType === 'Monthly' && (
                                                        `You could be saving $${Math.ceil(saveMoney['Monthly'] * 12 * 0.2)} on the annual plan!`
                                                    )
                                                }
                                                {
                                                    item.title === 'PRO' && saveMoney && state.serviceType === 'Yearly' && (
                                                        `You're saving $${Math.ceil(saveMoney['Monthly'] * 12 * 0.2)}! 👏`
                                                    )
                                                }
                                            </div>
                                            
                                        </Card> */}
                                        
                                        {
                                            item.title === props.user.planType && (
                                                <div className="selected-part">
                                                    <span className="color-white common-text-size">Current Plan</span>
                                                    <CheckOutlined className="check-img" />
                                                </div>
                                            )
                                        }
                                        
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>

            <PaymentModal {...props} open={showPModal} hidePModal={handleClosePModal} saveMoney={saveMoney} saveType={state.serviceType} planProduct={planProduct} />
        </div>
    )
}

export default Services