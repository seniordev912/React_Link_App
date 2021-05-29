import React, { useState, useEffect } from 'react';
import ColorPicker from "./colorPicker";
import { 
         AlignLeftOutlined,
         UploadOutlined
} from '@ant-design/icons';

import { useStoreon } from 'storeon/react'
import {
    Row,
    Col,
    Select, 
    Input,
    Button,
    Avatar
} from 'antd';

import { 
    BlockDirection,
    Update
} from './components';

import "./board.scss";
import './themeBoard.scss';
const { Option } = Select;
const { TextArea } = Input;

const ThemeBoard = (props) => {
    const { collapsed, handleClickUpdate } = props;
    const { dispatch, authUser: user } = useStoreon('authUser')
    const [visible, setVisible] = useState(false)
    const [tvisible, setTvisible] = useState(false)
    
    const [initialBackground] = useState(user.card.bgColor)
    const [initialColor] = useState(user.card.text ? user.card.text.color : '#fff')
    const [textStyle, setTextStyle] = useState("1");

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
    
    const handleTextStyle = (value) => {
        console.log(value);
        setTextStyle(value);
    }

    const handleClick = () => {
        setVisible(!visible)
    }

    const handleTClick = () => {
        setTvisible(!tvisible)
    }

    useEffect(() => {
        const header = user.card.text.blocks.filter((item) => item.type === "header")[0];
        
        setTextStyle(user.card.text && user.card.text.blocks && user.card.text.blocks.length !== 0 ? `${header.data.level}` : "1");
    }, [user.card.text])

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
        <div className="theme-board">
            <BlockDirection/>
            <Row className="theme-title board-padding-top">
                <AlignLeftOutlined className="icon"/>
                <div className="Btn-1 text"> Theme </div>
            </Row>
            <Row className="theme-background-color board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Background color </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <ColorPicker visible={visible} color={user.card.bgColor} handleClick={handleClick} handleColor={handleBackgroundColor}/>
                </Col>
            </Row>
            <Row className="theme-background-color board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Text color </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <ColorPicker visible={tvisible} color={user.card.text ? user.card.text.color : '#000'} handleClick={handleTClick} handleColor={handleTextColor}/>
                </Col>
            </Row>  
            <Row className="board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Text style </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Select value={textStyle} style={{ width: "100%" }} onChange={handleTextStyle}>
                        <Option value="1">H1</Option>
                        <Option value="2">H2</Option>
                        <Option value="3">H3</Option>
                        <Option value="4">H4</Option>
                        <Option value="5">H5</Option>
                        <Option value="6">H6</Option>
                    </Select>
                </Col>
            </Row>
            <Row className="board-padding-top">
                <hr className="board-horizon-line"/>
            </Row>
            <Row className="board-padding-top">
                <div className="Body-1 text"> Metadata </div>
            </Row>
            <Row className="board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Title </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Input className="input" placeholder="Add a title" size="medium"/>
                </Col>
            </Row>
            <Row className="board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Description </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    {/* <Input className="input" placeholder="Add a title" size="medium"/> */}
                    <TextArea rows={4} placeholder="Add a description"/>
                </Col>
            </Row>
            <Row className="board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Image </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Button type="dashed" className="uploadButton" icon={<UploadOutlined className="uploadIcon"/>} size={"medium"}>
                        Upload
                    </Button>
                </Col>
            </Row>
            <Row className="board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Preview </div>
                </Col>
                <Col span={24} className="theme-preview board-margin-top">
                    <Row>
                        <Col span={24}>
                            <a href="https://linkupcard.com/alielshayeb" target="_blank">
                                https://linkupcard.com/alielshayeb
                            </a>
                        </Col>
                        <Col span={24} className="board-margin-top">
                            <div className="Body-1 text">
                                Ali El-Shayeb, social creator
                            </div>
                        </Col>
                        <Col span={24}  className="board-margin-top">
                            <Row>
                                <Col span={8}>
                                    <Avatar className="theme-preview-avatar" shape="square" size={70} src="https://link124.s3.us-east-2.amazonaws.com/1589485297419-Group%202.png" />
                                </Col>
                                <Col span={16}>   
                                    <div className="Small-Text" style={{width: "100%", display: collapsed ? "none" : "block"}}>
                                        Lorem upsum text. ipsum lorento li otion tiyu buyo liong lorem iupmsum  
                                        Lorem upsum text. ipsum lorento li otion tiyu buyo liong lorem iupmsum  
                                        Lorem upsum text. ipsum lorento li otion tiyu buyo liong lorem iupmsum  
                                        Lorem upsum text. ipsum lorento li otion tiyu buyo liong lorem iupmsum      
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Update/>
        </div>
    )
}

export default ThemeBoard;