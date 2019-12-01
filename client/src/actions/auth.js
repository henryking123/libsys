import {
	USER_LOADED,
	AUTH_ERROR,
	REGISTER_FAIL,
	REGISTER_SUCCESS,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT_USER,
	NO_USER,
	EMPTY_CART,
	RELOAD_TICKETS
} from './types'
import setAuthHeader from '../utils/setAuthHeader'
import axios from 'axios'
import { setAlert } from './alert'
import { loadCart } from './cart'

// Loading User
export const loadUser = () => async (dispatch) => {
	try {
		if (!localStorage.token) return dispatch({ type: NO_USER })

		setAuthHeader(localStorage.token)
		const res = await axios.get('/user')

		dispatch({ type: USER_LOADED, payload: res.data })
		// Get User's Cart
		dispatch(loadCart())
	} catch (e) {
		dispatch({ type: AUTH_ERROR })
	}
}

// Register User
export const registerUser = (newUser, history) => async (dispatch) => {
	try {
		const config = { headers: { 'Content-Type': 'application/json' } }

		const body = JSON.stringify(newUser)

		const res = await axios.post('/register', body, config)

		dispatch({ type: REGISTER_SUCCESS, payload: res.data })

		setAuthHeader(localStorage.token)
		// Get User's Cart
		dispatch(loadUser())
		history.push('/books')
	} catch (e) {
		dispatch(setAlert({ header: 'Registration failed.', content: e.response.data }, 'negative'))
		dispatch({ type: REGISTER_FAIL })
	}
}

// Logging in User
export const loginUser = (user, history) => async (dispatch) => {
	try {
		const config = { headers: { 'Content-Type': 'application/json' } }
		const body = JSON.stringify(user)

		const res = await axios.post('/login', body, config)

		dispatch({ type: LOGIN_SUCCESS, payload: res.data })

		setAuthHeader(localStorage.token)

		dispatch(loadUser())
		history.push('/books')
	} catch (e) {
		dispatch(setAlert({ header: 'Login failed.', content: e.response.data }, 'negative'))
		dispatch({ type: LOGIN_FAIL })
	}
}

// Logging out User
export const logoutUser = (history) => async (dispatch) => {
	try {
		await axios.get('/logout')
		dispatch({ type: LOGOUT_USER })
		dispatch({ type: EMPTY_CART })
		history.push('/login')
	} catch (e) {
		console.error(e.message)
	}
}

// Log out of all sessions
export const logoutAll = (history) => async (dispatch) => {
	try {
		await axios.get('/logoutAll')
		dispatch({ type: LOGOUT_USER })
		dispatch({ type: EMPTY_CART })
		history.push('/login')
	} catch (e) {
		console.error(e.message)
	}
}

// Reload tickets
export const reloadTickets = () => async (dispatch) => {
	try {
		const res = await axios.get('/tickets')
		dispatch({ type: RELOAD_TICKETS, payload: res.data })
	} catch (e) {
		console.error(e.message)
	}
}
