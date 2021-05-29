import React from 'react'

import {
    Row
} from 'antd'

import {
    ArrowLeftOutlined
} from '@ant-design/icons'

import './index.scss'

const BlockDirection = () => {
    return (
        <Row className="left-direction">
            <ArrowLeftOutlined className="icon"/>
            <div className="Caption-1 text"> Blocks </div>
        </Row>
    )
}

export default BlockDirection