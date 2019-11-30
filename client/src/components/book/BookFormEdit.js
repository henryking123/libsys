// @todo - Minimum of quantity is quantity - available
import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { YearInput } from 'semantic-ui-calendar-react'
import axios from 'axios'

class BookFormEdit extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title: '',
			yearPublished: '',
			author: '',
			description: '',
			quantity: 0,
			loading: true,
			loadingSubmit: false
		}

		this.book_id = this.props.match.params.book_id
	}

	async componentDidMount() {
		// Get the book from DB and then set the value to form
		const res = await axios.get(`/books/${this.book_id}`)
		const { title, yearPublished, author, description, quantity } = res.data
		await this.setState({
			title: title || '',
			yearPublished: yearPublished || '',
			author: author || '',
			description: description || '',
			quantity: quantity || 0,
			loading: false
		})
	}

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value })
	}

	onSubmit = async () => {
		// Patch the book then redirect to /books/:book_id
		await this.setState({ loadingSubmit: true })
		const updatedBook = this.state
		delete updatedBook.loading
		delete updatedBook.loadingSubmit
		await axios.patch(`/books/${this.book_id}`, updatedBook)
		await this.setState({ loadingSubmit: false })
		this.props.history.push(`/books/${this.book_id}`)
	}

	render() {
		return (
			<React.Fragment>
				<Form autoComplete="off" onSubmit={this.onSubmit} loading={this.state.loading}>
					<Form.Input
						label="Book Title"
						name="title"
						onChange={this.handleChange}
						value={this.state.title}
						width={9}
						required
					/>
					<Form.Input
						label="Author"
						name="author"
						onChange={this.handleChange}
						value={this.state.author}
						width={9}
					/>

					<Form.TextArea
						label="Book Description"
						name="description"
						onChange={this.handleChange}
						value={this.state.description}
						rows={4}
						width={9}
					/>
					<Form.Field width={7}>
						<label>Year Published</label>
						<YearInput
							placeholder="Year"
							name="yearPublished"
							popupPosition="top right"
							inline
							value={this.state.yearPublished}
							iconPosition="left"
							onChange={this.handleChange}
							maxDate={new Date().getFullYear().toString()}
						/>
					</Form.Field>
					<Form.Input
						label="Quantity"
						type="number"
						min={0}
						// @todo For testing
						// min={this.state.quantity - this.state.available}
						width={3}
						name="quantity"
						onChange={this.handleChange}
						value={this.state.quantity}
					/>
					<Form.Button loading={this.state.loadingSubmit} primary>
						Update Book
					</Form.Button>
				</Form>
			</React.Fragment>
		)
	}
}

export default BookFormEdit
