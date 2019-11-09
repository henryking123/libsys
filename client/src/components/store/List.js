import React, { Component } from 'react'
import axios from 'axios'

// Translate into semantic-ui-react

class List extends Component {
	state = { loading: false }

	addToCart = async (_id) => {
		await axios.post(`/cart/${_id}`)
	}

	render() {
		return (
			<div className="ui items">
				{this.props.books.map(({ title, author, datePublished, available, description, _id }) => (
					<div className="item" key={_id}>
						<div className="image">
							<img
								src="https://kbimages1-a.akamaihd.net/52c896b6-2750-4c3d-a844-0760f23117f9/353/569/90/False/how-to-study-smart-study-secrets-of-an-honors-student.jpg"
								style={{ height: '175px', width: 'auto', margin: 'auto' }}
								alt={title}
							/>
						</div>
						<div className="middle aligned content">
							<a className="header" href="!#">
								{title}
							</a>
							<div className="meta">
								<span>{author}</span>
								<span>{datePublished}</span>
							</div>
							<div className="description">
								<p>
									{description || (
										<React.Fragment>
											Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quod ratione ut
											consectetur labore atque eveniet ipsa? Omnis blanditiis non eum voluptatum
											temporibus impedit. Similique labore ab perspiciatis ipsa culpa?
										</React.Fragment>
									)}
								</p>
							</div>
							<div className="extra">
								<div
									className={`ui right floated primary button ${!available && 'disabled'}`}
									onClick={() => this.addToCart(_id)}
								>
									Add to Cart
									<i className="right chevron icon"></i>
								</div>
								{available === 0 && <div className="ui red label">Not available</div>}
								{available > 0 && available < 3 && (
									<div className="ui orange label">Only {available} Left</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}
}

export default List
