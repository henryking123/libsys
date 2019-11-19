import { ADD_TO_CART, REMOVE_FROM_CART, LOAD_CART, EMPTY_CART, CHECKOUT } from '../actions/types'

export default (state = [], { type, payload }) => {
	switch (type) {
		case ADD_TO_CART:
		case LOAD_CART:
		case REMOVE_FROM_CART:
		case CHECKOUT:
			// Untested
			return [...payload]
		case EMPTY_CART:
			return []
		default:
			return state
	}
}
