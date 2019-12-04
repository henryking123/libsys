import React, { Component } from 'react'
import { connect } from 'react-redux'
import { removeFromCart, addToCart } from '../../actions/cart'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

export class CartButtons extends Component {
	render() {
		const { available, _id } = this.props.book
		const { cart, removeFromCart, addToCart } = this.props

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
				<Button
					positive
					floated="right"
					content="Add To Cart"
					onClick={() => addToCart(_id)}
					icon="right chevron"
					labelPosition="right"
				/>
			)
		}
	}
}

CartButtons.propTypes = {
	removeFromCart: PropTypes.func.isRequired,
	addToCart: PropTypes.func.isRequired,
	cart: PropTypes.array,
	book: PropTypes.object.isRequired
}

const mapStateToProps = ({ cart }) => ({ cart })

export default connect(mapStateToProps, { removeFromCart, addToCart })(CartButtons)
