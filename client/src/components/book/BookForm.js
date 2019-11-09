import React, { Component } from 'react'
import { Form, Message } from 'semantic-ui-react'
import { YearInput } from 'semantic-ui-calendar-react'
import axios from 'axios'

class BookForm extends Component {
	state = {
		title: '',
		yearPublished: '',
		author: '',
		description: '',
		quantity: 0,
		loading: false,
		success: false
	}

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value })
	}

	resetFields = () => {
		this.setState({ title: '', yearPublished: '', author: '', description: '', quantity: 0 })
	}

	onSubmit = async () => {
		console.log('Submitted')
		await this.setState({ loading: true })
		const newBook = this.state
		delete newBook.loading
		delete newBook.success
		console.log(newBook)
		await axios.post('/books', newBook)
		await this.setState({ loading: false, success: true })
		this.resetFields()
		setTimeout(() => this.setState({ success: false }), 3000)
	}

	render() {
		return (
			<React.Fragment>
				<Form autoComplete="off" onSubmit={this.onSubmit} success={this.state.success}>
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
						width={3}
						name="quantity"
						onChange={this.handleChange}
						value={this.state.quantity}
					/>
					<Message success header="Book Added" content={`You have successfully added the book.`} />
					<Form.Button primary loading={this.state.loading}>
						Add New Book
					</Form.Button>
				</Form>
			</React.Fragment>
		)
	}
}

export default BookForm
