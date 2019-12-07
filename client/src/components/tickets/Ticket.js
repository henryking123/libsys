import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Header, Grid, Label, Loader, Table } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { setAlert } from '../../actions/alert'
import ActiveTicketButtons from '../buttons/ActiveTicketButtons'
import AdminTicketButtons from '../buttons/AdminTicketButtons'

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

	componentDidMount = async () => {
		const res = await axios.get(`/tickets/${this.props.match.params.ticket_id}`)
		this.setState({ ticket: res.data })
	}

	onButtonClick = async () => {
		const res = await axios.get(`/tickets/${this.props.match.params.ticket_id}`)
		this.setState({ ticket: res.data })
	}

	render() {
		const { ticket } = this.state

		if (!Object.keys(ticket).length) return <Loader active inline="centered" />

		console.log(ticket)
		return (
			<Grid centered columns={1}>
				<Grid.Column width={10}>
					<Header as="h2">
						Ticket #{ticket._id.slice(-7)} {this.renderLabel(ticket.sort_order, ticket.status)}
						<Header.Subheader>
							Borrower: <strong>{ticket.borrower.name}</strong>
							<br />
							Book:{' '}
							<Link to={`/books/${ticket.book._id}`}>
								<strong>{ticket.book.title}</strong>
							</Link>{' '}
							{ticket.book.author ? (
								<React.Fragment>
									by <strong>{ticket.book.author}</strong>
								</React.Fragment>
							) : null}
						</Header.Subheader>
					</Header>

					{this.renderEventLogs(ticket.event_logs)}

					{ticket.borrower._id.toString() === this.props.auth.user._id.toString() ? (
						<ActiveTicketButtons ticket={ticket} onButtonClick={this.onButtonClick} />
					) : (
						''
					)}
					<AdminTicketButtons ticket={ticket} onButtonClick={this.onButtonClick} />
				</Grid.Column>
			</Grid>
		)
	}
}

Ticket.propTypes = {
	auth: PropTypes.object,
	match: PropTypes.object,
	setAlert: PropTypes.func.isRequired
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps, { setAlert })(Ticket)
