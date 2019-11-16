import React, { Component } from 'react'
import axios from 'axios'
import List from './List'
import { Input } from 'semantic-ui-react'

class Search extends Component {
	state = { search: '', books: [] }

	async componentDidMount() {
		const res = await axios.get(`/books`)
		await this.setState({ books: res.data })
	}

	async onChange(e) {
		await this.setState({ [e.target.name]: e.target.value })
		this.search()
	}

	async search() {
		const res = await axios.get(`/books/search?search=${this.state.search}`)
		await this.setState({ books: res.data })
	}

	render() {
		return (
			<React.Fragment>
				<Input
					fluid
					icon="search"
					placeholder="Search title, author, date published..."
					value={this.state.search}
					onChange={(e) => this.onChange(e)}
					name="search"
				/>
				<List books={this.state.books} />
			</React.Fragment>
		)
	}
}

export default Search
