import React, { useRef } from 'react'
import EditorJs from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './constants'
import axios from '../../../constants/axios'
import './override.scss'

const TitleComponent = ({ user }) => {
	const instanceRef = useRef(null)

	const initValue = {
		time: 1556098174501,
		blocks: [
			{
				type: 'header',
				data: {
					text: `Hey, it's ${user.firstName}`,
					level: 1
				}
			},
			{
				type: 'paragraph',
				data: {
					text: `Click me to start typing...`
				}
			}
		],
		color: user.card && user.card.text ? user.card.text.color : '#000',
		version: '2.12.4'
	}

	async function handleSave() {
		const savedData = await instanceRef.current.save()

		savedData.color = user.card && user.card.text ? user.card.text.color : '#000'
		const inputData = {
			text: savedData
		}
		console.log(inputData, "****************");
		
		await axios.patch(`user/cards/${user.card.id}`, inputData)
	}

	return (
		<>
			<EditorJs
				className="text-container"
				onChange={handleSave}
				instanceRef={instance => (instanceRef.current = instance)}
				tools={{
					...EDITOR_JS_TOOLS,
					header: {
						class: EDITOR_JS_TOOLS.header
						// toolbox: {
						// 	icon: '<i class="fa fa-bold" />'
						// }
						// inlineToolbar:
					},
					paragraph: {
						class: EDITOR_JS_TOOLS.paragraph
						// toolbox: {
						// 	icon: '<i class="fa fa-bold" />'
						// }
					}
				}}
				data={
					user.card.text && user.card.text.blocks && user.card.text.blocks.length !== 0
						? user.card.text
						: initValue
				}
			/>
		</>
	)
}

export default TitleComponent
