import React, { useState, useEffect } from "react";
import { SketchPicker } from 'react-color'
import {
    Row,
    Col, 
    Input
} from 'antd';
import "./colorPicker.scss";
import classes from './color.module.scss'

function componentToHex(c) {
	if(typeof c === undefined) {
		return "00";
	}
	var hex = Number(c).toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

function rgbaToHex(r, g, b, a) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a) ;
}

function rgba2rgba_hex(orig) {
    const rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
    const alpha = (rgb && rgb[4] || "").trim();
    var alpha_return =  "";
    if(alpha === "") {
        alpha_return = "100";
    } else {
        alpha_return = (Math.round(Number(alpha) * 255)).toString();
    }
    const hex = rgbaToHex(rgb[1], rgb[2], rgb[3], alpha_return);
    var rgbaHex = [];
    rgbaHex.push(rgb[1]);
    rgbaHex.push(rgb[2]);
    rgbaHex.push(rgb[3]);
    rgbaHex.push(alpha_return);
    rgbaHex.push(hex);
    return rgbaHex;
}

const ColorPicker = (props) => {
    const { handleClick, handleColor, visible, color } = props;
    const [hexColor, setHexColor] = useState("");
    const [rgbaColor, setRgbaColor] = useState({
        r: "",
        g: "",
        b: "",
        a: ""
    });
    useEffect(() => {
        const rgba_array = rgba2rgba_hex(color);
        var alpha = ""
        if(rgba_array[3] === "") {

        }
        setRgbaColor({
            ...rgbaColor,
            r: rgba_array[0],
            g: rgba_array[1],
            b: rgba_array[2],
            a: rgba_array[3],
        });
        setHexColor(rgba_array[4])
    }, [color]);

    return (
        <Row>
            <Col span={4}>
                <div className="pallet" onClick={handleClick} style={{backgroundColor: color}}></div>
                {
                    visible && 
                    <div className={classes.popover}>
                        <div className={classes.cover} onClick={handleClick} />
                        <SketchPicker color={color} onChange={handleColor} />
                    </div>
                }
            </Col>
            <Col span={8}>
                <Col span={24}>
                    Hex
                </Col>
                <Col span={20} className="input-group">
                    <Input value={hexColor} className="input" size="small"/>
                </Col>
            </Col>
            <Col span={12}>
                <Col span={24}>
                    RGBA
                </Col>
                <Col span={24} className="input-group">
                    <Row>
                        <Col span={6}>
                            <Col span={20}>
                                <Input value={rgbaColor.r} className="input" size="small"/>
                            </Col>
                        </Col>
                        <Col span={6}>
                            <Col span={20}>
                                <Input value={rgbaColor.g} className="input" size="small"/>
                            </Col>
                        </Col>
                        <Col span={6}>
                            <Col span={20}>
                                <Input value={rgbaColor.b} className="input" size="small"/>
                            </Col>
                        </Col>
                        <Col span={6}>
                            <Col span={20}>
                                <Input value={rgbaColor.a} className="input" size="small"/>
                            </Col>
                        </Col>
                    </Row>
                </Col>
            </Col>
        </Row>
    )
}

export default ColorPicker;