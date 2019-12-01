// For user viewing their own tickets
import React, { Component } from 'react'
import { connect } from 'react-redux'
import TicketList from '../tickets/TicketListTemplate'
import PropTypes from 'prop-types'
import { Loader, Grid } from 'semantic-ui-react'
import { reloadTickets } from '../../actions/auth'
import axios from 'axios'

export class UserTickets extends Component {
	state = { tickets: [] }
	componentDidMount = async () => {
		const res = await axios.get('/tickets/all')
		await this.setState({ tickets: res.data })
	}

	// Only return active tickets
	render() {
		console.log(this.state.tickets)
		if (!this.props.auth.loading) {
			return (
				<Grid centered columns={2}>
					<Grid.Column>
						<TicketList tickets={this.state.tickets} />
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

export default connect(mapStateToProps, { reloadTickets })(UserTickets)
