import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Item, Grid, Label, Table, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { setAlert } from '../../actions/alert'
import { reloadTickets } from '../../actions/auth'
import ActiveTicketButtons from '../buttons/ActiveTicketButtons'

class UserBooks extends Component {
	componentDidMount = () => {
		this.props.reloadTickets()
	}

	ribbon = (sort_order, status) => {
		switch (sort_order) {
			case 1:
				return (
					<Label ribbon color="green">
						{status}
					</Label>
				)
			case 2:
			case 3:
				return (
					<Label ribbon color="orange">
						{status}
					</Label>
				)
			case 4:
				return (
					<Label ribbon color="blue">
						{status}
					</Label>
				)
			default:
				return (
					<Label ribbon color="red">
						{status}
					</Label>
				)
		}
	}

	render() {
		const { user } = this.props.auth

		if (user) {
			if (user.tickets.length > 0) {
				return (
					<Grid centered columns={1}>
						<Grid.Column width={10}>
							<Table compact>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell width={2} textAlign="center">
											Status
										</Table.HeaderCell>
										<Table.HeaderCell width={14}>Book</Table.HeaderCell>
									</Table.Row>
								</Table.Header>

								<Table.Body>
									{user.tickets.map((ticket) => {
										return (
											<Table.Row key={ticket._id}>
												<Table.Cell>{this.ribbon(ticket.sort_order, ticket.status)}</Table.Cell>
												<Table.Cell>
													<Item.Group relaxed>
														<Item>
															<Item.Image size="tiny" src="/thumbnail.png" />
															<Item.Content>
																<Item.Header>
																	<Header as="h3">
																		<Link to={`/books/${ticket.book._id}`}>
																			{ticket.book.title}
																		</Link>
																	</Header>
																</Item.Header>
																<Item.Description>
																	<em>
																		{ticket.event_logs[ticket.event_logs.length - 1].status} by{' '}
																		{ticket.event_logs[ticket.event_logs.length - 1].by.name}
																	</em>
																</Item.Description>
																<Item.Extra>
																	<ActiveTicketButtons
																		ticket={ticket}
																		onButtonClick={this.props.reloadTickets}
																	/>
																</Item.Extra>
															</Item.Content>
														</Item>
													</Item.Group>
												</Table.Cell>
											</Table.Row>
										)
									})}
								</Table.Body>
							</Table>
						</Grid.Column>
					</Grid>
				)
			} else {
				return (
					<Header as="h3" style={{ textAlign: 'center', marginTop: '20px' }}>
						Book list is empty.
					</Header>
				)
			}
		}
	}
}

UserBooks.propTypes = {
	auth: PropTypes.object,
	reloadTickets: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps, { reloadTickets, setAlert })(UserBooks)
