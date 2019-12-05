import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import axios from 'axios'
import { setAlert } from '../../actions/alert'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class ActiveTicketButtons extends Component {
	cancelTicket = async (ticket_id) => {
		try {
			// Send to cancel route
			const res = await axios.post('/tickets/cancel', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			// Reload Ticket
			this.props.onButtonClick()
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			this.props.onButtonClick()
		}
	}

	returnTicket = async (ticket_id) => {
		try {
			// Send to return route
			const res = await axios.post('/tickets/return', { ticket_id })
			this.props.setAlert(res.data, 'positive')
			this.props.onButtonClick()
		} catch (e) {
			this.props.setAlert({ header: 'Process failed.', content: e.response.data }, 'negative')
			this.props.onButtonClick()
		}
	}

	render() {
		const { sort_order, _id } = this.props.ticket
		switch (sort_order) {
			case 1:
				return (
					// For Pick Up
					<Button
						floated="right"
						icon="close"
						labelPosition="left"
						content="Cancel Pick Up"
						onClick={() => this.cancelTicket(_id)}
					/>
				)
			case 2:
				return (
					// Pending Borrow
					<Button
						floated="right"
						icon="close"
						labelPosition="left"
						content="Cancel Borrow Request"
						onClick={() => this.cancelTicket(_id)}
					/>
				)
			case 3:
				// Pending Return
				return (
					<Button
						floated="right"
						icon="close"
						labelPosition="left"
						content="Cancel Return Request"
						onClick={() => this.cancelTicket(_id)}
					/>
				)
			case 4:
				// Borrowed/Active
				return (
					<Button
						floated="right"
						icon="right chevron"
						positive
						labelPosition="left"
						content="Return Book"
						onClick={() => this.returnTicket(_id)}
					/>
				)
			default:
				return null
		}
	}
}

ActiveTicketButtons.propTypes = {
	setAlert: PropTypes.func.isRequired,
	onButtonClick: PropTypes.func.isRequired,
	ticket: PropTypes.object.isRequired
}

export default connect(null, { setAlert })(ActiveTicketButtons)
