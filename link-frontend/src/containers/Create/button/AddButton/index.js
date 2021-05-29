import React, { useState, useRef } from 'react'
import { 
	// Popover, 
	message, 
	Col 
} from 'antd'
import { useMediaQuery } from '@material-ui/core'
import { useDropzone } from 'react-dropzone'
// import { MoreOutlined } from '@ant-design/icons'
import { useStoreon } from 'storeon/react'
// import PopContent from '../PopContent'
import image from './dummyImage'
import './style.scss'

const initialState = {
	id: '-1',
	title: 'Give me a title and hit enter',
	titleColor: '#000',
	bgColor: '#fff',
	photoUrl: image,
	animation: 'none',
	url: '',
	protocol: 'https://'
}

const AddButton = ({ unset = false, status, ...props }) => {
	// const [open, setOpen] = useState(false)
	// const [drop, setDrop] = useState(false)
	const [state, setState] = useState(initialState)
	const { dispatch, button, buttons } = useStoreon('button', 'buttons')
	// const isMobile = useMediaQuery('(max-width: 480px)')
	const titleRef = useRef(null)
	const onDrop = ([file], [error]) => {
		if (typeof file !== 'undefined') {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = e => {
				setState({
					...state,
					photoUrl: e.target.result
				})
			}
		} else if (error.errors[0].message) {
			message.error(error.errors[0].message)
		} else {
			message.error('Max file size is 2mb')
		}
	}
	// const { getRootProps, getInputProps, isDragActive } = useDropzone({
	// 	multiple: false,
	// 	onDrop,
	// 	accept: ['image/jpeg', 'image/png'],
	// 	maxSize: 2000000
	// })
	// useEffect(() => {
	// 	if (button) {
	// 		if (button.id === initialState.id) {
	// 			if (button !== state) {
	// 				dispatch('button/set', state)
	// 			}
	// 		}
	// 	}
	// }, [state])
	// useEffect(() => {
	// 	if (drop || open) {
	// 		const index = buttons.findIndex(item => item.id === state.id)
	// 		if (index === -1) {
	// 			dispatch('button/set', state)
	// 		}
	// 	}
	// }, [drop, open])
	// useEffect(() => {
	// 	if (button) {
	// 		if (button.id === initialState.id) {
	// 			setState(button)
	// 		}
	// 	}
	// }, [button])
	return (
		<div
			className="ant-row add-button-card"
			{...props}
			style={{
				...props.style,
				backgroundColor: 'transparent',
				border:
					typeof state !== 'undefined' && buttons.length > 0 && initialState
						? state.bgColor === initialState.bgColor
							? `2px dashed ${buttons[buttons.length - 1].bgColor}`
							: 'none'
						: `2px dashed #00000065`,
				opacity: status ? 0 : 1
				// transition: 'all 0.2s linear'
			}}
		>
			<Col
				span={24}
				style={{
					height: '100%',
					flex: 'initial',
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'center',
					width: '100%'
				}}
			>
				<span
					contentEditable
					suppressContentEditableWarning
					ref={titleRef}
					onKeyDown={e => {
						if (e.keyCode === 13) {
							e.preventDefault()
							if (e.target.innerText !== initialState.title) {
								dispatch('button/set', null)
								dispatch('buttons/add', {
									title: e.target.innerText
								})
								setState({ ...initialState })
								titleRef.current.innerText = initialState.title
								titleRef.current.blur()
							}
							return false
						}
						if (e.target.innerText === initialState.title) {
							titleRef.current.innerText = ''
							return false
						}
						if (
							e.target.innerText.length >= 50 &&
							((e.which >= 65 && e.which <= 90) ||
								(e.which >= 48 && e.which <= 57) ||
								e.which === 32)
						) {
							if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
								const selected = window.getSelection()
								if (selected.type !== 'Range') {
									e.preventDefault()
								}
							}
						}
					}}
					onBlur={e => {
						// const patt = /[a-z][0-9]?\s?/gi
						const teste = e.target.innerText.trim()
						const title = teste || initialState.title
						titleRef.current.innerText = title
						setState({
							...state,
							title
						})
					}}
					spellCheck={false}
					style={{
						cursor: 'text',
						maxWidth: '80%',
						lineHeight: '1.2',
						textAlign: 'center',
						wordBreak: 'keep-all',
						color:
							titleRef &&
							titleRef.current &&
							titleRef.current.innerText === initialState.title
								? '#818181'
								: state.titleColor,
						// maxHeight: '100%',
						border: 'none',
						outline: 'none',
						transition: 'all 0.2s linear'
					}}
				>
					{state.title}
				</span>
			</Col>
			{/* <Col span={4}>
					<Popover
						content={<PopContent state={state} />}
						trigger="click"
						visible={open}
						onVisibleChange={visible => setOpen(visible)}
					>
						<MoreOutlined onClick={() => setOpen(!open)} />
					</Popover>
				</Col> */}
		</div>
	)
}

export default AddButton
