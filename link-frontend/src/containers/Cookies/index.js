import React from 'react'
import { Row, Col } from 'antd'
import { Typography } from '@material-ui/core'
import Navigation from '../../components/Navigation'
import FooterApp from '../../components/FooterApp'
import './index.css'

function Cookies() {
	return (
		<div>
			<Navigation />
			<div className="container">
				<Row>
					<Col xs={24} sm={24} md={24} span={24}>
						<Typography variant="h6" gutterBottom>
							Cookie Policy
						</Typography>
						<Typography variant="body2" gutter Bottom>
							Some text here
						</Typography>
					</Col>
				</Row>
				<FooterApp />
			</div>
		</div>
	)
}

export default Cookies
