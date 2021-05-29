const button = store => {
	store.on('@init', () => {
		return {
			button: null
		}
	})
	store.on('button/set', (_, payload) => {
		return {
			button: payload
		}
	})
	store.on('button/change', (oldState, payload) => {
		return {
			button: {
				...oldState.button,
				...payload
			}
		}
	})
}

export default button
