import React, { Component } from 'react'
import axios from 'axios'
import { Button, Icon, Item, Label } from 'semantic-ui-react'
import moment from 'moment'
import PropTypes from 'prop-types'

// Change the button of those that are already in cart or already in tickets
class List extends Component {
	addToCart = async (_id) => {
		await axios.post(`/cart/${_id}`)
	}

	render() {
		return (
			<Item.Group divided>
				{this.props.books.map(({ title, author, yearPublished, available, description, _id }) => (
					<Item key={_id}>
						<Item.Image
							src="https://kbimages1-a.akamaihd.net/52c896b6-2750-4c3d-a844-0760f23117f9/353/569/90/False/how-to-study-smart-study-secrets-of-an-honors-student.jpg"
							size="small"
						/>

						<Item.Content verticalAlign="middle">
							<Item.Header as="a">{title}</Item.Header>

							<Item.Extra>
								{(!available && <Label color="red">Not available</Label>) ||
									(available < 5 && <Label color="orange">Only {available} left</Label>)}
								{author && <Label>{author}</Label>}
								{yearPublished && <Label>{moment(yearPublished).format('YYYY')}</Label>}
								{(!available && (
									<Button primary disabled floated="right">
										Add to Cart <Icon name="right chevron" />
									</Button>
								)) || (
									<Button
										primary
										floated="right"
										loading={false}
										onClick={() => this.addToCart(_id)}
									>
										Add to Cart <Icon name="right chevron" />
									</Button>
								)}
							</Item.Extra>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		)
	}
}

List.propTypes = {
	books: PropTypes.array.isRequired
}

export default List
