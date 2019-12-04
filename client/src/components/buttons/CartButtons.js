import React, { Component } from 'react'
import { connect } from 'react-redux'
import { removeFromCart, addToCart, checkout } from '../../actions/cart'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

export class CartButtons extends Component {
	render() {
		const { available, _id } = this.props.book
		const { cart, removeFromCart, addToCart, checkout, history } = this.props

		if (cart.some((cart) => cart._id === _id)) {
			return (
				<Button
					floated="right"
					content="Remove from Cart"
					onClick={() => removeFromCart(_id)}
					icon="trash"
					labelPosition="right"
				/>
			)
		} else if (!available) {
			return <Button negative floated="right" content="Not Available" />
		} else {
			return (
				<React.Fragment>
					{/* Make Color Yellow */}
					<Button
						positive
						floated="right"
						content="Borrow Now"
						onClick={() => checkout({ checkoutItems: [_id], history: history })}
						icon="right chevron"
						labelPosition="right"
					/>
					<Button
						positive
						floated="right"
						content="Add To Cart"
						onClick={() => addToCart(_id)}
						icon="right chevron"
						labelPosition="right"
					/>
				</React.Fragment>
			)
		}
	}
}

CartButtons.propTypes = {
	removeFromCart: PropTypes.func.isRequired,
	addToCart: PropTypes.func.isRequired,
	checkout: PropTypes.func.isRequired,
	cart: PropTypes.array,
	book: PropTypes.object.isRequired
}

const mapStateToProps = ({ cart }) => ({ cart })

export default connect(mapStateToProps, { removeFromCart, addToCart, checkout })(
	withRouter(CartButtons)
)
