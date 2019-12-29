import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logoutUser } from '../../actions/auth'
import { Container, Button, Image, Menu, Loader, Dropdown, Icon } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'

const Navbar = ({ loading, isAuthenticated, logoutUser, history, user }) => {
	const logout = () => {
		logoutUser(history)
	}

	const adminRoutes = () =>
		user.isAdmin ? (
			<React.Fragment>
				<Dropdown item simple text="Admin">
					<Dropdown.Menu>
						<Dropdown.Item as={Link} to="/tickets">
							Manage Tickets
						</Dropdown.Item>
						<Dropdown.Item as={Link} to="/users">
							Search Users
						</Dropdown.Item>
						<Dropdown.Item as={Link} to="/books/add">
							Add New Book
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</React.Fragment>
		) : (
			''
		)

	return (
		<Menu fixed="top" inverted borderless>
			<Container>
				<Menu.Item header as={Link} to="/">
					<Image size="mini" src="/logo.png" style={{ marginRight: '1.5em' }} />
					LibSys
				</Menu.Item>

				{!loading ? (
					isAuthenticated ? (
						<React.Fragment>
							<Menu.Item as={Link} to="/books">
								Books
							</Menu.Item>

							<Menu.Item as={Link} to="/profile">
								Profile
							</Menu.Item>

							<Menu.Item as={Link} to="/my_books">
								My Books
							</Menu.Item>

							<Menu.Item as={Link} to="/my_tickets">
								My Tickets
							</Menu.Item>

							<Menu.Menu position="right">
								{adminRoutes()}

								<Menu.Item as={Link} to="/cart">
									<Icon name="shopping cart" />
									Cart
								</Menu.Item>

								<Menu.Item>
									<Button as="a" inverted onClick={logout}>
										Log Out
									</Button>
								</Menu.Item>
							</Menu.Menu>
						</React.Fragment>
					) : (
						<React.Fragment>
							<Menu.Menu position="right">
								<Menu.Item>
									<Button inverted as={Link} to="/register">
										Sign Up
									</Button>

									<Button inverted as={Link} to="/login" style={{ marginLeft: '0.5em' }}>
										Log In
									</Button>
								</Menu.Item>
							</Menu.Menu>
						</React.Fragment>
					)
				) : (
					<Menu.Item position="right">
						<Loader active inline />
					</Menu.Item>
				)}
			</Container>
		</Menu>
	)
}

Navbar.propTypes = {
	loading: PropTypes.bool.isRequired,
	isAuthenticated: PropTypes.bool,
	history: PropTypes.object.isRequired
}

const mapStateToProps = ({ auth: { loading, isAuthenticated, user } }) => ({
	loading,
	isAuthenticated,
	user
})

export default connect(mapStateToProps, { logoutUser })(withRouter(Navbar))
