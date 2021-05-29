import React from 'react'
import { Row, Col, Card, Form, Input, InputNumber, Button } from 'antd'
import {
    CheckCircleFilled
} from '@ant-design/icons'
import axios from '../../../../constants/axios'
import './index.scss'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})

const ContactUsCard = () => {

    const onFinish = async values => {
        console.log(values)
        const result = await axios.post('user/sendContactInfo', values)
        if(result) {
            if(result.data.success) {
                iziToast.success({
                    message: result.data.message
                })
            } else {
                iziToast.error({
                    message: result.data.message
                })
            }
        } else {
            iziToast.error({
                message: 'Something went wrong on our side. Try again in a few minutes.'
            })
        }
    };
    
    const layout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };
        
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: 'Email is not valid!',
            number: '${label} is not a validate number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    return (
        <div className={"contact-us-card-container"}>
            <div className={"contact-us-card-body"}>
                <div className={"contact-us-card-text"}>
                    <Row>
                        <Col span={24}>
                            <h2 className={"contact-us-card-title"}>
                                Contact us
                            </h2>
                        </Col>
                        <Col span={24}>
                            <h3 className={"contact-us-card-title"}>
                                We'd love to show you how you can grow your business and share it with the world!
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <div className={"contact-us-card-content"}>
                                <CheckCircleFilled className={"contact-us-card-checkicon"}/>
                                <div className={"Body-1"}>
                                    Request custom tap bulk orders
                                </div>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className={"contact-us-card-content"}>
                                <CheckCircleFilled className={"contact-us-card-checkicon"}/>
                                <div className={"Body-1"}>
                                    Ask us how we can take your business to the next level
                                </div>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className={"contact-us-card-content"}>
                                <CheckCircleFilled className={"contact-us-card-checkicon"}/>
                                <div className={"Body-1"}>
                                    Book a demo to see the many ways our customers use LinkUp
                                </div>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className={"contact-us-card-content"}>
                                <CheckCircleFilled className={"contact-us-card-checkicon"}/>
                                <div className={"Body-1"}>
                                    Join our partner program and earn 20% recurring commission
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className={"contact-us-card-form-container"}>
                    <Card className={"contact-us-card-form"}>
                        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                            <Row>
                                <Col sm={{span: 12}} xs={{ span: 24 }}>
                                    <Form.Item name={['user', 'firstName']} label="First name" rules={[{ required: true }]}>
                                        <Input placeholder="Bill"/>
                                    </Form.Item>
                                </Col>
                                <Col sm={{span: 12}} xs={{ span: 24 }}>
                                    <Form.Item name={['user', 'lastName']} label="Last name" rules={[{ required: true }]}>
                                        <Input placeholder="Gates"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email', required: true }]}>
                                <Input placeholder="Ex. bill.gates@microsoft.com"/>
                            </Form.Item>
                            <Form.Item name={['user', 'phoneNumber']} label="Phone number" rules={[{ type: 'number', required: true}]}>
                                <InputNumber placeholder={"Ex. +1 647-999-888"}/>
                            </Form.Item>
                            <Form.Item name={['user', 'role']} label="Your role" rules={[{ required: true }]}>
                                <Input placeholder={"Ex. VP Sales"}/>
                            </Form.Item>
                            <Form.Item name={['user', 'company']} label="Company" rules={[{ required: true }]}>
                                <Input placeholder={"Ex. Microsoft"}/>
                            </Form.Item>
                            <Form.Item name={['user', 'introduction']} label="Introduction">
                                <Input.TextArea placeholder={"Ex. How do I purchase bulk tap products for the team?"}/>
                            </Form.Item>
                            <Form.Item wrapperCol={{ ...layout.wrapperCol}}>
                                <Button type="primary" htmlType="submit" className={"contact-us-card-submit-button"}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ContactUsCard