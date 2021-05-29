import React from 'react'
import { 
    Row,
    Table
} from 'antd'
import '../index.scss'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'
import SettingsLayout from '../Component/SettingsLayout'
import { message } from 'antd';

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})

function Billing(props, user) {
    const getEarningAmount = () => {
        let amount = 0
        props.user.monthData && props.user.monthData.forEach(val => {
            amount += Object.values(val)[0] * 4
        })
        return amount
    }

    const copyLink = () => {
		document.execCommand('copy')
		message.success('Code copied to clipboard')
    }
    
    message.config({
		top: 30,
		duration: 1,
		maxCount: 1,
		rtl: true
	})

	return (
        <SettingsLayout selectedIndex = {"2"} {...props}>
            <div>
                <Row>
                    <h3>It pays to share!</h3>                    
                </Row>
                <Row>
                    <div className={"Body-1"}>
                        Give your friends 20% off, and earn 25% in credits when they order a tap product. Your referral code is{' '}
                        <span onDoubleClick={() => copyLink()} className="highlighter">
                            {props.user.code.code ? `${props.user.code.code}` : 'UNDEFINED'}
                        </span>{' '}
                    </div>
                </Row>
                <Row>
                    <div className={"credit-container"}>
                        <Row>
                            <h3>Credits</h3>
                        </Row>
                        <Row>
                            <div className={"credit-earning"}>
                                $ { getEarningAmount() }{'.00'}
                            </div>
                        </Row>
                    </div>
                    
                </Row>
                <Row>
                    <Table
                        className="pay-share-table"
                        columns={[
                            {
                                title: 'First name',
                                dataIndex: 'firstName'
                            },
                            {
                                title: 'Last name',
                                dataIndex: 'lastName'
                            },
                            {
                                title: 'Email',
                                dataIndex: 'email'
                            },
                            {
                                title: 'Date',
                                dataIndex: 'paymentDate'
                            },
                            {
                                title: 'Amount',
                                dataIndex: 'paymentAmount',
                                sorter: (a, b) => a.paymentAmount - b.paymentAmount,
                            }
                        ]}
                        dataSource={props.user.usedByOthers}
                        size="middle"
                    />
                </Row>
                <Row>
                    <h3>What are credits?</h3>                    
                </Row>
                <Row>
                    <div className={"Body-1"}>
                        You will only receive credit when the person you invite signs up and buys a tap product. You can use this credit to buy more tap products or receive a cash deposit to your bank account.
                    </div>
                </Row>
            </div>
        </SettingsLayout>   
	)
}

export default Billing
