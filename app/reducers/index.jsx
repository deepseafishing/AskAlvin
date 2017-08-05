import {
  combineReducers
} from 'redux'
import users from './user.jsx'
import restaurants from './restaurant.jsx'
import auth from './auth.jsx'

export default combineReducers({
  auth,
  users,
  restaurants
})
