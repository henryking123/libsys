import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Header, Item, Label, List } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export class UserList extends Component {
	render() {
		const { users } = this.props

		if (users.length === 0)
			return (
				<Header as="h3" style={{ textAlign: 'center', marginTop: '20px' }}>
					No results found.
				</Header>
			)
		console.log(users)
		return (
			<Item.Group>
				{users.map(({ _id, employeeId, studentId, email, name, isAdmin }) => (
					<Item key={_id}>
						<Item.Image size="tiny" src="/thumbnail.png" />

						<Item.Content>
							<Item.Header as={Link} to={`/profile/${_id}`}>
								{name}
								{isAdmin ? (
									<Label color="green" horizontal style={{ marginLeft: '8px' }}>
										Admin
									</Label>
								) : null}
							</Item.Header>
							<Item.Meta>
								<List>
									<List.Item>
										<List.Icon name="id card" />
										<List.Content>
											{isAdmin ? (
												<React.Fragment>
													<em>Employee ID:</em> {employeeId}
												</React.Fragment>
											) : (
												<React.Fragment>
													<em>Student ID:</em> {studentId}
												</React.Fragment>
											)}
										</List.Content>
									</List.Item>
									<List.Item>
										<List.Icon name="at"></List.Icon>
										<List.Content>
											<em>Email:</em> <a href={`mailto:${email}`}>{email}</a>
										</List.Content>
									</List.Item>
								</List>
							</Item.Meta>
							<Item.Description></Item.Description>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		)
	}
}

UserList.propTypes = {
	users: PropTypes.array.isRequired
}

UserList.defaultProps = {
	users: []
}

export default UserList
