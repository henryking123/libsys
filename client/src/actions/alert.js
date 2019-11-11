import { SET_ALERT, REMOVE_ALERT } from './types'
import uuidv4 from 'uuid/v4'

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
	const id = uuidv4()
	// Possible alert types = "warning", "positive", "negative"
	dispatch({ type: SET_ALERT, payload: { id, msg, alertType } })

	setTimeout(() => {
		dispatch({ type: REMOVE_ALERT, payload: id })
	}, timeout)
}
