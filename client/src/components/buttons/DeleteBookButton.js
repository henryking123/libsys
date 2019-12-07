import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

export class EditBookButtons extends Component {
	onClick = (book_id) => {
		console.log(book_id)
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
	floated: PropTypes.string
}

EditBookButtons.defaultProps = {
	floated: null
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(EditBookButtons)
