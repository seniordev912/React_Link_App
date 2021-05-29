const dragStatus = store => {
	store.on('@init', () => ({ dragStatus: null }))
	store.on('dragStatus/set', (_, payload) => ({ dragStatus: payload }))
}

export default dragStatus
