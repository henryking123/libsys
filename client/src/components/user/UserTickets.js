// For user viewing their own tickets
import React, { Component } from 'react'
import { connect } from 'react-redux'
import TicketList from '../tickets/TicketListTemplate'
import PropTypes from 'prop-types'
import { Loader, Grid } from 'semantic-ui-react'

export class UserTickets extends Component {
	// Only return active tickets
	render() {
		if (!this.props.auth.loading) {
			return (
				<Grid centered columns={2}>
					<Grid.Column>
						<TicketList tickets={this.props.auth.user.tickets} />
					</Grid.Column>
				</Grid>
			)
		}

		return <Loader active inline="centered" />
	}
}

UserTickets.propTypes = {
	auth: PropTypes.object
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(UserTickets)
