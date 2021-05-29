import axios from '../constants/axios'
import { removeEquals } from '../utils'

const socials = store => {
	store.on('socials/set', (oldState, payload) => {
		return {
			authUser: {
				...oldState.authUser,
				card: {
					...oldState.authUser.card,
					socials: payload
				}
			}
		}
	})

	store.on('socials/addorupdate', async (oldState, value) => {
		let { id, fromCard, ...data } = value
		const index = oldState.authUser.card.socials.findIndex(updating => updating.id === id)
		if (index !== -1) {
			data = removeEquals(data, oldState.authUser.card.socials[index], ['name'])
		}
		if (data === null || (!data.link && typeof id !== 'string')) {
			return
		}
		const { data: res } = await axios.post(
			`user/cards/${oldState.authUser.card.id}/socials`,
			data
		)
		if (res.result === true) {
			oldState.authUser.card.socials.splice(index, 1, {
				...oldState.authUser.card.socials[index],
				...data
			})
			store.dispatch('socials/set', oldState.authUser.card.socials)
		} else if (res.result) {
			store.dispatch('socials/set', [...oldState.authUser.card.socials, res.result])
		}
	})

	store.on('socials/update', async (oldState, value) => {
		let { id, fromCard, ...data } = value
		const index = oldState.authUser.card.socials.findIndex(updating => updating.id === id)
		data = removeEquals(data, oldState.authUser.card.socials[index])
		if (data) {
			const { data: res } = await axios.patch(
				`user/cards/${oldState.authUser.card.id}/socials/${id}`,
				data
			)
			if (res) {
				oldState.authUser.card.socials.splice(index, 1, res)
				store.dispatch('socials/set', oldState.authUser.card.socials)
			}
		}
	})
	store.on('socials/delete', async (oldState, id) => {
		const index = oldState.authUser.card.socials.findIndex(deleting => deleting.id === id)
		oldState.authUser.card.socials.splice(index, 1)
		store.dispatch('socials/set', oldState.authUser.card.socials)
		await axios.delete(`user/cards/${oldState.authUser.card.id}/socials/${id}`)
	})
	store.on('socials/updateArray', async (oldState, value) => {
		oldState.authUser.socialArray = value;
		const data = {
			userId: oldState.authUser.id,
			socialArray: value
		}
		await axios.post(`user/auth/socialUpdate`, data);
	})
}

export default socials
