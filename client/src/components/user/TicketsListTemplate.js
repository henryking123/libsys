import React, { Component } from 'react'
import { Label, Header, Table, Item } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class Tickets extends Component {
	ribbon = (statusId, status) => {
		switch (statusId) {
			case 1:
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
				<Table basic="very" compact>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell width={1}>Status</Table.HeaderCell>
							<Table.HeaderCell>Book</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{tickets.map(({ book: { title }, statusId, status, history, _id }) => {
							const lastHistory = history[history.length - 1]
							return (
								<Table.Row key={_id}>
									<Table.Cell>{this.ribbon(statusId, status)}</Table.Cell>
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
														{lastHistory.status} by {lastHistory.by.name}
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
