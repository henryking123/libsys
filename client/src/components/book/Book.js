import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

class Book extends Component {
	componentDidMount = async () => {
		const res = await axios.get(`/books/${this.props.match.params.book_id}`)
		console.log(res.data)
	}

	render() {
		return <div>"hehe"</div>
	}
}

Book.propTypes = {
	match: PropTypes.object
}

export default Book
