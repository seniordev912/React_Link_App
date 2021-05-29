import React from 'react'

import { 
    BlockDirection,
    Update
} from './components';

import {
    Row,
    Col,
    Button,
    Select,
    Input
} from 'antd'

import {
    SettingOutlined,
    MessageFilled,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons'

import './board.scss';
import './socialBoard.scss';

const { Option } = Select

const SocialBoard = () => {
    const handleSocialIcon = (value) => {
        console.log(value);
    }
    return (
        <div className="social-board">
            <BlockDirection/>
            <Row className="social-title board-padding-top">
                <Col span={22} className="social-title-head">
                    <MessageFilled className="icon"/>
                    <div className="Btn-1 text"> Social icons </div>
                </Col>
                <Col span={2}>
                    <Button className="setting-button">
                        <SettingOutlined className="setting-icon"/>
                    </Button>
                </Col>
            </Row>
            <Row className="social-icon-link board-padding-top">
                <Col span={11} className="social-icon">
                    <Row>
                        <Col span={24}>
                            <div className="Caption-1 text"> Text style </div>
                            <div className="board-margin-top">
                                <Select defaultValue="icon" style={{ width: "100%" }} onChange={handleSocialIcon}>
                                    <Option value="icon">Icon</Option>
                                </Select>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={11} >
                    <Row className="social-link">
                        <Col span={24}>
                            <div className="Caption-1 text"> Link </div>
                            <div className="board-margin-top">
                                <Input className="input" placeholder="Add a link" size="medium"/>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={24} className="social-add-delete board-margin-top">
                    <a>
                        <div>
                            + add another
                        </div>
                    </a>
                    <DeleteOutlined className="social-delete"/>
                </Col>
            </Row>
            <Row className="board-padding-top">
                <hr className="board-horizon-line"/>
            </Row>
            <Row className="social-position board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Position </div>
                </Col>
                <Col span={24}>
                    <Button className="social-position-button board-margin-top" size="small">
                        <ArrowUpOutlined />
                    </Button>
                    <Button className="social-position-button board-margin-top" size="small">
                        <ArrowDownOutlined />
                    </Button>
                </Col>
            </Row>
            <Update/>
        </div>
    )
}

export default SocialBoard;