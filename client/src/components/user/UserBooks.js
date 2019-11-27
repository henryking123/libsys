import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Loader, Item, Button, Icon, Table, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class UserBooks extends Component {
	render() {
		const { user } = this.props.auth

		if (user) {
			if (user.books.length > 0) {
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
								{user.books.map(({ book: { title }, sort_order, status, event_logs, _id }) => {
									return (
										<Table.Row key={_id}>
											<Table.Cell>{this.ribbon(sort_order, status)}</Table.Cell>
											<Table.Cell>
												<Item>
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
													</Item.Content>
												</Item>
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
