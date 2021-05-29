import React from 'react'
import { RichUtils, EditorState, Modifier } from 'draft-js'
import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker'
import { SketchPicker } from 'react-color'
import { Row } from 'antd'
import {
	BoldOutlined,
	ItalicOutlined,
	UnderlineOutlined,
	BgColorsOutlined,
	CodeOutlined,
	FontSizeOutlined
} from '@ant-design/icons'

const colorStyleMap = {
	red: {
		color: 'rgba(255, 0, 0, 1.0)'
	},
	orange: {
		color: 'rgba(255, 127, 0, 1.0)'
	},
	yellow: {
		color: 'rgba(180, 180, 0, 1.0)'
	},
	green: {
		color: 'rgba(0, 180, 0, 1.0)'
	},
	blue: {
		color: 'rgba(0, 0, 255, 1.0)'
	},
	indigo: {
		color: 'rgba(75, 0, 130, 1.0)'
	},
	violet: {
		color: 'rgba(127, 0, 255, 1.0)'
	}
}

const popover = {
	position: 'absolute',
	zIndex: '2'
}

const cover = {
	position: 'fixed',
	top: '0px',
	right: '0px',
	bottom: '0px',
	left: '0px'
}

const Icons = ({ state, onChange, setState, picker }) => {
	const makeBold = () => {
		onChange(RichUtils.toggleInlineStyle(state.editorState, 'BOLD'))
	}

	const makeItalic = () => {
		onChange(RichUtils.toggleInlineStyle(state.editorState, 'ITALIC'))
	}

	const makeUnderline = () => {
		onChange(RichUtils.toggleInlineStyle(state.editorState, 'UNDERLINE'))
	}

	const makeCode = () => {
		onChange(RichUtils.toggleInlineStyle(state.editorState, 'CODE'))
	}

	const makeFontSize = () => {
		onChange(
			RichUtils.toggleBlockType(
				state.editorState,
				'header-one'
				// complete this function to change font size
			)
		)
	}

	const changeColor = () => {
		onChange(RichUtils.toggleInlineStyle(state.editorState))
		setState({ ...state, displayColorPicker: !state.displayColorPicker })
	}

	const closeColor = () => {
		setState({ ...state, displayColorPicker: false })
	}

	const toggleColor = toggledColor => {
		const { editorState } = state
		const selection = editorState.getSelection()
		// Let's just allow one color at a time. Turn off all active colors.
		const nextContentState = Object.keys(colorStyleMap).reduce((contentState, color) => {
			return Modifier.removeInlineStyle(contentState, selection, color)
		}, editorState.getCurrentContent())
		let nextEditorState = EditorState.push(
			editorState,
			nextContentState,
			'change-inline-style'
		)
		const currentStyle = editorState.getCurrentInlineStyle()
		// Unset style override for current color.
		if (selection.isCollapsed()) {
			nextEditorState = currentStyle.reduce((state, color) => {
				return RichUtils.toggleInlineStyle(state, color)
			}, nextEditorState)
		}
		// If the color is being toggled on, apply it.
		if (!currentStyle.has(toggledColor)) {
			nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, toggledColor)
		}
		onChange(nextEditorState)
	}

	// const picker = colorPickerPlugin(onChange, getEditorState)

	return (
		<Row>
			<BoldOutlined
				className="margin--right--icons"
				onClick={() => {
					makeBold()
				}}
			/>
			<ItalicOutlined
				className="margin--right--icons"
				onClick={() => {
					makeItalic()
				}}
			/>
			<UnderlineOutlined
				className="margin--right--icons"
				onClick={() => {
					makeUnderline()
				}}
			/>
			{/* need to add a richer code editor similar to slack */}
			<CodeOutlined
				className="margin--right--icons"
				onClick={() => {
					makeCode()
				}}
			/>
			{/* change color in real-time */}
			<BgColorsOutlined
				className="margin--right--icons"
				onClick={() => {
					changeColor()
				}}
			/>
			{state.displayColorPicker ? (
				<div style={popover}>
					{/* <div style={cover} onClick={() => closeColor()} /> */}
					<ColorPicker
						toggleColor={color => picker.addColor(color)}
						color={picker.currentColor(state.editorState)}
					/>
				</div>
			) : null}
			{/* set font size to H2 (default is H3) */}
			<FontSizeOutlined
				onClick={() => {
					makeFontSize()
				}}
			/>
		</Row>
	)
}

export default Icons
