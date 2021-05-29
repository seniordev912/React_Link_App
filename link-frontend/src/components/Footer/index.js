import React, { useState } from 'react'
import { Typography, Row, Modal, Input, Form, Rate } from 'antd'
import { useStoreon } from 'storeon/react'
import iziToast from 'izitoast'
import Heart from './heart.svg'
import { createFeedback } from '../../constants/airtable'
import './index.scss'
import 'izitoast/dist/css/iziToast.min.css'

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})

const { Text } = Typography

function Footer() {
	const { authUser } = useStoreon('authUser')
	return (
		<main className="main">
			<DrawFooter user={authUser} />
		</main>
	)
}

function DrawFooter({ user }) {
	const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']
	const [form] = Form.useForm()
	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	// func to send feedback
	const sendFeedback = async values => {
		try {
			await createFeedback(values)
			setLoading(false)
			setVisible(false)
			form.resetFields()
			iziToast.success({
				title: 'Success',
				message: 'Feedback sent'
			})
		} catch (err) {
			setLoading(false)
			iziToast.error({
				title: 'Error',
				message: 'Something unexpected happen'
			})
		}
	}

	const handleVisible = () => {
		setVisible(!visible)
	}

	const handleSubmit = values => {
		setLoading(true)
		sendFeedback({ ...values, ...user })
	}

	return (
		<>
			{!user ? (
				<Row justify="center">
					<Text className="footer">
						Made with <img alt="heart icon" className="heart" src={Heart} /> by Linkup{' '}
						<a href="/" target="_blank">
							Create yours today!
						</a>
					</Text>
				</Row>
			) : (
				<div>
					<Row justify="center">
						<Text className="footer" style={{ textAlign: 'center' }}>
							<a onClick={handleVisible}>Write a Review</a>
							<br />
							<br />
							Made with <img alt="heart icon" className="heart" src={Heart} /> by Linkup
						</Text>
					</Row>
					<Modal
						title="Write a Review"
						visible={visible}
						onOk={form.submit}
						okButtonProps={{
							loading,
							htmlType: 'submit'
						}}
						onCancel={handleVisible}
					>
						<Form layout="vertical" form={form} onFinish={handleSubmit}>
							<Form.Item name="message" label="Message" rules={[{ required: true }]}>
								<Input.TextArea
									autoComplete="off"
									style={{
										height: '100px'
									}}
								/>
							</Form.Item>
							<Form.Item name="emoji" label="Feedback" rules={[{ required: true }]}>
								<Rate tooltips={desc} />
							</Form.Item>
						</Form>
					</Modal>
				</div>
			)}
		</>
	)
}

export default Footer
