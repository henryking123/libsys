import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const AdminRoute = ({
	component: Component,
	auth: { isAuthenticated, loading, user } = {},
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				if (isAuthenticated && !loading && user.isAdmin) {
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

AdminRoute.propTypes = {
	auth: PropTypes.object.isRequired
}

const mapStatetoProps = ({ auth }) => ({ auth })

export default connect(mapStatetoProps)(AdminRoute)
