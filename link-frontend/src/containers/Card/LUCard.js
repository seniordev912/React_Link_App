import React from 'react'
import { Card } from 'antd'
import QRCode from 'qrcode.react'
import Logo from '../../assets/icons/linkup_icon.png'
import CardNFCImg from '../../assets/images/nfc-icon.svg'
import './LUCard.scss'

const LUCard = props => {
	return (
		<Card className="lu-card">
			<div className="top-part">
				<img src={Logo} className="linkupIcon" alt="linkup logo" />
				<img src={CardNFCImg} className="linkupNFCImage" alt="linkup nfc" />
			</div>

			<div className="bottom-part">
				<span className="linkupBLeftName">
					{props.user.fullname ? props.user.fullname : `${props.user.firstName} ${props.user.lastName}`}
				</span>
				<QRCode
					className="linkupQRCode"
					value={`${window.location.host}/${props.user.username}`}
				/>
			</div>
		</Card>
	)
}

export default LUCard
