import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'

const AdminRoute = ({ component: Component, isAuthenticated, loading, user, ...rest }) => {
	if (!loading) {
		return (
			<Route
				{...rest}
				render={(props) => {
					if (isAuthenticated && user.isAdmin) {
						return <Component {...props} />
					} else {
						return <Redirect to="/login" />
					}
				}}
				// User not logged in = Redirect to login
				// User not admin = Redirect to login = Redirect to /books
			/>
		)
	}

	return <Loader active inline="centered" />
}

AdminRoute.propTypes = {
	user: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired
}

const mapStatetoProps = ({ auth: { isAuthenticated, loading, user } }) => ({
	isAuthenticated,
	loading,
	user
})

export default connect(mapStatetoProps)(AdminRoute)
