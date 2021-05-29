import React from 'react'
import { Row, Col } from 'antd'
import BusinessInsider from '../../assets/images/companies/business-insider.png'
import Buzzfeed from '../../assets/images/companies/buzzfeed.png'
import Yahoo from '../../assets/images/companies/yahoo.png'
import Techcrunch from '../../assets/images/companies/techcrunch.png'

import './index.scss'

const Companies = () => {
    return (
        <div className={"companies"}>
            <div className={"companies-container"}>
                <div>
                    <h4 className={"companies-title"}>
                        THE #1 MOST POWERFUL SHARING PLATFORM FOR BUSINESS
                    </h4>
                </div>
                <div>
                    <Row align={"center"}>
                        <Col className="companies-icon-container" xl={4} lg={4} md={6} sm={8} xs={12}>
                            <img src={Yahoo} className="companies-icon" alt="inc icon" />
                        </Col>
                        <Col className="companies-icon-container" xl={4} lg={4} md={6} sm={8} xs={12}>
                            <img src={Techcrunch} className="companies-icon" alt="techcrunch icon" />
                        </Col>
                        <Col className="companies-icon-container" xl={4} lg={4} md={6} sm={8} xs={12}>
                            <img src={BusinessInsider} className="companies-icon" alt="businessInsider icon" />
                        </Col>
                        <Col className="companies-icon-container" xl={4} lg={4} md={5} sm={8} xs={12}>
                            <img src={Buzzfeed} className="companies-icon" alt="buzzfeed icon" />
                        </Col>
                    </Row>
                </div>                
            </div>
        </div>
    )
}

export default Companies