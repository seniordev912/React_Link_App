import React, { useState } from 'react'
import { Card, Input } from 'antd'
import QRCode from 'qrcode.react'
import Logo from '../../../assets/icons/linkup_icon.png'
import CardNFCImg from '../../../assets/images/nfc-icon.svg'
import './index.scss'

const LUCard = (props) => {

	const [displayName, setDisplayName] = useState('Your name here')
	const [editStatus, setOUserEdit] = useState(false)

	const editCardName = () => {
		setOUserEdit(!editStatus)
	}

	const changeDisplayName = event => {
		setDisplayName(event.target.value)
		props.changeDisplayName(event.target.value)
	}

	return (
		<Card className="lu-card">
			<div className="top-part">
				<img src={Logo} className="linkupIcon" alt="linkup logo" />
				<img src={CardNFCImg} className="linkupNFCImage" alt="linkup nfc" />
			</div>

			<div className="bottom-part">
				<div className="linkupBLeftName">
					{
						editStatus ? (
							<Input 
								className="edit-username" 
								onChange={changeDisplayName}
								value={
									props.user.displayName ? 
									`${props.user.displayName}` : displayName
								}
							/>
						) : (
							<div className="view-username">
								{
									props.user.displayName ? 
									`${props.user.displayName}` : displayName
								}
							</div>
						)
					}

					<div className="btn-circle-edit" onClick={editCardName}></div>
					
				</div>

				<QRCode
					className="linkupQRCode"
					value={`${window.location.host}/${props.user.username}`}
				/>
			</div>
		</Card>
	)
}

export default LUCard
