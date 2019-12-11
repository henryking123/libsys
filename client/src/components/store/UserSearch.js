import React, { Component } from 'react'
import axios from 'axios'
import { Input } from 'semantic-ui-react'
import UserList from './UserList'

export class UserSearch extends Component {
	state = { q: '', users: [] }

	componentDidMount = async () => {
		this.search()
	}

	onChange = async (e) => {
		await this.setState({ [e.target.name]: e.target.value })
		this.search()
	}

	search = async () => {
		const res = await axios.get(`/user/search?q=${this.state.q}`)
		await this.setState({ users: res.data })
	}

	render() {
		const { users } = this.state
		console.log(users)

		return (
			<div>
				<Input
					fluid
					icon="search"
					placeholder="Search title, author, date published..."
					value={this.state.q}
					onChange={(e) => this.onChange(e)}
					name="q"
					autoComplete="off"
				/>
				<UserList users={users} />
			</div>
		)
	}
}

export default UserSearch
