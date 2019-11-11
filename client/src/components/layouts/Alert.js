import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'

const Alert = ({ alerts }) =>
	alerts !== null &&
	alerts.length > 0 &&
	alerts.map((alert) => {
		const alertType = { [alert.alertType]: true }

		return (
			<Message {...alertType}>
				<Message.Header>{alert.msg.header !== null && alert.msg.header}</Message.Header>
				<p>{alert.msg.content}</p>
			</Message>
		)
	})

Alert.propTypes = {
	alerts: PropTypes.array.isRequired
}

const mapStateToProps = ({ alert }) => ({ alerts: alert })

export default connect(mapStateToProps)(Alert)
