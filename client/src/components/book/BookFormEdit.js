import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { YearInput } from 'semantic-ui-calendar-react'
import axios from 'axios'
import PropTypes from 'prop-types'
import DeleteBookButton from '../buttons/DeleteBookButton'

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
		const { title, yearPublished, author, description, quantity, available } = res.data
		await this.setState({
			title: title || '',
			yearPublished: yearPublished || '',
			author: author || '',
			description: description || '',
			quantity: quantity || 0,
			available: available || 0,
			loading: false,
			min: quantity - available || 0
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
		delete updatedBook.min
		delete updatedBook.available
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
						label={`Quantity (Active Tickets/Minimum: ${this.state.min})`}
						type="number"
						min={this.state.min}
						width={4}
						name="quantity"
						onChange={this.handleChange}
						value={this.state.quantity}
					/>
					<Button
						labelPosition="right"
						icon="edit outline"
						type="submit"
						loading={this.state.loadingSubmit}
						primary
						content="Update Book"
					/>
					<DeleteBookButton book_id={this.book_id} />
				</Form>
			</React.Fragment>
		)
	}
}

BookFormEdit.propTypes = {
	match: PropTypes.object
}

export default BookFormEdit
