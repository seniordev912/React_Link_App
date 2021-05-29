import axios from '../constants/axios'
import { getSource } from '../utils'

const users = store => {
	store.on('@init', () => ({
		user: { data: null, loading: true, error: null }
	}))
	store.on('users/isLoading', (state, payload = true) => ({
		user: {
			...state.user,
			loading: payload
		}
	}))
	store.on('users/setError', (state, payload) => ({
		user: { ...state.user, error: payload }
	}))
	store.on('users/getUser', async (_, username) => {
		store.dispatch('users/isLoading')
		try {
			const res = await axios.get(`users/${username}`)
			if (!res.data.result) {
				store.dispatch('users/isLoading', false)
				store.dispatch('users/setError', res.data.error)
			} else {
				store.dispatch('users/set', res.data.user)
				if (res.data.error) {
					store.dispatch('users/setError', res.data.error)
				}
				store.dispatch('users/isLoading', false)
			}
		} catch {
			store.dispatch('users/isLoading', false)
		}
	})
	store.on('users/cardView', async (state, payload) => {
		const { data: user } = state.user
		await axios.post(`users/${user.username}/cards/${user.card.id}`, {
			enteredTime: payload.enteredTime,
			source: getSource(document.referrer),
			userAgent: navigator.userAgent
		})
	})
	store.on('users/buttonClick', async (state, payload) => {
		const { data: user } = state.user
		await axios.post(`users/${user.username}/cards/${user.card.id}/buttons/${payload.id}`, {
			enteredTime: payload.enteredTime,
			source: getSource(document.referrer),
			userAgent: navigator.userAgent
		})
	})
	store.on('users/socialClick', async (state, payload) => {
		const { data: user } = state.user
		await axios.post(`users/${user.username}/cards/${user.card.id}/socials/${payload.id}`, {
			enteredTime: payload.enteredTime,
			source: getSource(document.referrer),
			userAgent: navigator.userAgent
		})
	})
	store.on('users/set', (state, payload) => ({
		user: { ...state.user, data: payload }
	}))
}

export default users
