import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Card, Empty } from 'antd'
import './index.css'

function EmptyComponent({ isClicks = false }) {
	return (
		<Row gutter={[48, 32]}>
			<Col xs={24} span={24} className="sm-top">
				<Card className="card-border" style={{ height: '300px', textAlign: 'center' }}>
					<Empty
						className="empty-v-middle"
						image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
						imageStyle={{ height: 60 }}
						description={
							<span>
								{!isClicks ? (
									<>
										Create and share your <Link to="/create">card</Link> to start analyzing
										impressions
									</>
								) : (
									`You don’t have any views yet. Share your card to start analyzing impressions instantly.`
								)}
								{/* Create and share your <Link to="/create">card</Link> to start
								analyzing impressions */}
							</span>
						}
					/>
				</Card>
			</Col>
		</Row>
	)
}

export default EmptyComponent
