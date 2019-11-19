import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logoutUser } from '../../actions/auth'
import { Container, Button, Image, Menu, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const Navbar = ({ loading, isAuthenticated, logoutUser }) => {
	const logout = () => {
		logoutUser()
	}

	return (
		<Menu fixed="top" inverted borderless>
			<Container>
				<Link to="/books/search">
					<Menu.Item header>
						<Image size="mini" src="/logo.png" style={{ marginRight: '1.5em' }} />
						LibSys
					</Menu.Item>
				</Link>

				<Menu.Item position="right">
					{!loading ? (
						isAuthenticated ? (
							<Button as="a" inverted onClick={logout}>
								Log Out
							</Button>
						) : (
							<React.Fragment>
								<Link to="/register">
									<Button inverted>Sign Up</Button>
								</Link>
								<Link to="/login" style={{ marginLeft: '0.5em' }}>
									<Button inverted>Log In</Button>
								</Link>
							</React.Fragment>
						)
					) : (
						<Loader active inline />
					)}
				</Menu.Item>
			</Container>
		</Menu>
	)
}

Navbar.propTypes = {
	loading: PropTypes.bool.isRequired,
	isAuthenticated: PropTypes.bool
}

const mapStateToProps = ({ auth: { loading, isAuthenticated } }) => ({ loading, isAuthenticated })

export default connect(mapStateToProps, { logoutUser })(Navbar)
