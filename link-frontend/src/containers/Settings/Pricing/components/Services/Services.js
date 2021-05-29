import React, { useState } from 'react'
import {
    Button,
    Row,
    Col,
    Radio,
    Card,
} from 'antd'
import SaveImage from '../../../../assets/images/save-20.png'
import 'boxicons'
import { PaymentModal } from '../../components'
import './index.scss'

const radioSItems = [
    'Monthly',
    'Annual'
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
        saveAMoney: null,
        saveMMoney: null
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
        ],
        saveAMoney: 67,
        saveMMoney: 7
    }
]

const Services = props => {

    const [ state, setState ] = useState({
        serviceType: 'Annual'
    })

    const [showPModal, setShowPModal] = useState(false)

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

    const handleShowPaymentModal = (title, money, type) => {
        console.log('------------->>>>>>>>', title, money, type)
        setShowPModal(true)
    }

    const handleClosePModal = () => {
        setShowPModal(false)
    }

    return (
        <div className="container">
            <div className="pricing-page-container">
                <div className="page-title page-title-size color-black text-center">
                    Choose the plan that's right for you
                </div>

                <div className="page-subtitle page-subtitle-size color-black text-center">
                    Flexible plans for creators and business owners of all sizes
                </div>

                <div className="plan-switch-period-part margin-center">
                    <img className="save-image" src={SaveImage} />
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
                                <Col className="plan-card-part" xs={24} sm={24} md={12} key={index}>
                                    <Card 
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
                                            {item.title === 'Starter' && 'Free Forever'}
                                            {item.saveMMoney && state.serviceType === 'Monthly' && (
                                                <div onClick={() => handleShowPaymentModal(item.title, item.saveMMoney, 'month')}>Get {item.title} @ ${item.saveMMoney} / month</div>
                                            )}
                                            {item.saveAMoney && state.serviceType === 'Annual' && (
                                                <div onClick={() => handleShowPaymentModal(item.title, item.saveAMoney, 'year')}>Get {item.title} @ ${item.saveAMoney} / year</div>
                                            )}
                                        </Button>

                                        <div className="saving-money text-center">
                                            {
                                                item.saveMMoney && state.serviceType === 'Monthly' && (
                                                    `You could be saving $${parseFloat(item.saveMMoney).toFixed(2)} on the annual plan! 👏`
                                                )
                                            }
                                            {
                                                item.saveAMoney && state.serviceType === 'Annual' && (
                                                    `You're saving $${parseFloat(item.saveAMoney).toFixed(2)}! 👏`
                                                )
                                            }
                                        </div>
                                        
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>

                <div className="contact-question element-center">
                    <h4 className="question">Too big to fit? 
                        <a className="link color-dark-green text-underline" href="/contact">Contact sales</a>
                    </h4>
                </div>
            </div>

            <PaymentModal open={showPModal} hidePModal={handleClosePModal} />
        </div>
    )
}

export default Services