import { combineReducers } from 'redux'
import authReducer from './authReducer'
import alertReducer from './alertReducer'
import cartReducer from './cartReducer'

export default combineReducers({ auth: authReducer, alert: alertReducer, cart: cartReducer })
