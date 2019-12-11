import React, { Component } from 'react'
import axios from 'axios'

export class UserSearch extends Component {
	componentDidMount = async () => {
		const res = await axios.get('/user/search?q=a')
		console.log(res.data)
	}

	render() {
		return <div>a</div>
	}
}

export default UserSearch
