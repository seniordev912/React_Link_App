import React, { useState, useEffect } from 'react'
import {
    Button,
    Row,
    Col,
    Radio,
    Card,
} from 'antd'
import axios from '../../../../constants/axios'
import SaveImage from '../../../../assets/images/save-20.png'
import ServiceCard from '../ServiceCard'
import 'boxicons'
import { PaymentModal } from '../../components'
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
        props.history.push('/signup?plan=pro')
    }

    const handleClosePModal = () => {
        setShowPModal(false)
    }

    const handleSavePlan = () => {
        props.history.push('/signup')
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

                                    <ServiceCard 
                                        data={item} 
                                        serviceType={state.serviceType} 
                                        saveMoney={saveMoney} 
                                        handleSavePlan={handleSavePlan}
                                        handleShowPaymentModal={handleShowPaymentModal}
                                    />
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