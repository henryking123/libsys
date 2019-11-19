import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Label, Item, Table, Checkbox, Button, Icon } from 'semantic-ui-react'
import { loadCart, removeFromCart, borrowBooks } from '../../actions/cart'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'

class Cart extends Component {
	state = { checkedItems: {}, selectedAll: true, allowCheckout: false }

	async componentDidMount() {
		await this.props.loadCart()
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
			if (available > 0) {
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
		this.props.borrowBooks({ checkoutItems, history: this.props.history })
	}

	render() {
		const { checkedItems } = this.state
		return (
			<Table celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell textAlign="center" width={2}>
							<Checkbox
								label="Select All"
								onClick={this.selectAll}
								checked={this.state.selectedAll}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Book</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{this.props.cart.map(({ title, author, yearPublished, available, _id }) => (
						<Table.Row key={_id} negative={!available}>
							<Table.Cell collapsing textAlign="center">
								{(!available && (
									<Label ribbon color="red">
										Not Available
									</Label>
								)) || <Checkbox checked={checkedItems[_id]} onChange={() => this.onChange(_id)} />}
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
											<Item.Extra>
												<Button
													icon="trash alternate"
													negative
													floated="right"
													alt="Remove from Cart"
													onClick={() => this.props.removeFromCart(_id)}
												/>
											</Item.Extra>
										</Item.Content>
									</Item>
								</Item.Group>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>

				<Table.Footer fullWidth>
					<Table.Row>
						<Table.HeaderCell />
						<Table.HeaderCell>
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
	removeFromCart: PropTypes.func.isRequired,
	borrowBooks: PropTypes.func.isRequired,
	cart: PropTypes.array.isRequired
}

const mapStateToProps = ({ cart }) => ({ cart })

export default connect(mapStateToProps, { loadCart, removeFromCart, borrowBooks })(withRouter(Cart))
