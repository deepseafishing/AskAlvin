import axios from 'axios'

//  STATE

const initialState = {
  users: [],
  user: {},
  // topProducts: []
}

// ACTION TYPE CONSTANT

const GET_ALLUSERS = 'GET_ALLUSERS'
const GET_SINGLEUSER = 'GET_SINGLEUSER'
const ADD_USER = 'ADD_USER'
const REMOVE_USER = 'REMOVE_USER'
const EDIT_USER = 'EDIT_USER'
// const FETCH_TOP_RATED = 'FETCH_TOP_RATED'

// ACTION CREATORS

// const getTopRated = users => ({
// type: FETCH_TOP_RATED,
// users
// })

const getAllUsers = users => ({
  type: GET_ALLUSERS,
  users
})

const getUser = user => ({
  type: GET_SINGLEUSER,
  user
})

const addUser = user => ({
  type: ADD_USER,
  user
})

const removeUser = user => ({
  type: REMOVE_USER,
  user
})

const editUser = user => ({
  type: EDIT_USER,
  user
})

// THUNKS

// export const fetchTopRated = () =>
// dispatch =>
// axios.get('/api/user/topRated')
// .then(res => res.data)
// .then(products => {
// dispatch(getTopRated(products))
// })

// export const fetchProducts = (ownProps) =>
// dispatch =>
// axios.get('/api/products' + ownProps)
// .then(res => res.data)
// .then(products => {
// dispatch(getProducts(products))
// })
// .catch(err => console.log('fetch all products error', err))

export const fetchUser = (userId) =>
  dispatch =>
    axios.get(`/api/users/${userId}`)
      .then(res => res.data)
      .then(user => {
        dispatch(getUser(user))
      })
      .catch(err => console.log('fetch all error', err))

export const postUser = user =>
  dispatch =>
    axios.post('/api/user', user)
      .then(res => res.data)
      .then(newUser => {
        dispatch(addUser(newUser))
      })
      .catch(err => console.log('post error', err))

export const deleteUser = userId =>
  dispatch =>
    axios.delete(`/api/users/${userId}`)
      .then(res => res.data)
      .then((user) => {
        dispatch(removeUser(user))
      })
      .catch(err => console.log('delete error', err))

export const updateUser = (user, userId) =>
  dispatch =>
    axios.put(`/api/user/edit/${userId}`, user)
      .then(res => res.data)
      .then(updatedUser => {
        dispatch(editUser(updatedUser))
      })
      .catch(err => console.log('update error', err))

// REDUCER

export default function reducer(state = initialState, action) {
  const newState = Object.assign({}, state)
  switch (action.type) {
  case GET_ALLUSERS:
    newState.users = action.users
    break
  case GET_SINGLEUSER:
    newState.user = action.user
    break
  case ADD_USER:
    newState.users = [...newState.users, action.user]
    break
  case REMOVE_USER:
    newState.users = newState.products.filter(user => {
      if (user.id !== action.user.id) return user
    })
    break
  case EDIT_USER:
    newState.users = newState.users.map(user =>
      user.id === action.user.id ? action.user : user
    )
    break
    // case FETCH_TOP_RATED:
    // newState.topUsers = action.users
    // break
  default:
    return state
  }
  return newState
}
