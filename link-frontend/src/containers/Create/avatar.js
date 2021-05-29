import React, { useState, useEffect } from 'react'
import './index.scss'
import { Avatar, Modal, Upload, message, Typography, Switch } from 'antd'
import { UploadOutlined, CameraTwoTone } from '@ant-design/icons'
import axios from '../../constants/axios'

const { Text } = Typography

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result)
		reader.onerror = error => reject(error)
	})
}

// const images = [
// 	{
// 		uid: '-1',
// 		name: 'image.png',
// 		status: 'done',
// 		url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
// 	},
// 	{
// 		uid: '-2',
// 		name: 'image.png',
// 		status: 'done',
// 		url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
// 	}
// ]

const AvatarUpload = ({ user, cardId, changeImageUpdate, type, handleClickTheme }) => {
	const [state, setState] = useState({
		laoding: false,
		avatarClass: '',
		open: false,
		fileList: user.card.imageUrl.map((value, i) => ({
			uid: -1 * (i + 1),
			name: value.split('/')[2],
			status: 'done',
			url: value
		})),
		image: user.card.imageUrl[0] || null,
		progess: 0,
		isShapeRectangle: user.card.isRectangle !== undefined ? user.card.isRectangle : false
	})

	/*-----useEffect(() => {
		let index = 0
		let count = 0
		if (type !== 'create') {
			const timer = setInterval(() => {
				if (state.fileList && state.fileList.length > 1) {
					if (index === state.fileList.length - 1) {
						index = 0
						count++
						handlePreview(state.fileList[0])
					} else {
						index++
						count++
						handlePreview(state.fileList[1])
					}
				} else {
					clearInterval(timer)
				}
				if (count === 2) {
					clearInterval(timer)
				}
			}, 3000)
		}
	}, [handlePreview, state.fileList, type])-----*/

	useEffect(() => {
		;(async () => {
			if (state.fileList && state.fileList.length >= 1) {
				const url = await handleUrl(state.fileList[0])
				if (url !== state.image) {
					setState({
						...state,
						image: url
					})
				}
			}
		})()
	}, [state, state.fileList])

	// const handlePreview = async file => {
	// 	if (!file.url && !file.preview) {
	// 		file.preview = await getBase64(file.originFileObj)
	// 	}
	// 	setState({
	// 		...state,
	// 		image: file.url || file.preview,
	// 		avatarClass: 'changingImage'
	// 	})
	// }

	const handleUrl = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj)
		}
		return file.url || file.preview
	}

	useEffect(() => {
		const imageTimer = setTimeout(() => {
			if (!state.open) {
				setState({
					...state,
					avatarClass: ''
				})
			}
		}, 500)
		if (imageTimer) {
			clearTimeout(imageTimer)
		}
	}, [state.image])

	const handleChange = async ({ fileList: newList }) => {
		if (newList.length > 0 && newList.length <= 2) {
			setState({
				...state,
				fileList: newList
			})
		} else if (newList.length === 0) {
			message.warn('Need to have at least 1 avatar')
		} else {
			message.warn('Max of 2 avatars')
		}
	}

	const handleImageRemove = async file => {
		const reqData = {
			fileName: file.url
		}
		if (state.fileList.length > 1) {
			await axios.delete(`user/cards/${cardId}/image-upload`, {
				data: reqData
			})
		}
	}

	const handleCustomRequest = async ({ onSuccess, onError, file, onProgress }) => {
		if (state.fileList && state.fileList.length < 2) {
			const fmData = new FormData()
			fmData.append('image', file)
			try {
				await axios.post(`user/cards/${cardId}/image-upload`, fmData)
				onSuccess('Ok')
			} catch (err) {
				onError({ err })
			}
		}
	}

	const handleOpen = () => {
		setState({
			...state,
			open: !state.open
		})
	}

	const handleImageShape = () => {
		changeImageUpdate(!state.isShapeRectangle)
		setState({
			...state,
			isShapeRectangle: !state.isShapeRectangle
		})
	}

	const { avatarClass, image, open, fileList, isShapeRectangle } = state

	return (
		<div className="avatar-container" >
			<Avatar
				className={`avatar--effect ${avatarClass}`}
				size={100}
				src={image}
				// onClick={handleOpen}
				style={isShapeRectangle ? { borderRadius: '8px' } : { borderRadius: '50%' }}
				onClick={handleClickTheme}
			>
				{!state.image && <CameraTwoTone style={{ color: '#000', fontSize: 32 }} />}
			</Avatar>
			<Modal
				title="Upload Images"
				visible={open}
				onOk={handleOpen}
				onCancel={handleOpen}
				closable
				footer={false}
			>
				<Text>
					You can upload up to two images. Images will loop every 3 seconds when you launch
					your card!
				</Text>
				<div
					style={{
						marginTop: '18px',
						marginBottom: '10px',
						fontWeight: '500'
					}}
				>
					<Text>Shape</Text>
				</div>
				<Switch
					checkedChildren="Square"
					unCheckedChildren="Circle"
					defaultChecked={isShapeRectangle}
					onChange={handleImageShape}
					style={{
						marginBottom: '30px'
					}}
				/>

				<Upload
					onChange={handleChange}
					fileList={fileList}
					listType="picture-card"
					className="avatar-uploader"
					customRequest={handleCustomRequest}
					onRemove={handleImageRemove}
					beforeUpload={async file => {
						const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
						if (!isJpgOrPng) {
							message.error('You can only upload JPG/PNG file!')
						}
						const isLt2M = file.size / 1024 / 1024 < 2
						if (!isLt2M) {
							message.error('Image must smaller than 2MB!')
						}
						return isJpgOrPng && isLt2M
					}}
				>
					<p className="ant-upload-drag-icon">
						<UploadOutlined />
					</p>
					<p className="ant-upload-text">Click or drag file to this area to upload</p>
					<p className="ant-upload-hint">
						Support for a single or bulk upload. Strictly prohibit from uploading company
						data or other band files
					</p>
				</Upload>
			</Modal>
		</div>
	)
}

export default AvatarUpload
