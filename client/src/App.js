import React, { useEffect } from 'react'
import BookSearch from './components/store/BookSearch'
import UserSearch from './components/store/UserSearch'
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
import Navbar from './components/layouts/Navbar'
import Landing from './components/layouts/Landing'
import NotFound from './components/layouts/NotFound'
import Cart from './components/cart/Cart'
import User from './components/user/User'
import AllTickets from './components/tickets/AllTickets'
import Ticket from './components/tickets/Ticket'
import UserTickets from './components/user/UserTickets'
import UserBooks from './components/user/UserBooks'
import Book from './components/book/Book'

// So even before app loads, header is already loaded
if (localStorage.token) setAuthHeader(localStorage.token)

const App = () => {
	useEffect(() => {
		if (localStorage.token) setAuthHeader(localStorage.token)
		store.dispatch(loadUser())
	}, [])

	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<div style={{ paddingTop: '80px' }} className="ui container">
					<Alert />
					<Switch>
						<Route exact path="/" component={Landing} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
						<PrivateRoute exact path="/books" component={BookSearch} />
						<PrivateRoute exact path="/cart" component={Cart} />
						<AdminRoute exact path="/books/add" component={BookForm} />
						<AdminRoute exact path="/books/:book_id/edit" component={BookFormEdit} />

						<PrivateRoute exact path="/profile" component={User} />
						<AdminRoute exact path="/profile/:user_id" component={User} />
						<AdminRoute exact path="/users" component={UserSearch} />

						<PrivateRoute exact path="/my_tickets" component={UserTickets} />
						<PrivateRoute exact path="/my_books" component={UserBooks} />
						<AdminRoute exact path="/tickets" component={AllTickets} />
						<PrivateRoute exact path="/tickets/:ticket_id" component={Ticket} />
						<PrivateRoute exact path="/books/:book_id" component={Book} />
						<Route path="/" component={NotFound} />
					</Switch>
				</div>
			</Router>
		</Provider>
	)
}

export default App
