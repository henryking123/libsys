import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import axios from 'axios'
import { setAlert } from '../../actions/alert'

export class EditBookButtons extends Component {
	onClick = async (book_id) => {
		try {
			const res = await axios.delete(`/books/${book_id}`)
			this.props.setAlert(res.data, 'positive')
			this.props.history.push('/books')
		} catch (e) {
			this.props.setAlert(
				{ header: 'Unable to delete the book.', content: e.response.data },
				'negative'
			)
		}
	}

	render() {
		const { book_id, auth, floated } = this.props

		if (auth.user.isAdmin)
			return (
				<React.Fragment>
					<Button
						type="button"
						icon="trash alternate"
						labelPosition="right"
						content="Delete Book"
						negative
						onClick={() => this.onClick(book_id)}
						floated={floated}
					/>
				</React.Fragment>
			)

		return null
	}
}

EditBookButtons.propTypes = {
	auth: PropTypes.object,
	book_id: PropTypes.string.isRequired,
	floated: PropTypes.string,
	setAlert: PropTypes.func.isRequired
}

EditBookButtons.defaultProps = {
	floated: null
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps, { setAlert })(withRouter(EditBookButtons))
