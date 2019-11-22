import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Message, Icon, Button } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import { setAlert } from '../../actions/alert'
import PropTypes from 'prop-types'
import { registerUser } from '../../actions/auth'

class Register extends Component {
	state = { firstName: '', lastName: '', studentId: '', email: '', password: '', password2: '' }

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value })
	}

	onSubmit = (e) => {
		e.preventDefault()
		if (this.state.password !== this.state.password2)
			return this.props.setAlert(
				{ header: 'Please check something.', content: 'Passwords do not match' },
				'warning'
			)

		const name = `${this.state.firstName} ${this.state.lastName}`
		const newUser = {
			name,
			email: this.state.email,
			password: this.state.password,
			studentId: this.state.studentId
		}

		this.props.registerUser(newUser, this.props.history)
	}

	render() {
		// For redirecting when already logged in
		// if (this.props.isAuthenticated) return <Redirect to="/books" />

		return (
			<React.Fragment>
				<Message
					attached
					header="Welcome to our site!"
					content="Fill out the form below to sign-up for a new account"
				/>
				<Form className="attached fluid segment" onSubmit={(e) => this.onSubmit(e)}>
					<Form.Group widths="equal">
						<Form.Input
							fluid
							label="First Name"
							name="firstName"
							onChange={this.handleChange}
							value={this.state.firstName}
							placeholder="John"
							required
						/>
						<Form.Input
							fluid
							label="Last Name"
							name="lastName"
							onChange={this.handleChange}
							value={this.state.lastName}
							placeholder="Doe"
							required
						/>
					</Form.Group>
					<Form.Input
						label="Student ID"
						name="studentId"
						onChange={this.handleChange}
						value={this.state.studentId}
						placeholder="13B-2117"
					/>
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
					<Form.Input
						label="Confirm Password"
						name="password2"
						onChange={this.handleChange}
						value={this.state.password2}
						placeholder="********"
						type="password"
						minLength={7}
						required
					/>
					<Button color="blue">Register</Button>
				</Form>
				<Message attached="bottom" warning>
					<Icon name="help" />
					Already signed up? <Link to="/login">Login here</Link> instead.
				</Message>
			</React.Fragment>
		)
	}
}

Register.propTypes = {
	isAuthenticated: PropTypes.bool,
	setAlert: PropTypes.func.isRequired,
	registerUser: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
}

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({ isAuthenticated })

export default connect(mapStateToProps, { setAlert, registerUser })(withRouter(Register))
