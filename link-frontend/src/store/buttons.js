import axios from '../constants/axios'
import { removeEquals } from '../utils'
// const createId = () => {
// 	let id = ''
// 	for (let i = 0; i < 3; i++) {
// 		id += parseInt(Math.random() * 10)
// 	}
// 	return id
// }

// const initialState = {
// 	title: 'Give me a title',
// 	titleColor: '#000',
// 	bgColor: '#fff',
// 	animation: 'none',
// 	url: '',
// 	protocol: 'https://'
// }

const buttons = store => {
	store.on('@init', () => {
		return {
			buttons: []
		}
	})
	store.on('buttons/set', (oldState, payload) => {
		return {
			authUser: {
				...oldState.authUser,
				card: {
					...oldState.authUser.card,
					buttons: payload
				}
			},
			buttons: payload
		}
	})
	store.on('buttons/add', async (oldState, title) => {
		// this will be changed later
		// console.log(payload)
		// const toSend = removeEquals(payload, initialState)
		if (title) {
			const res = await axios.post(`user/cards/${oldState.authUser.card.id}/buttons`, title)
			if (res.data) {
				store.dispatch('button/set', res.data)
				store.dispatch('buttons/set', [...oldState.buttons, res.data])
			}
		}
	})
	store.on('buttons/reorder', async (oldState, payload) => {
		store.dispatch('buttons/set', payload)
		const newOrder = payload.map(({ id }) => id)
		await axios.patch(`user/cards/${oldState.authUser.card.id}/buttons`, {
			buttons: newOrder
		})
	})
	store.on('buttons/update', (oldState, { id, createdAt, ...rest }) => {
		const index = oldState.buttons.findIndex(item => item.id === id)
		const { id: id2, createdAt: cat2, ...compare } = oldState.buttons[index]
		oldState.buttons.splice(index, 1, { ...oldState.buttons[index], ...rest })
		const toSend = removeEquals(rest, compare)
		if (toSend) {
			axios.patch(`user/cards/${oldState.authUser.card.id}/buttons/${id}`, toSend)
		}
		// store.dispatch('button/set', null)
		store.dispatch('buttons/set', oldState.buttons)
	})
	store.on('buttons/remove', async (oldState, payload) => {
		const index = oldState.buttons.findIndex(item => item.id === payload)
		oldState.buttons.splice(index, 1)
		axios.delete(`user/cards/${oldState.authUser.card.id}/buttons/${payload}`)
		store.dispatch('buttons/set', oldState.buttons)
	})
}

export default buttons
