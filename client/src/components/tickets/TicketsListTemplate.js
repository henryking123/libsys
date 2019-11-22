import React, { Component } from 'react'
import { Label, Header, Table, Item } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class Tickets extends Component {
	ribbon = (sort_order, status) => {
		switch (sort_order) {
			case 2:
				return (
					<Label ribbon color="green">
						{status}
					</Label>
				)
			default:
				return
		}
	}

	render() {
		const { tickets } = this.props

		return (
			<div>
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell width={2} textAlign="center">
								Status
							</Table.HeaderCell>
							<Table.HeaderCell width={14}>Book</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{tickets.map(({ book: { title }, sort_order, status, event_logs, _id }) => {
							const lastEvent = event_logs[event_logs.length - 1]
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
														{lastEvent.status} by {lastEvent.by.name}
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
	}
}

Tickets.propTypes = {
	tickets: PropTypes.array.isRequired
}

export default Tickets
