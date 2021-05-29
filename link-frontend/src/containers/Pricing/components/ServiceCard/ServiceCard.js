import React, { useState, useEffect } from 'react'
import {
    Button,
    Card,
} from 'antd'
import 'boxicons'
import './index.scss'

const ServiceCard = props => {

    const { data, serviceType, saveMoney, handleSavePlan, handleShowPaymentModal } = props

    return (
        <Card 
            className="plan-card" 
            style={{backgroundColor: data.bgcolor}}
        >
            <div className={`title text-center common-text-size color-${data.color}`}>
                {data.title}
            </div>
            <div className={`description text-center common-text-size color-${data.color}`}>
                {data.description}
            </div>

            <div className="service-list">
                {
                    data.details.map((dItem, dIndex) => {
                        return (
                            <div className="service-item" key={dIndex}>
                                <box-icon class="checkbox" type='solid' name='check-circle' ></box-icon>
                                <span className={`color-${data.color}`}>{dItem}</span>
                            </div>
                        )
                    })
                }
                {
                    data.title === 'PRO' && (
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
                {data.title === 'Starter' && (
                    <div onClick={() => handleSavePlan('Starter')}>Free Forever</div>
                )}
                {data.title === 'PRO' && saveMoney && serviceType === 'Monthly' && (
                    <div onClick={() => handleShowPaymentModal(data.title, 'Monthly')}>
                        Get {data.title} @ ${saveMoney['Monthly']} / month
                    </div>
                )}
                {data.title === 'PRO' && saveMoney && serviceType === 'Yearly' && (
                    <div onClick={() => handleShowPaymentModal(data.title, 'Yearly')}>
                        Get {data.title} @ ${saveMoney['Yearly']} / year
                    </div>
                )}
            </Button>

            <div className="saving-money text-center">
                {
                    data.title === 'PRO' && saveMoney && serviceType === 'Monthly' && (
                        `You could be saving $${Math.ceil(saveMoney['Monthly'] * 12 * 0.2)} on the annual plan!`
                    )
                }
                {
                    data.title === 'PRO' && saveMoney && serviceType === 'Yearly' && (
                        `You're saving $${Math.ceil(saveMoney['Monthly'] * 12 * 0.2)}! 👏`
                    )
                }
            </div>
            
        </Card>
    )
}

export default ServiceCard