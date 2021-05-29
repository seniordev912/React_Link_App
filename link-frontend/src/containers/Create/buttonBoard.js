import React, { useState, useEffect } from "react";

import {
    Row,
    Col,
    Button,
    Input,
    Radio,
    Select
} from 'antd';

import {
    SettingOutlined,
    LinkOutlined,
    UploadOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';

import { useStoreon } from 'storeon/react';
import ColorPicker from "./colorPicker";

import { 
    BlockDirection,
    Update
} from './components';

import './buttonBoard.scss';
import './board.scss';

const { Option } = Select;

const ButtonBoard = () => {
    const { dispatch, authUser: user } = useStoreon('authUser')
    const [visible, setVisible] = useState(false);
    const [tvisible, setTvisible] = useState(false)
    const [bvisible, setBvisible] = useState(false)

    const [initialBackground] = useState(user.card.bgColor)
    const [initialColor] = useState(user.card.text ? user.card.text.color : '#fff')

    const handleClick = () => {
        setVisible(!visible);
    }

    const handleTClick = () => {
        setTvisible(!tvisible)
    }

    const handleBClick = () => {
        setBvisible(!tvisible)
    }

    const handleBackgroundColor = ({rgb}) => {
        dispatch('card/change', {
			bgColor: `rgba(${Object.values(rgb).join(', ')})`
		})
    }

    const handleTextColor = ({ rgb }) => {
		const { text } = user.card
		if (text) {
			text.color = `rgba(${Object.values(rgb).join(', ')})`
			dispatch('card/change', { text })
		}
    }

    const handleAnimationStyle = (value) => {
        console.log(value);
    }

    useEffect(() => {
		if (!visible) {
			if (initialBackground !== user.card.bgColor) {
				dispatch('card/update', { bgColor: user.card.bgColor, noCompare: true })
			}
		}
    }, [dispatch, initialBackground, user.card.bgColor, visible])

    useEffect(() => {
		const uColor = user.card.text ? user.card.text.color : '#000'
		if (!visible && user.card.text && initialColor !== uColor) {
			const { text } = user.card
			text.color = uColor
			dispatch('card/update', { text, noCompare: true })
		}
	}, [dispatch, initialColor, visible, user])

    return (
        <div className="button-board">
            <BlockDirection/>
            <Row className="button-title board-padding-top">
                <Col span={22} className="button-title-head">
                    <LinkOutlined className="icon"/>
                    <div className="Btn-1 text"> Button </div>
                </Col>
                <Col span={2}>
                    <Button className="setting-button">
                        <SettingOutlined className="setting-icon"/>
                    </Button>
                </Col>
            </Row>
            <Row className="button-style board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Style </div>
                </Col>
            </Row>
            <Row className="button-link board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Link </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Input className="input" placeholder="Add a link" size="medium"/>
                </Col>
            </Row>
            <Row className="button-background-color board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Background color </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <ColorPicker visible={visible} color={user.card.bgColor} handleClick={handleClick} handleColor={handleBackgroundColor}/>
                </Col>
            </Row>
            <Row className="button-text board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Text </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Input className="input" placeholder="Add the text you want to display" size="medium"/>
                </Col>
            </Row>
            <Row className="button-text-style board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Style </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Radio.Group size="small" defaultValue="regular" buttonStyle="solid">
                        <div className="button-text-style-button-group">
                            <Radio.Button value="regular" className="button-radio-button button-style-button-regular">Regular</Radio.Button>
                            <Radio.Button value="italic" className="button-radio-button button-style-button-italic">Italic</Radio.Button>
                            <Radio.Button value="underline" className="button-radio-button button-style-button-underline">Underline</Radio.Button>
                            <Radio.Button value="bold" className="button-radio-button button-style-button-bold">Bold</Radio.Button>
                        </div>
                    </Radio.Group>
                </Col>
            </Row>
            <Row className="button-background-color board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Text color </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <ColorPicker visible={tvisible} color={user.card.text ? user.card.text.color : '#000'} handleClick={handleTClick} handleColor={handleTextColor}/>
                </Col>
            </Row>  
            <Row className="button-border-radius board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Border radius </div>
                </Col>
            </Row>
            <Row className="button-border-style board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Border style</div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Radio.Group size="small" defaultValue="none" buttonStyle="solid">
                        <div className="button-border-color-group">
                            <Radio.Button value="none" className="button-radio-button">None</Radio.Button>
                            <Radio.Button value="line" className="button-radio-button">Line</Radio.Button>
                            <Radio.Button value="dash" className="button-radio-button">Dash</Radio.Button>
                        </div>
                    </Radio.Group>
                </Col>
            </Row>
            <Row className="button-background-color board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Border style </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <ColorPicker visible={bvisible} color={user.card.text ? user.card.text.color : '#000'} handleClick={handleBClick} handleColor={handleTextColor}/>
                </Col>
            </Row>  
            <Row className="button-image board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Upload image </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <div className="Small-Text button-image-description">
                        Upload an image in png, jpg, or jpeg format
                    </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Button type="dashed" className="uploadButton" icon={<UploadOutlined className="uploadIcon"/>} size={"medium"}>
                        Upload
                    </Button>
                </Col>
            </Row>
            <Row className="board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Text style </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Select defaultValue="none" style={{ width: "100%" }} onChange={handleAnimationStyle}>
                        <Option value="none">None</Option>
                        <Option value="shake">Shake</Option>
                        <Option value="bounce">Bounce</Option>
                        <Option value="fadeUp">Fade Up</Option>
                        <Option value="fade Down">Fade Down</Option>
                        <Option value="flip">Flip</Option>
                        <Option value="jello">Jello</Option>
                        <Option value="pulse">Pulse</Option>
                        <Option value="flash">Flash</Option>
                        <Option value="swing">Swing</Option>
                        <Option value="tada">Tada</Option>
                    </Select>
                </Col>
            </Row>
            <Row className="button-position board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Position </div>
                </Col>
                <Col span={24}>
                    <Button className="button-position-button board-margin-top" size="small">
                        <ArrowUpOutlined />
                    </Button>
                    <Button className="button-position-button board-margin-top" size="small">
                        <ArrowDownOutlined />
                    </Button>
                </Col>
            </Row>
            <Update/>
        </div>
    )
}

export default ButtonBoard