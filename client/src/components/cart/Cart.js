import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Label, Item, Table, Checkbox, Button, Icon } from 'semantic-ui-react'
import { loadCart, removeFromCart, checkout } from '../../actions/cart'
import { loadUser } from '../../actions/auth'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'

class Cart extends Component {
	state = { checkedItems: {}, selectedAll: true, allowCheckout: false }

	async componentDidMount() {
		await this.props.loadCart()
		await this.props.loadUser()
		// Initializes all items into checkedItems with value of false
		this.selectAll()
	}

	onChange = async (id) => {
		await this.setState({
			checkedItems: { ...this.state.checkedItems, [id]: !this.state.checkedItems[id] }
		})
		// Checks if all IDs are checked
		// Returns true if a check box is unchecked
		// Returns false if all check box is checked
		const found = Object.keys(this.state.checkedItems).some(
			(id) => this.state.checkedItems[id] === false
		)
		// Unchecks selectAll if there is an unchecked box and selectAll is checked
		// Checks selectAll if all boxes are checked and selectAll is unchecked
		if (this.state.selectedAll === found) this.setState({ selectedAll: !found })

		this.toggleCheckout()
	}

	selectAll = async () => {
		let items = {}
		this.props.cart.forEach(({ id, available }) => {
			if (available > 0 && !this.props.auth.user.tickets.some(({ book }) => book._id === id)) {
				items = { ...items, [id]: !this.state.selectedAll }
			}
		})
		await this.setState({ checkedItems: items, selectedAll: !this.state.selectedAll })

		this.toggleCheckout()
	}

	toggleCheckout = () => {
		// Disables checkout button when no book is selected
		this.setState({
			allowCheckout: Object.keys(this.state.checkedItems).some(
				(id) => this.state.checkedItems[id] === true
			)
		})
	}

	checkout = () => {
		const checkoutItems = []
		Object.keys(this.state.checkedItems).forEach((id) => {
			if (this.state.checkedItems[id] === true) checkoutItems.push(id)
		})
		this.props.checkout({ checkoutItems, history: this.props.history })
	}

	render() {
		const { checkedItems } = this.state

		return (
			<Table celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell textAlign="center" width={1} singleLine>
							<Checkbox
								label="Select All"
								onClick={this.selectAll}
								checked={this.state.selectedAll}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell textAlign="center" colSpan="2">
							Book
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{this.props.cart.map(({ title, author, yearPublished, available, _id }) => (
						<Table.Row
							key={_id}
							negative={
								!available || this.props.auth.user.tickets.some(({ book }) => book._id === _id)
							}
						>
							<Table.Cell textAlign="center" collapsing>
								{/* Check if available and if user doesn't have a ticket for it */}
								{this.props.auth.user.tickets.some(({ book }) => book._id === _id) ? (
									<Label ribbon color="blue">
										Borrowed
									</Label>
								) : available ? (
									<Checkbox checked={checkedItems[_id]} onChange={() => this.onChange(_id)} />
								) : (
									<Label ribbon color="red">
										Not Available
									</Label>
								)}
							</Table.Cell>
							<Table.Cell>
								<Item.Group>
									<Item>
										<Item.Image
											size="tiny"
											src="https://react.semantic-ui.com/images/wireframe/image.png"
										/>

										<Item.Content verticalAlign="middle">
											<Item.Header>{title}</Item.Header>
											<Item.Meta>
												{available !== 0 && available < 5 && (
													<Label color="orange">Only {available} left</Label>
												)}
												{author ? <Label>{author}</Label> : ''}
												{yearPublished ? <Label>{moment(yearPublished).format('YYYY')}</Label> : ''}
											</Item.Meta>
											<Item.Extra></Item.Extra>
										</Item.Content>
									</Item>
								</Item.Group>
							</Table.Cell>
							<Table.Cell collapsing>
								<Button
									icon="trash alternate"
									negative
									alt="Remove from Cart"
									onClick={() => this.props.removeFromCart(_id)}
									style={{ margin: '0' }}
								/>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>

				<Table.Footer>
					<Table.Row>
						<Table.HeaderCell />
						<Table.HeaderCell colSpan="2">
							<Button
								color="green"
								size="small"
								disabled={!this.state.allowCheckout}
								onClick={this.checkout}
							>
								<Icon name="shopping cart" /> Borrow
							</Button>
							<Link to="/books/search">
								<Button size="small">Cancel</Button>
							</Link>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Footer>
			</Table>
		)
	}
}

Cart.propTypes = {
	loadCart: PropTypes.func.isRequired,
	loadUser: PropTypes.func.isRequired,
	removeFromCart: PropTypes.func.isRequired,
	checkout: PropTypes.func.isRequired,
	cart: PropTypes.array.isRequired,
	history: PropTypes.object.isRequired,
	auth: PropTypes.object
}

const mapStateToProps = ({ cart, auth }) => ({ cart, auth })

export default connect(mapStateToProps, { loadCart, removeFromCart, checkout, loadUser })(
	withRouter(Cart)
)
