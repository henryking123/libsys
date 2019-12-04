import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Loader, Item, Label, Grid, Header } from 'semantic-ui-react'
import moment from 'moment'
import ActiveTicketButtons from '../buttons/ActiveTicketButtons'
import CartButtons from '../buttons/CartButtons'
import { connect } from 'react-redux'

class Book extends Component {
	state = { book: {}, activeTicket: {} }

	componentDidMount = async () => {
		const { tickets } = this.props.auth.user

		const res = await axios.get(`/books/${this.props.match.params.book_id}`)
		const book = res.data

		if (tickets.some((ticket) => ticket.book._id === book._id)) {
			const ticketIndex = tickets.findIndex((ticket) => ticket.book._id === book._id)
			const activeTicket = tickets[ticketIndex]
			this.setState({ book, activeTicket })
		} else {
			this.setState({ book })
		}
	}

	renderAvailability = (available) => {
		if (!available) {
			return <Label color="red">0 left</Label>
		} else if (available < 5) {
			return <Label color="orange">Only {available} left</Label>
		}
	}

	render() {
		const { book, activeTicket } = this.state

		if (!Object.keys(book).length) return <Loader active inline="centered" />

		console.log(activeTicket)

		const { title, author, yearPublished, available, _id, description } = book
		return (
			<Grid centered columns={2}>
				<Grid.Column>
					<Item.Group>
						<Item>
							<Item.Image
								src="https://kbimages1-a.akamaihd.net/52c896b6-2750-4c3d-a844-0760f23117f9/353/569/90/False/how-to-study-smart-study-secrets-of-an-honors-student.jpg"
								size="small"
							/>

							<Item.Content verticalAlign="middle">
								<Item.Header>
									<Header as="h1">
										"{title}"
										{yearPublished ? (
											<React.Fragment> ({moment(yearPublished).format('YYYY')})</React.Fragment>
										) : null}
										{author ? <React.Fragment> by {author}</React.Fragment> : null}
									</Header>
								</Item.Header>
								<Item.Description>{description}</Item.Description>
								<Item.Extra>{this.renderAvailability(available)}</Item.Extra>
							</Item.Content>
						</Item>
					</Item.Group>

					{Object.keys(activeTicket).length && activeTicket.sort_order < 5 ? (
						<ActiveTicketButtons
							ticket={activeTicket}
							onButtonClick={(ticket) => this.setState({ activeTicket: ticket })}
						/>
					) : (
						<CartButtons book={book} />
					)}
				</Grid.Column>
			</Grid>
		)
	}
}

Book.propTypes = {
	match: PropTypes.object,
	auth: PropTypes.object,
	cart: PropTypes.array
}

const mapStateToProps = ({ auth, cart }) => ({ auth, cart })

export default connect(mapStateToProps)(Book)
