import {
	USER_LOADED,
	AUTH_ERROR,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_USER,
	NO_USER,
	RELOAD_TICKETS
} from '../actions/types'

const initialState = {
	token: localStorage.getItem('token'),
	isAuthenticated: null,
	loading: true,
	user: null
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case USER_LOADED:
			return { ...state, ...payload, isAuthenticated: true, loading: false }
		case AUTH_ERROR:
		case REGISTER_FAIL:
		case LOGIN_FAIL:
		case LOGOUT_USER:
		case NO_USER:
			localStorage.removeItem('token')
			return { ...state, token: null, isAuthenticated: false, loading: false, user: null }
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem('token', payload.token)
			return { ...state, ...payload, isAuthenticated: true, loading: false }
		case RELOAD_TICKETS:
			return { ...state, user: { ...state.user, tickets: payload } }
		default:
			return state
	}
}
