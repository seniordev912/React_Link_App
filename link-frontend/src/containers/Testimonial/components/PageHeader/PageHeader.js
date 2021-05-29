import React from 'react'
import { Row, Col } from 'antd'

import './index.scss'

const PageHeader = (props) => {
    const { title, content } = props
    return (
        <div className={"title"}>
            <Row>
                <Col span={24}>
                    <h1 className={"contact-us-card-title"}>
                        {title}
                    </h1>
                </Col>
                <Col span={24}>
                    <h3 className={"contact-us-card-title"}>
                        {content}
                    </h3>
                </Col>
            </Row>
        </div>
    )
}

export default PageHeader