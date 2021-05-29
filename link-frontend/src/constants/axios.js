import axios from 'axios'

const obj = {
	headers: {}
}

const token = localStorage.getItem('token')

if (token) {
	obj.headers.authorization = `Bearer ${token}`
}

const instance = axios.create({
	baseURL:
		process.env.REACT_APP_SERVER_URL ||
		`${window.location.protocol}//${window.location.hostname}:9100`,
	// withCredentials: true,
	...obj
})

export default instance
