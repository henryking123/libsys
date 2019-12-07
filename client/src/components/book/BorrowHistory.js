import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Table, Header, Label, Icon, Pagination } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'

export class BorrowHistory extends Component {
	state = { tickets: [], data: {}, activePage: 1 }

	componentDidMount = async () => {
		this.search()
	}

	handlePaginationChange = async (e, { activePage }) => {
		await this.setState({ activePage })
		this.search()
	}

	search = async () => {
		const res = await axios.get(`/tickets/book/${this.props.book_id}?page=${this.state.activePage}`)
		await this.setState({ data: res.data, tickets: res.data.docs })
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

	render() {
		const { tickets, data, activePage } = this.state

		return (
			<React.Fragment>
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

				{data.totalPages > 1 ? (
					<Pagination
						activePage={activePage}
						ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
						firstItem={{ content: <Icon name="angle double left" />, icon: true }}
						lastItem={{ content: <Icon name="angle double right" />, icon: true }}
						prevItem={{ content: <Icon name="angle left" />, icon: true }}
						nextItem={{ content: <Icon name="angle right" />, icon: true }}
						style={{ marginTop: '20px', marginBottom: '20px' }}
						totalPages={data.totalPages}
						onPageChange={this.handlePaginationChange}
						floated="right"
					/>
				) : null}
			</React.Fragment>
		)
	}
}

BorrowHistory.propTypes = {
	book_id: PropTypes.string.isRequired
}

export default BorrowHistory
