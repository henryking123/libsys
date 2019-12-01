// For admin listing all tickets
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Segment, Header, Item, Button, Icon } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import PropTypes from 'prop-types'

export class AllTickets extends Component {
	state = { options: 1, tickets: [] }

	componentDidMount = async () => {
		const tickets = await this.getTickets(this.state.options)
		await this.setState({ tickets })
	}

	handleItemClick = async (e, { value }) => {
		const tickets = await this.getTickets(value)
		await this.setState({ options: value, tickets })
	}

	getTickets = async (options) => {
		const res = await axios.get(`/tickets/all/${options}`)
		const tickets = res.data
		return tickets
	}

	acceptTicket = async (ticket_id) => {
		try {
			const res = await axios.post('/tickets/accept', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			const tickets = await this.getTickets(this.state.options)
			await this.setState({ tickets })
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			const tickets = await this.getTickets(this.state.options)
			await this.setState({ tickets })
		}
	}

	declineTicket = async (ticket_id) => {
		try {
			const res = await axios.post('/tickets/decline', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			const tickets = await this.getTickets(this.state.options)
			await this.setState({ tickets })
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			const tickets = await this.getTickets(this.state.options)
			await this.setState({ tickets })
		}
	}

	render() {
		const { options } = this.state

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
						{this.state.tickets.map(
							({ _id, book: { title }, borrower: { name, id: user_id }, sort_order, status }) => (
								<Item key={_id}>
									<Item.Image size="tiny" src="/thumbnail.png" />
									<Item.Content>
										<Item.Header>
											<Header as="h3">
												<Link to={`/tickets/${_id}`}>{title}</Link>
											</Header>
										</Item.Header>
										<Item.Description>
											<em>User: </em>
											<Link to={`/users/${user_id}`}>{name}</Link>
										</Item.Description>
										<Item.Meta>
											<em>{status}</em>
										</Item.Meta>
										{sort_order === 1 || sort_order === 2 || sort_order === 3 ? (
											<Item.Extra>
												<Button positive floated="left" onClick={() => this.acceptTicket(_id)}>
													<Icon name="check" /> Accept
												</Button>
												<Button negative floated="left" onClick={() => this.declineTicket(_id)}>
													<Icon name="close" /> Decline
												</Button>
											</Item.Extra>
										) : (
											''
										)}
									</Item.Content>
								</Item>
							)
						)}
					</Item.Group>
				</Segment>
			</div>
		)
	}
}

AllTickets.propTypes = {
	setAlert: PropTypes.func.isRequired
}

export default connect(null, { setAlert })(AllTickets)
