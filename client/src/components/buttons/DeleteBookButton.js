import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Modal } from 'semantic-ui-react'
import axios from 'axios'
import { setAlert } from '../../actions/alert'

export class EditBookButtons extends Component {
	state = { modalOpen: false }

	handleOpen = () => this.setState({ modalOpen: true })

	handleClose = () => this.setState({ modalOpen: false })

	onDelete = async (book_id) => {
		try {
			const res = await axios.delete(`/books/${book_id}`)
			this.props.setAlert(res.data, 'positive')
			this.props.history.push('/books')
		} catch (e) {
			this.props.setAlert(
				{ header: 'Unable to delete the book.', content: e.response.data },
				'negative'
			)
			this.props.history.push(`/books/${this.props.book_id}`)
			this.handleClose()
		}
	}

	render() {
		const { book_id, book_title, auth, floated } = this.props

		if (auth.user.isAdmin)
			return (
				<Modal
					trigger={
						<Button
							type="button"
							icon="trash alternate"
							labelPosition="right"
							content="Delete Book"
							negative
							onClick={this.handleOpen}
							floated={floated}
						/>
					}
					open={this.state.modalOpen}
					onClose={this.handleClose}
					size="mini"
				>
					<Modal.Header>Delete Book</Modal.Header>
					<Modal.Content>
						<p>Are you sure you want to delete the book titled "{book_title}"?</p>
					</Modal.Content>
					<Modal.Actions>
						<Button negative onClick={this.handleClose}>
							No
						</Button>
						<Button
							positive
							icon="checkmark"
							labelPosition="right"
							content="Yes"
							onClick={() => this.onDelete(book_id)}
						/>
					</Modal.Actions>
				</Modal>
			)

		return null
	}
}

EditBookButtons.propTypes = {
	auth: PropTypes.object,
	book_id: PropTypes.string.isRequired,
	book_title: PropTypes.string.isRequired,
	floated: PropTypes.string,
	setAlert: PropTypes.func.isRequired
}

EditBookButtons.defaultProps = {
	floated: null
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps, { setAlert })(withRouter(EditBookButtons))
