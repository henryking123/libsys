import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Header, Grid, Label, Loader, Table, Icon, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setAlert } from '../../actions/alert'

class Ticket extends Component {
	state = { ticket: {} }

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

	renderEventLogs = (event_logs) => {
		return (
			<Table compact celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell colSpan="2">Ticket History</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{event_logs.map(({ status, time, by: { name }, _id }) => (
						<Table.Row key={_id}>
							<Table.Cell collapsing>{moment(time).format('lll')}</Table.Cell>
							<Table.Cell>
								{status} by {name}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		)
	}

	renderButtons = (sort_order, _id) => {
		if (this.state.ticket.borrower._id.toString() !== this.props.auth.user._id.toString())
			return null

		switch (sort_order) {
			case 1:
				return (
					// For Pick Up
					<Button
						floated="left"
						icon="close"
						labelPosition="left"
						content="Cancel Pick Up"
						onClick={() => this.cancelTicket(_id)}
					/>
				)
			case 2:
				return (
					// Pending Borrow
					<Button
						floated="left"
						icon="close"
						labelPosition="left"
						content="Cancel Borrow Request"
						onClick={() => this.cancelTicket(_id)}
					/>
				)
			case 3:
				// Pending Return
				return (
					<Button
						floated="left"
						icon="close"
						labelPosition="left"
						content="Cancel Return Request"
						onClick={() => this.cancelTicket(_id)}
					/>
				)
			case 4:
				// Borrowed/Active
				return (
					<Button
						floated="left"
						icon="right chevron"
						positive
						labelPosition="left"
						content="Return Book"
						onClick={() => this.returnTicket(_id)}
					/>
				)
			default:
				return
		}
	}

	renderAdminButtons = (sort_order, _id) => {
		if (!this.props.auth.user.isAdmin) return null

		if (sort_order === 1 || sort_order === 2 || sort_order === 3)
			return (
				<React.Fragment>
					<Button positive floated="left" onClick={() => this.acceptTicket(_id)}>
						<Icon name="check" /> Accept
					</Button>
					<Button negative floated="left" onClick={() => this.declineTicket(_id)}>
						<Icon name="close" /> Decline
					</Button>
				</React.Fragment>
			)
	}

	cancelTicket = async (ticket_id) => {
		try {
			// Send to cancel route
			const res = await axios.post('/tickets/cancel', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			// Reload Ticket
			this.getTicket()
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			this.getTicket()
		}
	}

	returnTicket = async (ticket_id) => {
		try {
			// Send to return route
			const res = await axios.post('/tickets/return', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			// Reload Ticket
			this.getTicket()
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			this.getTicket()
		}
	}

	acceptTicket = async (ticket_id) => {
		try {
			const res = await axios.post('/tickets/accept', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			// Reload Ticket
			this.getTicket()
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			// Reload Ticket
			this.getTicket()
		}
	}

	declineTicket = async (ticket_id) => {
		try {
			const res = await axios.post('/tickets/decline', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			// Reload Ticket
			this.getTicket()
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			// Reload Ticket
			this.getTicket()
		}
	}

	componentDidMount = () => {
		this.getTicket()
	}

	getTicket = async () => {
		const res = await axios.get(`/tickets/${this.props.match.params.ticket_id}`)
		this.setState({ ticket: res.data })
	}

	render() {
		const { ticket } = this.state

		if (!Object.keys(ticket).length) return <Loader active inline="centered" />

		console.log(ticket)
		return (
			<Grid centered columns={2}>
				<Grid.Column>
					<Header as="h2">
						Ticket #{ticket._id.slice(-7)} {this.renderLabel(ticket.sort_order, ticket.status)}
						<Header.Subheader>
							Borrower: <strong>{ticket.borrower.name}</strong>
							<br />
							Book: <strong>{ticket.book.title}</strong>{' '}
							{ticket.book.author ? (
								<React.Fragment>
									by <strong>{ticket.book.author}</strong>
								</React.Fragment>
							) : null}
						</Header.Subheader>
					</Header>

					{this.renderEventLogs(ticket.event_logs)}

					{this.renderButtons(ticket.sort_order, ticket._id)}
					{this.renderAdminButtons(ticket.sort_order, ticket._id)}
				</Grid.Column>
			</Grid>
		)
	}
}

Ticket.propTypes = {
	auth: PropTypes.object,
	setAlert: PropTypes.func.isRequired
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps, { setAlert })(Ticket)
