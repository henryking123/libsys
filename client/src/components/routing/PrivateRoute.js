import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'

const PrivateRoute = ({
	component: Component,
	auth: { isAuthenticated, loading, user },
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				if (loading || !user) {
					return <Loader active inline="centered" />
				} else if (isAuthenticated) {
					return <Component {...props} />
				} else {
					return <Redirect to="/login" />
				}
			}}
		/>
	)
}

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired
}

const mapStatetoProps = ({ auth }) => ({ auth })

export default connect(mapStatetoProps)(PrivateRoute)
