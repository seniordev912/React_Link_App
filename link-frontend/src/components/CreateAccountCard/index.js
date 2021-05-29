import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Card } from 'antd'

import './index.scss'


function CreateAccountCard({ props }) {
	return (
		<Row className="create-account-part">
			<Col xs={24} sm={24} md={24} span={24} className="sm-top">
				<Card bordered={false} className="card">
					<Row justify="space-around" align="middle">
						<Col xs={24} sm={24} md={12} span={18}>
							<h3 className="sub color-blk" gutterbottom="true">
								Create your LinkUp account today
							</h3>
							<h4 className="color-blk" gutterbottom="true">
								Add your links in one place and seemlessly share it with your
								audience.
							</h4>
						</Col>
						<Col xs={24} sm={24} md={8} span={8} className="button-container">
							<Link to="/order-tap-product-no-auth">
								<Button className="get-started">
									GET STARTED
								</Button>
							</Link>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	)
}

export default CreateAccountCard
