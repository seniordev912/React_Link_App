import axios from '../constants/axios'
import { removeEquals } from '../utils'

const card = store => {
	store.on('card/set', (oldState, value) => {
		return {
			authUser: {
				...oldState.authUser,
				card: value
			}
		}
	})
	store.on('card/update', async (oldState, all) => {
		const { noCompare = false, ...value } = all
		const newCard = {
			...oldState.authUser.card,
			...value
		}
		// store.dispatch('card/set', newCard)
		if (noCompare) {
			await axios.patch(`user/cards/${oldState.authUser.card.id}`, value)
		} else {
			const toSend = removeEquals(newCard, oldState.authUser.card)
			if (toSend) {
				await axios.patch(`user/cards/${oldState.authUser.card.id}`, toSend)
			}
		}
	})
	store.on('card/change', (oldState, value) => {
		const newCard = {
			...oldState.authUser.card,
			...value
		}
		store.dispatch('card/set', newCard)
	})
}

export default card
