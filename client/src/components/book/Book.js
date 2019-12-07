import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Loader, Item, Label, Grid, Header, Table } from 'semantic-ui-react'
import moment from 'moment'
import ActiveTicketButtons from '../buttons/ActiveTicketButtons'
import CartButtons from '../buttons/CartButtons'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reloadTickets } from '../../actions/auth'

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

		const data = await axios.get(`/tickets/book/${this.props.match.params.book_id}`)
		await this.setState({ tickets: data.data })
	}

	renderAvailability = (available) => {
		if (!available) {
			return <Label color="red">0 left</Label>
		} else if (available < 5) {
			return <Label color="orange">Only {available} left</Label>
		}
	}

	renderLabel = (sort_order, status) => {
		switch (sort_order) {
			case 1:
				return (
					<Label horizontal color="green">
						{status}
					</Label>
				)
			case 2:
			case 3:
				return (
					<Label horizontal color="orange">
						{status}
					</Label>
				)
			case 4:
				return (
					<Label horizontal color="blue">
						{status}
					</Label>
				)
			default:
				return <Label horizontal>{status}</Label>
		}
	}

	renderEditHistory = (editHistory) => {
		return (
			<Table compact celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell colSpan="2">Book Edit History</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{editHistory.map(({ time, updatedBy: { name, email }, _id }) => (
						<Table.Row key={_id}>
							<Table.Cell collapsing>{moment(time).format('lll')}</Table.Cell>
							<Table.Cell>
								{name} | {email}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		)
	}

	renderBorrowHistory = () => {
		const { tickets } = this.state
		return (
			<Table compact celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell colSpan="3" textAlign="center">
							Borrow History
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{tickets.length > 0 ? (
						tickets.map(({ _id, sort_order, status, updatedAt, borrower: { name } }) => (
							<Table.Row key={_id}>
								<Table.Cell collapsing>
									<Link to={`/tickets/${_id}`}>
										<strong>{_id.slice(-7)}</strong>
									</Link>
								</Table.Cell>
								<Table.Cell textAlign="center" collapsing>
									{this.renderLabel(sort_order, status)}
								</Table.Cell>
								<Table.Cell>
									{name} <small>({moment(updatedAt).format('lll')})</small>
								</Table.Cell>
							</Table.Row>
						))
					) : (
						<Table.Row>
							<Table.Cell colSpan="3" textAlign="center">
								<Header as="h5" style={{ marginTop: '20px', marginBottom: '20px' }}>
									List is empty.
								</Header>
							</Table.Cell>
						</Table.Row>
					)}
				</Table.Body>
			</Table>
		)
	}

	onButtonClick = async () => {
		const res = await axios.get(`/tickets/${this.state.activeTicket._id}`)
		const activeTicket = res.data
		await this.setState({ activeTicket })
	}

	render() {
		const { book, activeTicket } = this.state

		console.log(this.state.tickets)

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
							<Grid.Column width={6}>{this.renderEditHistory(book.editHistory)}</Grid.Column>
							<Grid.Column width={10}>{this.renderBorrowHistory()}</Grid.Column>
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
