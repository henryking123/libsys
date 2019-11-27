import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Loader, Item, Button, Label, Table, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class UserBooks extends Component {
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

	renderButtons = (sort_order, _id) => {
		switch (sort_order) {
			case 1:
				return (
					// For Pick Up
					<Item.Extra>
						<Button floated="left" icon="close" labelPosition="left" content="Cancel Pick Up" />
					</Item.Extra>
				)
			case 2:
				return (
					// Pending Borrow
					<Item.Extra>
						<Button
							floated="left"
							icon="close"
							labelPosition="left"
							content="Cancel Borrow Request"
						/>
					</Item.Extra>
				)
			case 3:
				// Pending Return
				return (
					<Item.Extra>
						<Button
							floated="left"
							icon="close"
							labelPosition="left"
							content="Cancel Return Request"
						/>
					</Item.Extra>
				)
			case 4:
				// Borrowed/Active
				return (
					<Item.Extra>
						<Button
							floated="left"
							icon="right chevron"
							positive
							labelPosition="left"
							content="Return Book"
						/>
					</Item.Extra>
				)
			default:
				return
		}
	}

	render() {
		const { user } = this.props.auth

		if (user) {
			if (user.tickets.length > 0) {
				return (
					<div>
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
								{user.tickets.map(({ book: { title }, sort_order, status, event_logs, _id }) => {
									return (
										<Table.Row key={_id}>
											<Table.Cell>{this.ribbon(sort_order, status)}</Table.Cell>
											<Table.Cell>
												<Item.Group relaxed>
													<Item>
														<Item.Image size="tiny" src="/thumbnail.png" />
														<Item.Content>
															<Item.Header>
																<Header as="h3">
																	<Link to={`/tickets/${_id}`}>{title}</Link>
																</Header>
															</Item.Header>
															<Item.Description>
																<em>
																	{event_logs[event_logs.length - 1].status} by{' '}
																	{event_logs[event_logs.length - 1].by.name}
																</em>
															</Item.Description>
															{this.renderButtons(sort_order, _id)}
														</Item.Content>
													</Item>
												</Item.Group>
											</Table.Cell>
										</Table.Row>
									)
								})}
							</Table.Body>
						</Table>
					</div>
				)
			} else {
				return <div>bye</div>
			}
		}
		return <Loader active inline="centered" />
	}
}

UserBooks.propTypes = {
	auth: PropTypes.object
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(UserBooks)
