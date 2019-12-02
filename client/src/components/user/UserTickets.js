// For user viewing their own tickets
import React, { Component } from 'react'
import { connect } from 'react-redux'
import TicketList from '../tickets/TicketListTemplate'
import PropTypes from 'prop-types'
import { Grid, Pagination, Icon } from 'semantic-ui-react'
import { reloadTickets } from '../../actions/auth'
import axios from 'axios'

export class UserTickets extends Component {
	state = { data: {}, activePage: 1 }

	componentDidMount = () => {
		this.search()
	}

	handlePaginationChange = async (e, { activePage }) => {
		await this.setState({ activePage })
		this.search()
	}

	search = async () => {
		const res = await axios.get(`/tickets/all?page=${this.state.activePage}`)
		await this.setState({ data: res.data })
	}

	// Only return active tickets
	render() {
		const { data, activePage } = this.state

		return (
			<Grid centered columns={2}>
				<Grid.Column>
					{data.docs ? (
						<React.Fragment>
							<TicketList tickets={this.state.data.docs} />
							{data.totalPages > 1 ? (
								<Pagination
									activePage={activePage}
									ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
									firstItem={{ content: <Icon name="angle double left" />, icon: true }}
									lastItem={{ content: <Icon name="angle double right" />, icon: true }}
									prevItem={{ content: <Icon name="angle left" />, icon: true }}
									nextItem={{ content: <Icon name="angle right" />, icon: true }}
									style={{ marginTop: '20px' }}
									totalPages={data.totalPages}
									onPageChange={this.handlePaginationChange}
									floated="right"
								/>
							) : (
								''
							)}
						</React.Fragment>
					) : (
						''
					)}
				</Grid.Column>
			</Grid>
		)
	}
}

UserTickets.propTypes = {
	reloadTickets: PropTypes.func.isRequired
}

export default connect(null, { reloadTickets })(UserTickets)
