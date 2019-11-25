// For admin listing all tickets
import React, { Component, createRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Segment, Sticky, Header, Item, Button, Icon } from 'semantic-ui-react'
import axios from 'axios'

export class AllTickets extends Component {
	state = { options: 1, tickets: [] }
	contextRef = createRef()

	componentDidMount = async () => {
		const tickets = await this.getTickets(this.state.options)
		await this.setState({ tickets })
	}

	handleItemClick = async (e, { value }) => {
		const tickets = await this.getTickets(value)
		await this.setState({ options: value, tickets })
		console.log(this.state.tickets)
	}

	getTickets = async (options) => {
		const res = await axios.get(`/tickets/${options}`)
		const tickets = res.data
		return tickets
	}

	render() {
		const { options } = this.state

		return (
			<div ref={this.contextRef}>
				<Sticky context={this.contextRef}>
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
							value={0}
							active={options === 0}
							name="All Tickets"
						/>
					</Menu>
				</Sticky>
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
										{sort_order === 2 || sort_order === 3 ? (
											<Item.Extra>
												<Button positive floated="left">
													<Icon name="check" /> Accept
												</Button>
												<Button negative floated="left">
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

export default AllTickets
