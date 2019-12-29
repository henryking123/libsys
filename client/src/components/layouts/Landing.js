import React from 'react'
import { Container, Header, Button, Segment } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const Landing = ({ isAuthenticated }) => {
	if (isAuthenticated) return <Redirect to="/books" />

	return (
		<Segment
			textAlign="center"
			style={{ minHeight: '700px', padding: '1em 0em', margin: '0' }}
			vertical
		>
			<Container text>
				<Header
					as="h1"
					content="Borrow a Book"
					style={{
						fontSize: '4em',
						fontWeight: 'normal',
						marginBottom: 0,
						marginTop: '3em'
					}}
				/>
				<Header
					as="h2"
					content="Online Library System"
					style={{
						fontSize: '1.7em',
						fontWeight: 'normal',
						marginTop: '1.5em'
					}}
				/>
				<Button secondary as={Link} to="/register">
					Sign Up
				</Button>

				<Button primary as={Link} to="/login" style={{ marginLeft: '0.5em' }}>
					Log In
				</Button>
			</Container>
		</Segment>
	)
}

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({ isAuthenticated })

export default connect(mapStateToProps)(Landing)
