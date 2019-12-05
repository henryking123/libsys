import React, { Component } from 'react'
import { Button, Item, Label, Header } from 'semantic-ui-react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { addToCart, removeFromCart } from '../../actions/cart'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import CartButtons from '../buttons/CartButtons'

class List extends Component {
	renderButton = (book) => {
		if (this.props.auth.user.tickets.some((ticket) => ticket.book._id === book._id)) {
			return <Button floated="right" primary content="Borrowed" />
		}

		return <CartButtons book={book} borrowNow={false} />
	}

	renderAvailability = (available) => {
		if (!available) {
			return <Label color="red">0 left</Label>
		} else if (available < 5) {
			return <Label color="orange">Only {available} left</Label>
		}
	}

	render() {
		if (!this.props.books.length)
			return (
				<Header as="h3" style={{ textAlign: 'center', marginTop: '20px' }}>
					No results found.
				</Header>
			)

		return (
			<Item.Group divided>
				{this.props.books.map((book) => (
					<Item key={book._id}>
						<Item.Image
							src="https://kbimages1-a.akamaihd.net/52c896b6-2750-4c3d-a844-0760f23117f9/353/569/90/False/how-to-study-smart-study-secrets-of-an-honors-student.jpg"
							size="tiny"
						/>

						<Item.Content verticalAlign="middle">
							<Item.Header as={Link} to={`/books/${book._id}`}>
								{book.title}
							</Item.Header>

							<Item.Extra>
								{this.renderAvailability(book.available)}
								{book.author ? <Label>{book.author}</Label> : ''}
								{book.yearPublished ? (
									<Label>{moment(book.yearPublished).format('YYYY')}</Label>
								) : (
									''
								)}
								{this.renderButton(book)}
							</Item.Extra>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		)
	}
}

List.propTypes = {
	books: PropTypes.array.isRequired,
	addToCart: PropTypes.func.isRequired,
	removeFromCart: PropTypes.func.isRequired,
	cart: PropTypes.array,
	auth: PropTypes.object
}

const mapStateToProps = ({ cart, auth }) => ({ cart, auth })

export default connect(mapStateToProps, { addToCart, removeFromCart })(List)
