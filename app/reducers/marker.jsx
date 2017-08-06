import axios from 'axios'

//  STATE

const initialState = {
  markers: [],
  marker: {},
  // topProducts: []
}

// ACTION TYPE CONSTANT

const GET_ALLMARKERS = 'GET_ALLMARKERS'
const GET_SINGLEMARKER = 'GET_SINGLEMARKER'
const ADD_MARKER = 'ADD_MARKER'
const REMOVE_MARKER = 'REMOVE_MARKER'
const EDIT_MARKER = 'EDIT_MARKER'
// const FETCH_TOP_RATED = 'FETCH_TOP_RATED'

// ACTION CREATORS

// const getTopRated = markers => ({
// type: FETCH_TOP_RATED,
// markers
// })

const getAllMarkers = markers => ({
  type: GET_ALLMARKERS,
  markers
})

const getMarker = marker => ({
  type: GET_SINGLEMARKER,
  marker
})

const addMarker = marker => ({
  type: ADD_MARKER,
  marker
})

const removeMarker = marker => ({
  type: REMOVE_MARKER,
  marker
})

const editMarker = marker => ({
  type: EDIT_MARKER,
  marker
})

// THUNKS

// export const fetchTopRated = () =>
// dispatch =>
// axios.get('/api/marker/topRated')
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

export const fetchMarker = (markerId) =>
  dispatch =>
    axios.get(`/api/markers/${markerId}`)
      .then(res => res.data)
      .then(marker => {
        dispatch(getMarker(marker))
      })
      .catch(err => console.log('fetch all error', err))

export const postMarker = marker =>
  dispatch =>
    axios.post('/api/marker', marker)
      .then(res => res.data)
      .then(newMarker => {
        dispatch(addMarker(newMarker))
      })
      .catch(err => console.log('post error', err))

export const deleteMarker = markerId =>
  dispatch =>
    axios.delete(`/api/markers/${markerId}`)
      .then(res => res.data)
      .then((marker) => {
        dispatch(removeMarker(marker))
      })
      .catch(err => console.log('delete error', err))

export const updateMarker = (marker, markerId) =>
  dispatch =>
    axios.put(`/api/marker/edit/${markerId}`, marker)
      .then(res => res.data)
      .then(updatedMarker => {
        dispatch(editMarker(updatedMarker))
      })
      .catch(err => console.log('update error', err))

// REDUCER

export default function reducer(state = initialState, action) {
  const newState = Object.assign({}, state)
  switch (action.type) {
  case GET_ALLMARKERS:
    newState.markers = action.markers
    break
  case GET_SINGLEMARKER:
    newState.marker = action.marker
    break
  case ADD_MARKER:
    newState.markers = [...newState.markers, action.marker]
    break
  case REMOVE_MARKER:
    newState.markers = newState.products.filter(marker => {
      if (marker.id !== action.marker.id) return marker
    })
    break
  case EDIT_MARKER:
    newState.markers = newState.markers.map(marker =>
      marker.id === action.marker.id ? action.marker : marker
    )
    break
    // case FETCH_TOP_RATED:
    // newState.topMarkers = action.markers
    // break
  default:
    return state
  }
  return newState
}
