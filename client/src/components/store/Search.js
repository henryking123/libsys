import React, { Component } from 'react'
import axios from 'axios'
import List from './List'

// Translate to semantic-ui-react

class Search extends Component {
	state = { search: '', books: [] }

	componentDidMount() {
		this.search()
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
			<div className="ui right floated">
				<div className="ui fluid icon input">
					<input
						type="text"
						placeholder="Search title, author, date published..."
						value={this.state.search}
						onChange={(e) => this.onChange(e)}
						name="search"
					/>
					<i className="search icon"></i>
				</div>
				<List books={this.state.books} />
			</div>
		)
	}
}

export default Search
