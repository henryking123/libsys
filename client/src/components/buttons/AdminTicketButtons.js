import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import { Button, Icon } from 'semantic-ui-react'
import axios from 'axios'

class AdminTicketButtons extends Component {
	acceptTicket = async (ticket_id) => {
		try {
			const res = await axios.post('/tickets/accept', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			this.props.onButtonClick()
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			this.props.onButtonClick()
		}
	}

	declineTicket = async (ticket_id) => {
		try {
			const res = await axios.post('/tickets/decline', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			this.props.onButtonClick()
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			this.props.onButtonClick()
		}
	}

	render() {
		if (!this.props.auth.user.isAdmin) return null
		const { sort_order, _id } = this.props.ticket
		if (sort_order === 1 || sort_order === 2 || sort_order === 3)
			return (
				<React.Fragment>
					<Button positive floated="left" onClick={() => this.acceptTicket(_id)}>
						<Icon name="check" /> Accept
					</Button>
					<Button negative floated="left" onClick={() => this.declineTicket(_id)}>
						<Icon name="close" /> Decline
					</Button>
				</React.Fragment>
			)
		return null
	}
}

AdminTicketButtons.propTypes = {
	auth: PropTypes.object.isRequired,
	onButtonClick: PropTypes.func.isRequired,
	ticket: PropTypes.object.isRequired
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps, { setAlert })(AdminTicketButtons)
