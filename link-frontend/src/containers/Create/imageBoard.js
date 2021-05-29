import React from "react"

import {
    Row,
    Col,
    Button,
    Radio
} from "antd"

import { 
    CameraFilled,
    SettingOutlined,
    UploadOutlined,
} from '@ant-design/icons';

import { 
    BlockDirection,
    Update
} from './components';

import "./board.scss"
import "./imageBoard.scss"

const ImageBoard = () => {
    return (
        <div className="image-board">
            <BlockDirection/>
            <Row className="image-title board-padding-top">
                <Col span={22} className="image-title-head">
                    <CameraFilled className="icon"/>
                    <div className="Btn-1 text"> Image </div>
                </Col>
                <Col span={2}>
                    <Button className="setting-button">
                        <SettingOutlined className="setting-icon"/>
                    </Button>
                </Col>
            </Row>
            <Row className="image-size board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Size </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Radio.Group size="small" defaultValue="h1" buttonStyle="solid">
                        <div className="image-size-button-group">
                            <Radio.Button value="h1" className="image-radio-button">Square</Radio.Button>
                            <Radio.Button value="h2" className="image-radio-button">Circle</Radio.Button>
                        </div>
                    </Radio.Group>
                </Col>
            </Row>
            <Row className="image-border board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Border </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Radio.Group size="small" defaultValue="none" buttonStyle="solid">
                        <div className="image-border-button-group">
                            <Radio.Button value="none" className="image-radio-button">None</Radio.Button>
                            <Radio.Button value="line" className="image-radio-button">Line</Radio.Button>
                            <Radio.Button value="dash" className="image-radio-button">Dash</Radio.Button>
                        </div>
                    </Radio.Group>
                </Col>
            </Row>
            <Row className="image-image board-padding-top">
                <Col span={24}>
                    <div className="Caption-1 text"> Image </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <div className="Small-Text text-editor-description">
                        Upload up to two images. If more than one image is uploaded, the image will alternate every 5s
                    </div>
                </Col>
                <Col span={24} className="board-margin-top">
                    <Button type="dashed" className="uploadButton" icon={<UploadOutlined className="uploadIcon"/>} size={"medium"}>
                        Upload
                    </Button>
                </Col>
            </Row>
            <Row className="board-padding-top">
                <hr className="board-horizon-line"/>
            </Row>
            <Update/>
        </div>
    )
}

export default ImageBoard