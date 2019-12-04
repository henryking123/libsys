import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Header, Grid, Label, Loader, Table } from 'semantic-ui-react'

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
				</Grid.Column>
			</Grid>
		)
	}
}

export default Ticket
