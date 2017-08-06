'use strict'

/**
 * `babel-preset-env` converts this general import into a selection of specific
 * imports needed to polyfill the currently-supported environment (as specified
 * in `.babelrc`). As of 2017-06-04, this is primarily to support async/await.
 */
import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import store from './store'
import Jokes from './components/Jokes'
import NotFound from './components/NotFound'
import NavBar from './components/NavBar'
import SignUpContainer from './components/SignUpContainer'
import SimpleMapExample from './components/SimpleMapExample'
import LoginContainer from './components/LoginContainer'
import RecommendationMap from './components/RecommendationMap'

const ExampleApp = connect(({ auth }) => ({
  user: auth
}))(({ user, children }) =>
  <Router>
    <main>
      <NavBar />
      <Switch>
        <Route exact exact path="/" component={SimpleMapExample} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/recommended" component={RecommendationMap} />
        <Route component={NotFound} />
      </Switch>
    </main>
  </Router>
)

render(
  <Provider store={store}>
    <ExampleApp />
  </Provider>,
  document.getElementById('main')
)
