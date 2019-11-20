import React, { Component } from 'react'
import axios from 'axios'
import Profile from './ProfileTemplate'
import TicketsList from './TicketsListTemplate'
import { connect } from 'react-redux'
import { Loader, Grid } from 'semantic-ui-react'
import PropTypes from 'prop-types'

class User extends Component {
	state = { user: {}, loading: true }

	componentDidMount = async () => {
		// Check if there's a param
		if (this.props.match.params.user_id) {
			// > Get user's account if so
			const res = await axios.get(`/user/${this.props.match.params.user_id}`)
			await this.setState({ user: res.data, loading: false })
		}
	}

	render() {
		if (!this.props.match.params.user_id && !this.props.auth.loading) {
			// Pass user from redux instead
			console.log('props', this.props.auth.user)
			return (
				<Grid>
					<Grid.Row>
						<Grid.Column width={5}>
							<Profile user={this.props.auth.user} />
						</Grid.Column>
						<Grid.Column width={5}>
							<TicketsList tickets={this.props.auth.user.tickets} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			)
		} else if (!this.state.loading) {
			console.log('state', this.state.user)

			return (
				<Grid>
					<Grid.Row>
						<Grid.Column width={5}>
							<Profile user={this.state.user} />
						</Grid.Column>
						<Grid.Column width={5}>
							<TicketsList tickets={this.state.user.tickets} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			)
		}
		return <Loader active inline="centered" />
	}
}

User.propTypes = {
	match: PropTypes.object,
	auth: PropTypes.object
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(User)
