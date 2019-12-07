// For admin listing all tickets
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Segment, Header, Item, Icon, Pagination } from 'semantic-ui-react'
import axios from 'axios'
import AdminTicketButtons from '../buttons/AdminTicketButtons'

export class AllTickets extends Component {
	state = { options: 1, data: {}, activePage: 1 }

	componentDidMount = async () => {
		const data = await this.getTickets(this.state.options)
		await this.setState({ data })
	}

	handleItemClick = async (e, { value }) => {
		const data = await this.getTickets(value)
		await this.setState({ options: value, data })
	}

	handlePaginationChange = async (e, { activePage }) => {
		await this.setState({ activePage })
		const data = await this.getTickets(this.state.options)
		await this.setState({ data })
	}

	getTickets = async (options) => {
		const res = await axios.get(`/tickets/all/${options}?page=${this.state.activePage}`)
		return res.data
	}

	onButtonClick = async () => {
		const data = await this.getTickets(this.state.options)
		await this.setState({ data })
	}

	renderList = () => {
		return this.state.data.docs.map((ticket) => {
			const { book, borrower, status } = ticket
			return (
				<Item key={ticket._id}>
					<Item.Image size="tiny" src="/thumbnail.png" />
					<Item.Content>
						<Item.Header>
							<Header as="h3">
								<Link to={`/tickets/${ticket._id}`}>{book.title}</Link>
							</Header>
						</Item.Header>
						<Item.Description>
							<em>User: </em>
							<Link to={`/users/${borrower._id}`}>{borrower.name}</Link>
						</Item.Description>
						<Item.Meta>
							<em>{status}</em>
						</Item.Meta>
						<Item.Extra>
							<AdminTicketButtons ticket={ticket} onButtonClick={this.onButtonClick} />
						</Item.Extra>
					</Item.Content>
				</Item>
			)
		})
	}

	render() {
		const { options, data, activePage } = this.state

		return (
			<div>
				<Menu pointing secondary>
					<Menu.Item
						onClick={this.handleItemClick}
						value={1}
						active={options === 1}
						name="For Pickup"
					/>
					<Menu.Item
						onClick={this.handleItemClick}
						value={2}
						active={options === 2}
						name="Pending (Borrow)"
					/>
					<Menu.Item
						onClick={this.handleItemClick}
						value={3}
						active={options === 3}
						name="Pending (Return)"
					/>
					<Menu.Item
						onClick={this.handleItemClick}
						value={4}
						active={options === 4}
						name="Active"
					/>
					<Menu.Item
						onClick={this.handleItemClick}
						value={0}
						active={options === 0}
						name="All Tickets"
					/>
				</Menu>
				<Segment>
					<Item.Group divided>
						{!data.docs || !Object.keys(data.docs).length ? (
							<Header as="h4" textAlign="center">
								No results found.
							</Header>
						) : (
							this.renderList()
						)}
					</Item.Group>
					{data.totalPages > 1 ? (
						<Pagination
							activePage={activePage}
							ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
							firstItem={{ content: <Icon name="angle double left" />, icon: true }}
							lastItem={{ content: <Icon name="angle double right" />, icon: true }}
							prevItem={{ content: <Icon name="angle left" />, icon: true }}
							nextItem={{ content: <Icon name="angle right" />, icon: true }}
							style={{ marginTop: '30px', marginBottom: '20px' }}
							totalPages={data.totalPages}
							onPageChange={this.handlePaginationChange}
							floated="right"
						/>
					) : (
						''
					)}
				</Segment>
			</div>
		)
	}
}

export default AllTickets
