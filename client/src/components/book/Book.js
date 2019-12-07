import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Loader, Item, Label, Grid, Header, Button } from 'semantic-ui-react'
import moment from 'moment'
import ActiveTicketButtons from '../buttons/ActiveTicketButtons'
import CartButtons from '../buttons/CartButtons'
import DeleteBookButton from '../buttons/DeleteBookButton'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reloadTickets } from '../../actions/auth'
import BorrowHistory from './BorrowHistory'
import EditHistory from './EditHistory'

class Book extends Component {
	state = { book: {}, activeTicket: {}, tickets: [] }

	componentDidMount = async () => {
		await this.props.reloadTickets()

		const { tickets } = this.props.auth.user

		const res = await axios.get(`/books/${this.props.match.params.book_id}`)
		const book = res.data

		if (tickets.some((ticket) => ticket.book._id === book._id)) {
			const ticketIndex = tickets.findIndex((ticket) => ticket.book._id === book._id)
			const activeTicket = tickets[ticketIndex]
			await this.setState({ book, activeTicket })
		} else {
			await this.setState({ book })
		}
	}

	renderAvailability = (available) => {
		if (!available) {
			return <Label color="red">0 left</Label>
		} else if (available < 5) {
			return <Label color="orange">Only {available} left</Label>
		}
	}

	onButtonClick = async () => {
		const res = await axios.get(`/tickets/${this.state.activeTicket._id}`)
		const activeTicket = res.data
		await this.setState({ activeTicket })
	}

	render() {
		const { book, activeTicket } = this.state

		if (!Object.keys(book).length) return <Loader active inline="centered" />
		const { title, author, yearPublished, available, description } = book
		return (
			<React.Fragment>
				<Grid centered>
					<Grid.Column width={10}>
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

						{this.props.auth.user.isAdmin ? (
							<React.Fragment>
								<DeleteBookButton book_id={book._id} book_title={title} floated="right" />
								<Link to={`${book._id}/edit`}>
									<Button
										floated="right"
										icon="edit outline"
										labelPosition="right"
										content="Edit Details"
										primary
									/>
								</Link>
							</React.Fragment>
						) : null}
						{Object.keys(activeTicket).length && activeTicket.sort_order < 5 ? (
							<ActiveTicketButtons ticket={activeTicket} onButtonClick={this.onButtonClick} />
						) : (
							<CartButtons book={book} />
						)}
					</Grid.Column>
				</Grid>

				{this.props.auth.user.isAdmin ? (
					<React.Fragment>
						<Grid columns={2} style={{ marginTop: '50px' }}>
							<Grid.Column width={6}>
								<EditHistory edit_history={book.editHistory} />
							</Grid.Column>
							<Grid.Column width={10}>
								<BorrowHistory book_id={book._id} />
							</Grid.Column>
						</Grid>
					</React.Fragment>
				) : null}
			</React.Fragment>
		)
	}
}

Book.propTypes = {
	match: PropTypes.object,
	auth: PropTypes.object,
	cart: PropTypes.array,
	reloadTickets: PropTypes.func.isRequired
}

const mapStateToProps = ({ auth, cart }) => ({ auth, cart })

export default connect(mapStateToProps, { reloadTickets })(Book)
