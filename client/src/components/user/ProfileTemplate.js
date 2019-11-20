import React, { Component } from 'react'
import { Card, Image, Label, List } from 'semantic-ui-react'
import PropTypes from 'prop-types'

class Profile extends Component {
	render() {
		const { user } = this.props
		return (
			<div>
				<Card>
					<Image src="/profile-photo.jpg" wrapped ui={false} />
					<Card.Content>
						<Card.Header>{user.name}</Card.Header>
						<Card.Meta>
							{user.isAdmin ? (
								<Label color="green" horizontal size="small">
									Admin
								</Label>
							) : (
								<Label color="blue" horizontal size="small">
									Student
								</Label>
							)}
						</Card.Meta>
						<Card.Description>
							<List>
								<List.Item>
									<List.Icon name="id card" />
									<List.Content>
										{user.isAdmin ? (
											<React.Fragment>
												<em>Employee ID:</em> {user.employeeId}
											</React.Fragment>
										) : (
											<React.Fragment>
												<em>Student ID:</em> {user.studentId}
											</React.Fragment>
										)}
									</List.Content>
								</List.Item>
								<List.Item>
									<List.Icon name="at"></List.Icon>
									<List.Content>
										<em>Email:</em> <a href={`mailto:${user.email}`}>{user.email}</a>
									</List.Content>
								</List.Item>
							</List>
						</Card.Description>
					</Card.Content>
				</Card>
			</div>
		)
	}
}

Profile.propTypes = {
	user: PropTypes.object.isRequired
}

export default Profile
