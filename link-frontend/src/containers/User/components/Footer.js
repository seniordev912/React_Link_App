import React from 'react'
import { Typography, Row } from 'antd'
import iziToast from 'izitoast'
import './index.scss'
import 'izitoast/dist/css/iziToast.min.css'

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})

const { Text } = Typography
function componentToHex(c) {
	if(typeof c === undefined) {
		return "00";
	}
	var hex = c.toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function invert(color) {
	if(color.indexOf('#') === 0) {
		color = color.slice(1);
		if(color.length === 3) {
			color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];;
		}
		if( color.length !== 6) {
			throw new Error('Invalid HEX color.');
		}

		var r = (255 - parseInt(color.slice(0, 2), 16)).toString(16);
		var g = (255 - parseInt(color.slice(2, 4), 16)).toString(16);
		var b = (255 - parseInt(color.slice(4, 6), 16)).toString(16);
		return '#' + padZero(r) + padZero(g) + padZero(b);
	}
	color = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
	for (var i = 0; i < color.length; i++)
		color[i] = (i === 3 ? 1 : 255) - color[i];
	return rgbToHex(color[0], color[1], color[2]);
}

function FooterUserName(props) {
	const {bgColor} = props;
	return (
		<main className="main">
			<Row justify="center">
				<Text style={{color: invert(bgColor)}}>
					Powered by{' '}
					<a style={{color: invert(bgColor), textDecoration: "underline"}} href="/" target="_blank">
						LinkUp
					</a>
				</Text>
			</Row>
		</main>
	)
}

export default FooterUserName
