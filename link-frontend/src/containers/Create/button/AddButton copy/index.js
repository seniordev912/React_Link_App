import React from 'react'
import './style.scss'
import { useStoreon } from 'storeon/react'

const AddButton = () => {
	const { dispatch, buttons } = useStoreon('buttons')
	return (
		<div
			className="add-button-card"
			style={{
				borderColor: buttons
					? buttons[buttons.length - 1]
						? buttons[buttons.length - 1].bgColor
						: 'black'
					: 'black'
			}}
		>
			<span contentEditable suppressContentEditableWarning>
				Give me a title
			</span>
		</div>
	)
}

export default AddButton
