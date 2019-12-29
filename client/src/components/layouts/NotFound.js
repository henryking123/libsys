import React from 'react'
import { Container, Header } from 'semantic-ui-react'

const NotFound = () => {
	return (
		<Container text textAlign="center">
			<Header
				as="h1"
				content="404: Page Not Found"
				style={{
					fontSize: '3em',
					fontWeight: 'normal',
					marginBottom: 0,
					marginTop: '1.5em'
				}}
			/>
		</Container>
	)
}

export default NotFound
