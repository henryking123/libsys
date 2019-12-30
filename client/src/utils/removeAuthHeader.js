import axios from 'axios'
export default () => {
	delete axios.defaults.headers.common['x-auth-token']
}
