import React, { Component } from 'react'
import { Form, Message, Button, Icon } from 'semantic-ui-react'
import { Link, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { loginUser, logoutAll } from '../../actions/auth'
import PropTypes from 'prop-types'

class Login extends Component {
	state = { email: '', password: '' }

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value })
	}

	onSubmit = (e) => {
		e.preventDefault()
		this.props.loginUser(
			{ email: this.state.email, password: this.state.password },
			this.props.history
		)
	}

	render() {
		// For redirecting when already logged in
		if (this.props.isAuthenticated) return <Redirect to="/books" />

		return (
			<React.Fragment>
				<Message attached header="Log in as a User!" content="Fill out the form below to login." />
				<Form className="attached fluid segment" onSubmit={(e) => this.onSubmit(e)}>
					<Form.Input
						label="Email"
						name="email"
						onChange={this.handleChange}
						value={this.state.email}
						placeholder="johndoe@gmail.com"
						required
						type="email"
					/>
					<Form.Input
						label="Password"
						name="password"
						onChange={this.handleChange}
						value={this.state.password}
						placeholder="********"
						type="password"
						minLength={7}
						required
					/>

					<Button color="blue">Login</Button>
				</Form>
				<Message attached="bottom" warning>
					<Icon name="help" />
					Don't have an account? <Link to="/register">Register here</Link> instead.
				</Message>
				{/* For testing */}
				{/* <Button color="red" onClick={this.props.logoutAll}>
					Logout
				</Button> */}
			</React.Fragment>
		)
	}
}

Login.propTypes = {
	isAuthenticated: PropTypes.bool,
	loginUser: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
}

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({ isAuthenticated })

export default connect(mapStateToProps, { loginUser, logoutAll })(withRouter(Login))
