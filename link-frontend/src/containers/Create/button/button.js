import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Avatar, Popover, Dropdown, message, Col } from 'antd'
import { useMediaQuery } from '@material-ui/core'
import { useDropzone } from 'react-dropzone'
import { MoreOutlined, CameraTwoTone } from '@ant-design/icons'
import { useStoreon } from 'storeon/react'
import axios from '../../../constants/axios'
import PopContent from './PopContent'
import takeAnimation from './animation'
import 'animate.css/animate.min.css'
// import { removeEquals } from '../../../utils'

const Button = ({ value: initial, defaultRef, ...props }) => {
	const [open, setOpen] = useState(false)
	const [drop, setDrop] = useState(false)
	const [state, setState] = useState(initial)
	const { dispatch, button } = useStoreon('button')
	const titleRef = useRef(null)
	const [animationClass, setAnimationClass] = useState('')
	const [first, setFirst] = useState(true)
	const animation = useMemo(() => takeAnimation(state.animation), [state.animation])
	// const [animation, setAnimation] = useState()
	const isMobile = useMediaQuery('(max-width: 480px)')
	const onDrop = async ([file], [error]) => {
		if (typeof file !== 'undefined') {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = e => {
				setState({
					...state,
					photoUrl: e.target.result
				})
			}

			const fmData = new FormData()

			fmData.append('image', file)

			try {
				await axios.post(
					`user/cards/${state.fromCard}/buttons/${state.id}/image-upload`,
					fmData
				)
			} catch (err) {
				new Error('Some error')
			}
		} else if (error.errors[0].message) {
			message.error(error.errors[0].message)
		} else {
			message.error('Max file size is 2mb')
		}
	}

	const { getRootProps, getInputProps } = useDropzone({
		multiple: false,
		onDrop,
		accept: ['image/jpeg', 'image/png'],
		maxSize: 2000000
	})
	useEffect(() => {
		if (button) {
			if (button.id === state.id) {
				titleRef.current.focus()
				titleRef.current.selectionStart = titleRef.current.selectionEnd = 1000
			}
		}
	}, [button, state.id])
	useEffect(() => {
		if (!first && state.animation) {
			setAnimationClass(animation)
		}
		if (first) {
			setFirst(false)
		}
		setTimeout(() => {
			setAnimationClass('')
		}, 1000)
	}, [animation, first, state.animation])

	useEffect(() => {
		if (button) {
			if (button.id === state.id && button !== state) {
				dispatch('buttons/update', button)
			}
		}
	}, [button, state])

	// useEffect(() => {
	// 	console.log("=============>>>>>", state)
	// 	if (button) {
	// 		if (button.id === state.id) {
	// 			if (button !== state) {
	// 				dispatch('button/set', state)
	// 			}
	// 		}
	// 	}
    // // eslint-disable-next-line
	// }, [state])
	

	// useEffect(() => {
	// 	if (drop || open) {
	// 		dispatch('button/set', state)
	// 	}
	// 	if (open === false && drop === false) {
	// 		if (state && button) {
	// 			if (state.id) {
	// 				if (state.id === button.id) {
	// 					dispatch('button/set', null)
	// 				}
	// 			}
	// 		}
	// 	}
	// }, [drop, open])
	useEffect(() => {
		if (button) {
			if (button.id === initial.id) {
				// dispatch('buttons/update', button)
				setState(button)
			}
		}
	}, [button, initial.id])
	return (
		<Dropdown
			visible={!open ? drop : false}
			onVisibleChange={visible => {
				if (!visible) {
					setDrop(false)
					dispatch('buttons/update', button)
					// if (button.id === state.id) {
					// 	const diff = removeEquals(button, state)
					// 	if (diff) {
					// 	}
					// dispatch(`button/set`, null)
					// }
				} else {
					dispatch('button/set', state)
					setDrop(visible)
				}
			}}
			overlay={button ? <PopContent state={state} isMenu /> : null}
			trigger={['contextMenu']}
		>
			<div
				className={`ant-row button-card ${animationClass}`}
				ref={defaultRef}
				{...props}
				style={{ ...props.style, backgroundColor: state.bgColor }}
			>
				<Col span={isMobile ? 6 : 4}>
					<div {...getRootProps()}>
						<Avatar shape="square" size={64} src={state.photoUrl || state.imageUrl}>
							{state.photoUrl ? (
								state.photoUrl
							) : state.imageUrl ? (
								state.imageUrl
							) : (
								<CameraTwoTone style={{ color: '#000', fontSize: 22 }} />
							)}
						</Avatar>
						<input {...getInputProps()} />
					</div>
				</Col>
				<Col span={isMobile ? 14 : 16}>
					<span
						contentEditable
						suppressContentEditableWarning
						ref={titleRef}
						onKeyDown={e => {
							if (e.keyCode === 13) {
								e.preventDefault()
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
							const title = teste || 'You have to add a title!'
							titleRef.current.innerText = title
							setState({
								...state,
								title
							})
							dispatch('buttons/update', { id: state.id, title })
						}}
						spellCheck={false}
						style={{
							cursor: 'text',
							maxWidth: '80%',
							lineHeight: 1.2,
							textAlign: 'center',
							wordBreak: 'keep-all',
							color: state.titleColor,
							border: 'none',
							outline: 'none',
							transition: 'all 0.2s linear'
						}}
					>
						{state.title ? state.title : 'You have to add a title!'}
					</span>
				</Col>
				<Col span={4}>
					<Popover
						content={button ? <PopContent state={state} /> : null}
						trigger="click"
						visible={open}
						onVisibleChange={visible => {
							console.log(visible, state, button)
							if (!visible) {
								setOpen(false)
								dispatch('buttons/update', button)
								// if (button.id === state.id) {
								// 	const diff = removeEquals(button, state)
								// 	if (diff) {
								// 	}
								// dispatch(`button/set`, null)
								// }
							} else {
								dispatch('button/set', state)
								setOpen(visible)
							}
						}}
					>
						<MoreOutlined onClick={() => setOpen(!open)} />
					</Popover>
				</Col>
			</div>
		</Dropdown>
	)
}

export default Button
