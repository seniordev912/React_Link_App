import React from 'react'
import {
    ArrowRightOutlined,
    CheckOutlined
} from '@ant-design/icons'
import { PulseSpinner } from 'react-spinners-kit'
import './index.scss'

const totalSteps = [
    'Product',
    'Shipping',
    'Payment'
]

const Breadcumb = ({currentStep}) => {

    return (
        <div className="breadcumb-container">
            {
                totalSteps.map((item, index) => {
                    return (
                        <div className={`step-item step-${index}`} key={index}>
                            {
                                index === currentStep && (
                                    <div className="step-item-el-icon bgcolor-mid-soft-blue">
                                        <PulseSpinner size={10} />
                                    </div>
                                )
                            }
                            {
                                index < currentStep && (
                                    <CheckOutlined className="step-item-icon bgcolor-dark-green" />
                                )
                            }
                            {
                                index > currentStep && (
                                    <ArrowRightOutlined className="step-item-icon bgcolor-mid-grey" />
                                )
                            }
                            <div className={`step-item-label common-text-small-size text-weight-500 ${ index <= currentStep ? `color-black` : `color-soft-black` }`}>
                                {item}
                            </div>
                            {
                                index < totalSteps.length - 1 && (
                                    <div className="border-slash-part color-soft-black">/</div>
                                )
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Breadcumb