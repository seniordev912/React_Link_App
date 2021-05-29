import React, { useState } from "react";

import {
    Row,
    Col,
    Radio,
    Button
} from "antd"

import { 
    ItalicOutlined,
    SettingOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';

import { useStoreon } from 'storeon/react'

import ColorPicker from "./colorPicker"
import { 
    BlockDirection,
    Update
} from './components';

import "./board.scss"
import "./textBoard.scss"

const TextBoard = (props) => {
    const { handleClickUpdate } = props;
    const { dispatch, authUser: user } = useStoreon('authUser')
    const [visible, setVisible] = useState(false)
    const [color, setColor] = useState("#000000");

    const handleClick = () => {
        setVisible(!visible);
    }
    
    const handleBackgroundColor = ({rgb}) => {
		const { text } = user.card
		if (text) {
			text.color = `rgba(${Object.values(rgb).join(', ')})`
			dispatch('card/change', { text })
		}
    }
    return (
        <div className="text-board">
            <BlockDirection/>
            <Row className="text-title board-padding-top">
                <Col span={22} className="text-title-head">
                    <ItalicOutlined className="icon"/>
                    <div className="Btn-1 text"> Text </div>
                </Col>
                <Col span={2}>
                    <Button className="setting-button">
                        <SettingOutlined className="setting-icon"/>
                    </Button>
                </Col>
            </Row>
            <Row className="text-size board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Size </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Radio.Group size="small" defaultValue="h1" buttonStyle="solid">
                        <div className="text-size-button-group">
                            <Radio.Button value="h1" className="text-radio-button">H1</Radio.Button>
                            <Radio.Button value="h2" className="text-radio-button">H2</Radio.Button>
                            <Radio.Button value="h3" className="text-radio-button">H3</Radio.Button>
                            <Radio.Button value="body" className="text-radio-button">Body</Radio.Button>
                        </div>
                    </Radio.Group>
                </Col>
            </Row>
            <Row className="text-style board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Style </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Radio.Group size="small" defaultValue="regular" buttonStyle="solid">
                        <div className="text-style-button-group">
                            <Radio.Button value="regular" className="text-radio-button text-style-button-regular">Regular</Radio.Button>
                            <Radio.Button value="italic" className="text-radio-button text-style-button-italic">Italic</Radio.Button>
                            <Radio.Button value="underline" className="text-radio-button text-style-button-underline">Underline</Radio.Button>
                            <Radio.Button value="bold" className="text-radio-button text-style-button-bold">Bold</Radio.Button>
                        </div>
                    </Radio.Group>
                </Col>
            </Row>
            <Row className="text-color board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Color </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <ColorPicker visible={visible} color={user.card.text ? user.card.text.color : '#000'} handleClick={handleClick} handleColor={handleBackgroundColor}/>
                </Col>
            </Row>
            <Row className="text-editor board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Text </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <div className="Small-Text text-editor-description">
                        Use <span>markdown</span> syntax for rich text formatting
                    </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <div className="text-editor-content">
                        <div className="Small-Text text-editor-description">
                            Start typing here…
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="board-padding-top">
                <hr className="board-horizon-line"/>
            </Row>
            <Row className="text-position board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Position </div>
                </Col>
                <Col span={24}>
                    <Button className="text-position-button board-margin-top" size="small">
                        <ArrowUpOutlined />
                    </Button>
                    <Button className="text-position-button board-margin-top" size="small">
                        <ArrowDownOutlined />
                    </Button>
                </Col>
            </Row>
            <Update/>
        </div>
    )
}

export default TextBoard;