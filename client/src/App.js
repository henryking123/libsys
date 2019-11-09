import React from 'react'
import Search from './components/store/Search'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'

// Redux
import { Provider } from 'react-redux'
import store from './store'

import setAuthHeader from './utils/setAuthHeader'
import BookForm from './components/book/BookForm'
import BookFormEdit from './components/book/BookFormEdit'

const App = () => {
	setAuthHeader()
	return (
		<Provider store={store}>
			<div style={{ marginBottom: '50px' }}></div>
			<div className="ui container">
				<Router>
					<Switch>
						<Route path="/books/search" component={Search} />
						<Route exact path="/books/add" component={BookForm} />
						<Route exact path="/books/:book_id/edit" component={BookFormEdit} />
					</Switch>
				</Router>
			</div>
		</Provider>
	)
}

export default App
