import React, { useState, useRef, useEffect } from 'react'
import { Avatar, Popover, Dropdown, message } from 'antd'
import { useDropzone } from 'react-dropzone'
import { MoreOutlined } from '@ant-design/icons'
import { useStoreon } from 'storeon/react'
import PopContent from './PopContent'

const Button = ({ value: initial, defaultRef, ...props }) => {
	const [open, setOpen] = useState(false)
	const [drop, setDrop] = useState(false)
	const [state, setState] = useState(initial)
	const { dispatch, button } = useStoreon('button')
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
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		multiple: false,
		onDrop,
		accept: ['image/jpeg', 'image/png'],
		maxSize: 2000000
	})
	useEffect(() => {
		if (button) {
			if (button.id === state.id) {
				if (button !== state) {
					dispatch('button/set', state)
				}
			}
		}
	}, [button, dispatch, state])
	useEffect(() => {
		if (drop || open) {
			dispatch('button/set', state)
		}
	}, [dispatch, drop, open, state])
	useEffect(() => {
		if (button) {
			if (button.id === initial.id) {
				setState(button)
			}
		}
	}, [button, initial.id])
	return (
		<Dropdown
			visible={!open ? drop : false}
			onVisibleChange={visible => setDrop(visible)}
			overlay={<PopContent state={state} isMenu />}
			trigger={['contextMenu']}
		>
			<div
				className="button-card"
				ref={defaultRef}
				{...props}
				style={{ ...props.style, backgroundColor: state.bgColor }}
			>
				<div {...getRootProps()}>
					<Avatar shape="square" size={64} src={state.photoUrl} />
					<input {...getInputProps()} />
				</div>
				<span
					contentEditable
					suppressContentEditableWarning
					onKeyDown={e => {
						if (e.keyCode === 13) {
							e.preventDefault()
							return false
						}
						if (
							e.target.innerText.length >= 50 &&
							((e.which >= 65 && e.which <= 90) || (e.which >= 48 && e.which <= 57))
						) {
							if (e.ctrlKey || e.altKey || e.shiftKey) {
							} else {
								e.preventDefault()
							}
						}
					}}
					onBlur={e =>
						setState({
							...state,
							title: e.target.innerText
						})
					}
					spellCheck={false}
					style={{
						cursor: 'text',
						maxWidth: '80%',
						color: state.titleColor,
						// maxHeight: '100%',
						border: 'none',
						outline: 'none',
						transition: 'all 0.2s linear'
					}}
				>
					{state.title ? state.title : 'Insert the title here'}
				</span>
				<Popover
					content={<PopContent state={state} />}
					trigger="click"
					visible={open}
					onVisibleChange={visible => setOpen(visible)}
				>
					<MoreOutlined onClick={() => setOpen(!open)} />
				</Popover>
			</div>
		</Dropdown>
	)
}

export default Button
