import { ADD_TO_CART, REMOVE_FROM_CART, LOAD_CART, LOGOUT_USER } from '../actions/types'

export default (state = [], { type, payload }) => {
	switch (type) {
		case ADD_TO_CART:
		case LOAD_CART:
		// Untested
		case REMOVE_FROM_CART:
			return [...payload]
		// Untested
		case LOGOUT_USER:
			return []
		default:
			return state
	}
}
