import React, { Component } from 'react'
import { Button, Loader, Item, Label } from 'semantic-ui-react'
import moment from 'moment'
// Redux
import PropTypes from 'prop-types'
import { addToCart, removeFromCart } from '../../actions/cart'
import { connect } from 'react-redux'

class List extends Component {
	renderButton = (available, _id) => {
		if (this.props.auth.user.tickets.some(({ book }) => book._id === _id)) {
			return <Button floated="right" primary content="Borrowed" />
		} else if (this.props.cart.some((cart) => cart._id === _id)) {
			return (
				<Button
					floated="right"
					content="Remove from Cart"
					onClick={() => this.props.removeFromCart(_id)}
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
					onClick={() => this.props.addToCart(_id)}
					icon="right chevron"
					labelPosition="right"
				/>
			)
		}
	}

	renderAvailability = (available) => {
		if (!available) {
			return <Label color="red">0 left</Label>
		} else if (available < 5) {
			return <Label color="orange">Only {available} left</Label>
		}
	}

	render() {
		if (this.props.auth.loading) {
			return <Loader active inline="centered" />
		}
		return (
			<Item.Group divided>
				{this.props.books.map(({ title, author, yearPublished, available, _id }) => (
					<Item key={_id}>
						<Item.Image
							src="https://kbimages1-a.akamaihd.net/52c896b6-2750-4c3d-a844-0760f23117f9/353/569/90/False/how-to-study-smart-study-secrets-of-an-honors-student.jpg"
							size="tiny"
						/>

						<Item.Content verticalAlign="middle">
							<Item.Header as="a">{title}</Item.Header>

							<Item.Extra>
								{this.renderAvailability(available)}
								{author ? <Label>{author}</Label> : ''}
								{yearPublished ? <Label>{moment(yearPublished).format('YYYY')}</Label> : ''}
								{this.renderButton(available, _id)}
							</Item.Extra>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		)
	}
}

List.propTypes = {
	books: PropTypes.array.isRequired,
	addToCart: PropTypes.func.isRequired,
	removeFromCart: PropTypes.func.isRequired,
	cart: PropTypes.array,
	auth: PropTypes.object
}

const mapStateToProps = ({ cart, auth }) => ({ cart, auth })

export default connect(mapStateToProps, { addToCart, removeFromCart })(List)
