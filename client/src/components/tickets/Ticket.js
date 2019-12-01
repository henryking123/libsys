import React, { Component } from 'react'
import axios from 'axios'

class Ticket extends Component {
	componentDidMount = async () => {
		const res = await axios.get(`/tickets/${this.props.match.params.ticket_id}`)
		console.log(res.data)
	}

	render() {
		return <div>a</div>
	}
}

export default Ticket
