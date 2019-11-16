import React, { useEffect } from 'react'
import Search from './components/store/Search'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'

// Redux
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/auth'

// Components
import PrivateRoute from './components/routing/PrivateRoute'
import AdminRoute from './components/routing/AdminRoute'
import setAuthHeader from './utils/setAuthHeader'
import BookForm from './components/book/BookForm'
import BookFormEdit from './components/book/BookFormEdit'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layouts/Alert'
import Cart from './components/cart/Cart'

// So even before app loads, header is already loaded
if (localStorage.token) setAuthHeader(localStorage.token)

const App = () => {
	useEffect(() => {
		if (localStorage.token) setAuthHeader(localStorage.token)
		store.dispatch(loadUser())
	}, [])

	return (
		<Provider store={store}>
			<div style={{ marginBottom: '50px' }}></div>
			<div className="ui container">
				<Router>
					<Alert />
					<Switch>
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
						<PrivateRoute path="/books/search" component={Search} />
						<PrivateRoute path="/cart" component={Cart} />
						<AdminRoute exact path="/books/add" component={BookForm} />
						<AdminRoute exact path="/books/:book_id/edit" component={BookFormEdit} />
					</Switch>
				</Router>
			</div>
		</Provider>
	)
}

export default App
