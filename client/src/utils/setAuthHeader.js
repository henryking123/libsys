import axios from 'axios'

export default () => {
	axios.defaults.headers.common['x-auth-token'] =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGM0ZjA2MjJiMzIyNDBkYTBiM2MyOWQiLCJpYXQiOjE1NzMxODc2ODJ9.SzNYkUu1os5QzvXkwBgjGKCtKWkfl3fGipNKx5EsDQ4'
}
