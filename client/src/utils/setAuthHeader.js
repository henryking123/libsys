import axios from 'axios'

export default (token) => {
	axios.defaults.headers.common['x-auth-token'] = token
}

// User
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGM4YWM4ODUyMGQ3NTFlNTBiZGUyYjciLCJpYXQiOjE1NzM0MzI0NTZ9.OvViJKyAV7TpmXAZX00whpX35xhaELdj3Ph0C7yAvrU

// Admin
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGM0ZjA2MjJiMzIyNDBkYTBiM2MyOWQiLCJpYXQiOjE1NzMxODc2ODJ9.SzNYkUu1os5QzvXkwBgjGKCtKWkfl3fGipNKx5EsDQ4
