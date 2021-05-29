import styled from 'styled-components'
import Button from 'antd/lib/button'

export const SignSocialButton = styled(Button)`
	background-color: #fff !important;
	color: #808080 !important;
	width: 100%;
	border-color: #c0c0c0;
	border-style: solid;
	border-width: 1px;
	height: 40px;
	margin-top: 30px;
	&:hover {
		opacity: 0.9;
	}
`

export const SignButton = styled(Button)`
	background-color: #3aa3ae !important;
	color: #fff !important;
	width: 100%;
	border: none;
	margin-top: 30px;
	height: 40px;
	&:hover {
		opacity: 0.9;
	}
`
