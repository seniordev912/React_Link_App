import React from 'react'

import {
    Row,
    Col,
    Button
} from 'antd';

import {
    CheckCircleFilled
} from '@ant-design/icons';

import '../../board.scss';

const Update = () =>{
    return (
        <Row className="board-update">
            <Col span={24}>
                <Row>
                    <CheckCircleFilled style={{color: "#4a90e2"}}/>
                    <div className="Small-Text board-update-text">
                        Updates have been successfully saved.
                    </div>
                </Row>
            </Col>
            <Col span={24} className="board-margin-top">
                <Button type="primary" className="board-update-button" size="large">
                    Update
                </Button>
            </Col>
        </Row>
    )
}

export default Update;