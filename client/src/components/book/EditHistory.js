import React, { Component } from 'react'
import { Table, Loader } from 'semantic-ui-react'
import moment from 'moment'
import PropTypes from 'prop-types'

class EditHistory extends Component {
	render() {
		const { edit_history } = this.props

		return edit_history.length === 0 ? (
			<Loader active inline="centered" style={{ marginTop: '20px', marginBottom: '20px' }} />
		) : (
			<React.Fragment>
				<Table compact celled>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell colSpan="2">Book Edit History</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{edit_history.map(({ time, updatedBy: { name, email }, _id }) => (
							<Table.Row key={_id}>
								<Table.Cell collapsing>{moment(time).format('lll')}</Table.Cell>
								<Table.Cell>
									{name} | {email}
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</React.Fragment>
		)
	}
}

EditHistory.propTypes = {
	edit_history: PropTypes.array.isRequired
}

EditHistory.defaultProps = {
	edit_history: []
}

export default EditHistory
