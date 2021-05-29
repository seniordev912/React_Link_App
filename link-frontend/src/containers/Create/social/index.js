import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useStoreon } from 'storeon/react'
import socials from './socialData'
import Social from './Social'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function splitArrayIntoChunksOfLen(arr, len) {
	var chunks = [], i = 0, n = arr.length;
	while (i < n) {
			chunks.push(arr.slice(i, i += len));
	}
	return chunks;
}

const grid = 8;

const getListStyle = isDraggingOver => ({
  display: 'flex',
  padding: grid,
		overflow: 'hidden',
		justifyContent: 'center'
});

var socialList = []

const SocialComponent = ({card, socialArray, handleClickSocial}) => {
	const [state, setState] = useState({
		color: '#E2E2E2',
		visible: false,
		which: null,
		value: '',
		displayColorPicker: false
	})
	const { dispatch } = useStoreon()

	const [dndArray, setDndArray] = useState([]);
	const [dndElementLength, setDndElementLength] = useState(0);
	
	useEffect(() => {
		var tempSocialList = [];
		const tempList = card.socials.slice();
		const filterSocials = socials
				.filter(
					({ name }) =>
						card.socials.findIndex(value => value.name === name.toLowerCase()) === -1
				);
		
		tempList.push.apply(tempList, filterSocials);
		for(var i = 0; i < socialArray.length; i++) {
			for(var j = 0; j < tempList.length; j++) {
				if(socialArray[i].toLowerCase() === tempList[j].name.toLowerCase()) {
					tempSocialList.push(tempList[j]);
				}
			}
		}
		socialList = tempSocialList;

		var elmnt = document.getElementById("socialIconGroup");
	
		// Display result inside a div element
	
		const number = Math.floor( elmnt.clientWidth / 54 );
		var splittedArray=splitArrayIntoChunksOfLen(socialList,number);
		setDndElementLength(number);
		
		setDndArray(splittedArray);
		window.addEventListener("resize", displayWindowSize);
	}, [card])

	function displayWindowSize () {
		// Get width and height of the window excluding scrollbars
		var elmnt = document.getElementById("socialIconGroup");
		if(elmnt) {
			const number = Math.floor( elmnt.clientWidth / 54 );
			var splittedArray = splitArrayIntoChunksOfLen(socialList, number);
			setDndElementLength(number);
			
			setDndArray(splittedArray);
		}
	}


	const handleSave = Social => e => {
		e.preventDefault()
		if (typeof Social.id === 'string') {
		} else {
		}
		// save handler  to DB
	}

	const handleVisibleChange = Social => visible => {
		setState({ ...state, visible, which: visible ? Social.id : null })
	}

	// const openColorPicker = () => {
	// 	setState({ ...state, displayColorPicker: !state.displayColorPicker })
	// }

	// const closeColorPicker = () => {
	// 	setState({ ...state, displayColorPicker: false })
	// }

	// const changeColor = color => {
	// 	setState({ ...state, color })
	// }

	// const handleColorClick = () => {
	// 	setState({ ...state, displayColorPicker: !state.displayColorPicker })
	// }

	// const handleClose = () => {
	// 	setState({ ...state, displayColorPicker: false })
	// }

	// const handleChange = color => {
	// 	setState({ ...state, color })
	// }

	const onDragEnd = (result)  => {
			const {source, destination} = result;
			// dropped outside the list
			if (!destination) {
					return;
			}
			const updatedArray = [];
			var thenum1 = Number(source.droppableId.replace( /^\D+/g, ''));
			var thenum2 = Number(destination.droppableId.replace( /^\D+/g, ''));
			
			const ind = thenum1 < thenum2 ? 1 : 0;
			const reorderList = reorder(socialList, thenum1 * dndElementLength + result.source.index, thenum2 * dndElementLength + result.destination.index - ind);
			
			for(var i = 0; i < reorderList.length; i++) {
				updatedArray.push(reorderList[i].name);
			}
			
			socialList = reorderList.slice();
			var splittedArray=splitArrayIntoChunksOfLen(reorderList, dndElementLength);
			setDndArray(splittedArray);
			dispatch('socials/updateArray', updatedArray)
	}

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity

	return (
			<DragDropContext onDragEnd={onDragEnd}>
				<div id="socialIconGroup" style={{width: "100%"}} onClick={handleClickSocial}>
					{
						dndArray.map((dndElement, indexElement) => (
							<Droppable key={indexElement} droppableId={"droppable" + indexElement} direction="horizontal">
								{(provided, snapshot) => (
										<div
												ref={provided.innerRef}
												style={getListStyle(snapshot.isDraggingOver)}
												{...provided.droppableProps}
										>
												{dndElement.map((social, index) => (
														<Draggable key={social.id} draggableId={String(social.id)} index={index}>
																{(provided, snapshot) => (
																		<div
																				ref={provided.innerRef}
																				{...provided.draggableProps}
																				{...provided.dragHandleProps}
																		>
																			<Social
																				key={social.id}
																				value={social}
																				current={state.which}
																				currentColor={state.color}
																				handleVisibleChange={handleVisibleChange}
																				socialData={socials}
																			/>
																		</div>
																)}
														</Draggable>
												))}
												{provided.placeholder}
										</div>
								)}
						</Droppable>
					))}
				</div>
			</DragDropContext>
	);
}

export default SocialComponent
