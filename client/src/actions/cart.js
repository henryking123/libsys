import { ADD_TO_CART, REMOVE_FROM_CART, LOAD_CART } from './types'
import { setAlert } from './alert'
import axios from 'axios'

export const loadCart = () => async (dispatch) => {
	try {
		const res = await axios.get('/cart')
		dispatch({ type: LOAD_CART, payload: res.data })
	} catch (e) {
		// Untested
		dispatch(setAlert({ header: 'Error loading cart.', content: e.message }, 'negative'))
	}
}

export const addToCart = (id) => async (dispatch) => {
	try {
		const config = { headers: { 'Content-Type': 'application/json' } }
		const body = JSON.stringify({ book_id: id })
		const res = await axios.post('/cart', body, config)
		dispatch({ type: ADD_TO_CART, payload: res.data })
	} catch (e) {
		// Untested
		dispatch(setAlert({ header: 'Error adding item to cart.', content: e.message }, 'negative'))
		dispatch(loadCart())
	}
}

// Untested
export const removeFromCart = (id) => async (dispatch) => {
	try {
		const config = { headers: { 'Content-Type': 'application/json' } }
		const body = JSON.stringify({ book_id: id })
		const res = await axios.post('/cart/remove', body, config)

		dispatch({ type: REMOVE_FROM_CART, payload: res.data })
		dispatch(setAlert({ header: 'Book has been removed from cart.' }, 'positive'))
	} catch (e) {
		dispatch(setAlert({ header: 'Error removing item from cart.', content: e.message }, 'negative'))
	}
}
