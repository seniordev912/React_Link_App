import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
// import { useTransition, animated } from 'react-spring'
import Button from './button'
// import values from './values'
import './style.scss'
import './transition.css'
import { useStoreon } from 'storeon/react'
import AddButton from './AddButton'

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)

	return result
}

function Quote({ quote, index, props }) {
	return (
		<Draggable draggableId={quote.id} index={index}>
			{provided => (
				<Button
					value={quote}
					defaultRef={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				/>
			)}
		</Draggable>
	)
}

const QuoteList = ({ quotes, dragStatus }) => {
	// let height = 0
	// const transitions = useTransition(
	// 	quotes.map(data => ({ ...data, y: (height += 90) - 90 })),
	// 	d => d.id,
	// 	{
	// 		from: { height: 0, opacity: 0 },
	// 		leave: { height: 0, opacity: 0 },
	// 		enter: ({ y, height }) => ({ y, height, opacity: 1 }),
	// 		update: ({ y, height }) => ({ y, height })
	// 	}
	// )
	// return (
	// 	<div className="list-spring">
	// 		{transitions.map(({ item, props: { y, ...rest }, key }, index) => {
	// 			console.log(rest)
	// 			return (
	// 				<animated.div
	// 					key={key}
	// 					className="card-spring"
	// 					style={{
	// 						transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
	// 						...rest
	// 					}}
	// 				>
	// 					<div className="cell-spring">
	// 						<div className="details-spring">
	// 							<Quote quote={item} index={index} />
	// 						</div>
	// 					</div>
	// 				</animated.div>
	// 			)
	// 		})}
	// 	</div>
	// )
	return (
		<>
			{quotes.map((quote, index) => (
				<Quote quote={quote} index={index} key={quote.id} />
			))}
			<AddButton status={dragStatus !== null} />
			{/* <Button value={quotes[0]} /> */}
		</>
	)
	// return quotes.map((quote, index) => (
	// 	<Quote quote={quote} index={index} key={quote.id} />
	// ))
}

const QuoteApp = (props) => {
	const { handleClickButton } = props;
	const { dispatch, buttons, dragStatus } = useStoreon('buttons', 'dragStatus')

	const onDragEnd = result => {
		if (!result.destination) {
			return
		}
		if (result.destination.index === result.source.index) {
			dispatch('dragStatus/set', null)
			return
		}
		const quotes = reorder(buttons, result.source.index, result.destination.index)
		dispatch('dragStatus/set', null)
		// dispatch('buttons/set', quotes)
		dispatch('buttons/reorder', quotes)
	}

	const onDragStart = result => {
		dispatch('dragStatus/set', result)
	}

	return (
		<DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
			<Droppable droppableId="list">
				{provided => (
					<div
						onClick={(event)=>handleClickButton(event)}
						style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						<QuoteList quotes={buttons} dragStatus={dragStatus} />
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	)
}

export default QuoteApp
