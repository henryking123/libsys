import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon, Item, Label, Image, Table, Checkbox } from 'semantic-ui-react'
import moment from 'moment'
import { loadCart } from '../../actions/cart'
import PropTypes from 'prop-types'

class Cart extends Component {
	componentDidMount() {
		this.props.loadCart()
	}

	// Toggle, onClick, add/remove item to state

	render() {
		return (
			<Table compact celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell textAlign="center">
							<Checkbox label="Select All" />
						</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Title</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Author</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">Year Published</Table.HeaderCell>
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
								)) || <Checkbox />}
							</Table.Cell>
							<Table.Cell>
								<Image
									src="https://kbimages1-a.akamaihd.net/52c896b6-2750-4c3d-a844-0760f23117f9/353/569/90/False/how-to-study-smart-study-secrets-of-an-honors-student.jpg"
									size="mini"
									spaced
								/>
								{title}
							</Table.Cell>
							<Table.Cell>{author}</Table.Cell>
							<Table.Cell>{yearPublished}</Table.Cell>
						</Table.Row>
						// <Item key={_id}>

						// 	<Item.Content verticalAlign="middle">
						// 		{(!available && (
						// 			<Header as="h3" color="red">
						// 				{title}
						// 			</Header>
						// 		)) || <Header as="h3">{title}</Header>}

						// 		<Item.Extra>
						// 			{(!available && <Label color="red">Not available</Label>) ||
						// 				(available < 5 && <Label color="orange">Only {available} left</Label>)}
						// 			{author && <Label>{author}</Label>}
						// 			{yearPublished && <Label>{moment(yearPublished).format('YYYY')}</Label>}
						// 			{/* {(this.props.cart.some((cart) => cart._id === _id) && (
						// 		<Button positive floated="right">
						// 			In Cart <Icon name="right shopping cart" />
						// 		</Button>
						// 	)) ||
						// 		(!available && (
						// 			<Button primary disabled floated="right">
						// 				Add to Cart <Icon name="right chevron" />
						// 			</Button>
						// 		)) || (
						// 			<Button
						// 				primary
						// 				floated="right"
						// 				loading={false}
						// 				onClick={() => this.props.addToCart(_id)}
						// 			>
						// 				Add to Cart <Icon name="right chevron" />
						// 			</Button>
						// 		)} */}
						// 		</Item.Extra>
						// 	</Item.Content>
						// </Item>
					))}
				</Table.Body>
			</Table>
		)
	}
}

Cart.propTypes = {
	loadCart: PropTypes.func.isRequired,
	cart: PropTypes.array.isRequired
}

const mapStateToProps = ({ cart }) => ({ cart })

export default connect(
	mapStateToProps,
	{ loadCart }
)(Cart)
