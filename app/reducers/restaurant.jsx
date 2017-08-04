import axios from 'axios'

//  STATE

const initialState = {
  restaurants: [],
  restaurant: {},
  // topProducts: []
}

// ACTION TYPE CONSTANT

const GET_ALLRESTAURANTS = 'GET_ALLRESTAURANTS'
const GET_SINGLERESTAURANT = 'GET_SINGLERESTAURANT'
const ADD_RESTAURANT = 'ADD_RESTAURANT'
const REMOVE_RESTAURANT = 'REMOVE_RESTAURANT'
const EDIT_RESTAURANT = 'EDIT_RESTAURANT'
// const FETCH_TOP_RATED = 'FETCH_TOP_RATED'

// ACTION CREATORS

// const getTopRated = restaurants => ({
// type: FETCH_TOP_RATED,
// restaurants
// })

const getAllRestaurants = restaurants => ({
  type: GET_ALLRESTAURANTS,
  restaurants
})

const getRestaurant = restaurant => ({
  type: GET_SINGLERESTAURANT,
  restaurant
})

const addRestaurant = restaurant => ({
  type: ADD_RESTAURANT,
  restaurant
})

const removeRestaurant = restaurant => ({
  type: REMOVE_RESTAURANT,
  restaurant
})

const editRestaurant = restaurant => ({
  type: EDIT_RESTAURANT,
  restaurant
})

// THUNKS

// export const fetchTopRated = () =>
// dispatch =>
// axios.get('/api/restaurant/topRated')
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

export const fetchRestaurant = (restaurantId) =>
  dispatch =>
    axios.get(`/api/restaurants/${restaurantId}`)
      .then(res => res.data)
      .then(restaurant => {
        dispatch(getRestaurant(restaurant))
      })
      .catch(err => console.log('fetch all error', err))

export const postRestaurant = restaurant =>
  dispatch =>
    axios.post('/api/restaurant', restaurant)
      .then(res => res.data)
      .then(newRestaurant => {
        dispatch(addRestaurant(newRestaurant))
      })
      .catch(err => console.log('post error', err))

export const deleteRestaurant = restaurantId =>
  dispatch =>
    axios.delete(`/api/restaurants/${restaurantId}`)
      .then(res => res.data)
      .then((restaurant) => {
        dispatch(removeRestaurant(restaurant))
      })
      .catch(err => console.log('delete error', err))

export const updateRestaurant = (restaurant, restaurantId) =>
  dispatch =>
    axios.put(`/api/restaurant/edit/${restaurantId}`, restaurant)
      .then(res => res.data)
      .then(updatedRestaurant => {
        dispatch(editRestaurant(updatedRestaurant))
      })
      .catch(err => console.log('update error', err))

// REDUCER

export default function reducer(state = initialState, action) {
  const newState = Object.assign({}, state)
  switch (action.type) {
  case GET_ALLRESTAURANTS:
    newState.restaurants = action.restaurants
    break
  case GET_SINGLERESTAURANT:
    newState.restaurant = action.restaurant
    break
  case ADD_RESTAURANT:
    newState.restaurants = [...newState.restaurants, action.restaurant]
    break
  case REMOVE_RESTAURANT:
    newState.restaurants = newState.products.filter(restaurant => {
      if (restaurant.id !== action.restaurant.id) return restaurant
    })
    break
  case EDIT_RESTAURANT:
    newState.restaurants = newState.restaurants.map(restaurant =>
      restaurant.id === action.restaurant.id ? action.restaurant : restaurant
    )
    break
    // case FETCH_TOP_RATED:
    // newState.topRestaurants = action.restaurants
    // break
  default:
    return state
  }
  return newState
}
