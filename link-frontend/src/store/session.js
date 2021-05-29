import axios from '../constants/axios'

const session = store => {
	store.on('@init', () => {
		const token = localStorage.getItem('token')
		if (token) {
			store.dispatch('session/getUser')
		}
		return {
			authUser: null,
			gettingUser: !!token,
			isLoading: true
		}
		// authUser: localStorage.getItem('user')
		// 	? localStorage.getItem('user')[0] === '{'
		// 		? typeof JSON.parse(localStorage.getItem('user')).id !== 'string'
		// 			? JSON.parse(localStorage.getItem('user'))
		// 			: null
		// 		: null
		// 	: null
	})
	store.on('session/gettingUser', (state, payload = true) => ({
		gettingUser: payload
	}))
	store.on('session/isLoading', (state, payload = true) => ({
		isLoading: payload
	}))
	store.on('session/getUser', async () => {
		try {
			const res = await axios.get('user')
			if (!res.data) {
				store.dispatch('session/gettingUser', false)
				localStorage.removeItem('token')
			} else {
				store.dispatch('session/set', res.data)
				store.dispatch('session/gettingUser', false)
			}
		} catch {
			store.dispatch('session/gettingUser', false)
			localStorage.removeItem('token')
		}
	})
	store.on('session/getClicks', async oldState => {
		if (oldState.authUser.card) {
			const res = await axios.get(`user/cards/${oldState.authUser.card.id}/clicks`)
			if (res.data) {
				store.dispatch('session/set', {
					...oldState.authUser,
					dashboard: res.data
				})
			}
		}
	})
	store.on('session/logout', () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		window.open('/signin', '_self')
		return {
			authUser: null,
			gettingUser: false,
			isLoading: true,
			buttons: [],
			button: null
		}
	})
	store.on('session/createCard', async () => {
		store.dispatch('session/isLoading')
		try {
			const res = await axios.post('user/cards')
			if (!res.data) {
				store.dispatch('session/isLoading', false)
			} else {
				store.dispatch('session/change', { card: res.data })
				store.dispatch('buttons/set', res.data.buttons)
				store.dispatch('session/isLoading', false)
			}
		} catch {
			store.dispatch('session/isLoading', false)
		}
	})
	store.on('session/set', (_, payload) => ({ authUser: payload }))
	store.on('session/change', (state, payload) => ({
		authUser: { ...state.authUser, ...payload }
	}))
}

export default session
