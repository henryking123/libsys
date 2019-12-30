import axios from 'axios'

export default (token) => {
	axios.defaults.headers.common['x-auth-token'] = token
}
