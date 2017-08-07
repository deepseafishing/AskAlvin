/* global google */
import { default as React, Component } from 'react'
import { connect } from 'react-redux'
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  OverlayView
} from 'react-google-maps'
import {
  fetchRestaurant,
  postRestaurant
} from 'APP/app/reducers/restaurant.jsx'
import SearchBox from 'APP/node_modules/react-google-maps/lib/places/SearchBox'
import fancyMapStyles from 'APP/public/fancyMapStyles.js'
import axios from 'axios'
import { Button } from 'react-materialize'
const INPUT_STYLE = {
  backgroundColor: `white`,
  boxSizing: `border-box`,
  MozBoxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `312px`,
  height: `32px`,
  marginTop: `27px`,
  padding: `0 12px`,
  borderRadius: `1px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  zIndex: '99',
  textOverflow: `ellipses`
}

const SearchBoxExampleGoogleMap = withGoogleMap(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    defaultOptions={{ styles: fancyMapStyles }}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputPlaceholder="Search NYC Restaurants"
      inputStyle={INPUT_STYLE}
    />
    {props.markers.length !== 0 &&
      props.markers.map((marker, index) =>
        <Marker
          position={marker.position}
          key={index}
          onClick={() => props.onMarkerClicker(marker)}
          onMarke
        >
          {marker.showInfo &&
            <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
              <div>
                {marker.infoContent}
              </div>
            </InfoWindow>}
        </Marker>
      )}
    <div id="status-board" className="dropSheet">
      name add button
      <Button floating small className="red" waves="light" icon="add" />
    </div>
  </GoogleMap>
)

/*
 * https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
class SearchBoxExample extends Component {
  state = {
    bounds: null,
    center: {
      lat: 40.704593,
      lng: -74.009577
    },
    markers: []
  }

  handleMapMounted = map => {
    this._map = map
    axios.get('api/users/me/recommended/').then(restaurants => {
      const data = restaurants.data.restaurants
      console.log('restaurants', restaurants)
      console.log(data)
      const stateArray = data.map(el => ({
        position: {
          lat: el.position[0],
          lng: el.position[1]
        },
        showInfo: false,
        infoContent: [
          <div>
            <b>Information</b>
          </div>,
          <div key={1}>
            Name: {el.name}
          </div>,
          <div key={2}>
            Address: {el.address}
          </div>,
          <div key={3}>
            Phone: {el.phone}
          </div>,
          <div key={5}>
            Website: {el.website}
            <hr />
          </div>,

          <div>
            <b>Weekly Schedule:</b>
          </div>,
          <div key={4}>
            {el.open_times.map(str =>
              <p>
                {str}
              </p>
            )}
          </div>
        ]
      }))
      this.setState({
        markers: stateArray
      })
    })
  }

  handleBoundsChanged = () => {
    this.setState({
      bounds: this._map.getBounds(),
      center: this._map.getCenter()
    })
  }

  handleSearchBoxMounted = searchBox => {
    this._searchBox = searchBox
  }

  handlePlacesChanged = () => {
    const places = this._searchBox.getPlaces()
    const openTimes = places[0].opening_hours
    const checkopen =
      openTimes && openTimes.weekday_text && openTimes.weekday_text.length
    const markers = places.map(place => ({
      position: place.geometry.location,
      infoContent: [
        <div>
          <b>Information</b>
        </div>,
        <div key={1}>
          Name: {places[0].name}
        </div>,
        <div key={2}>
          Address: {places[0].formatted_address}
        </div>,
        <div key={3}>
          Phone: {places[0].formatted_phone_number}
        </div>,
        <div key={5}>
          Website: {places[0].website}
        </div>,
        <div>
          <hr />
          <b>Weekly Schedule</b>
        </div>,
        <div key={4}>
          {checkopen
            ? places[0].opening_hours.weekday_text.map(str =>
                <p>
                  {str}
                </p>
              )
            : 'Days Open: No information available.'}
        </div>
      ],
      showInfo: false
    }))

    let open
    if (checkopen) open = places[0].opening_hours.weekday_text.map(str => str)
    else open = ['No information available.']
    axios
      .post('/api/restaurants/recommend', {
        name: places[0].name,
        address: places[0].formatted_address,
        phone: places[0].international_phone_number,
        website: places[0].website,
        position: [markers[0].position.lat(), markers[0].position.lng()],
        open_times: open
      })
      .catch(console.log)

    const mapCenter =
      markers.length > 0 ? markers[0].position : this.state.center

    this.setState({
      center: mapCenter,
      markers: [...this.state.markers, ...markers]
    })
  }

  handleMarkerClicker = targetMarker => {
    console.log('markerClicker', targetMarker)
    let setInfo
    if (targetMarker.showInfo) setInfo = false
    else setInfo = true
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: setInfo
          }
        }
        return marker
      })
    })
  }

  handleMarkerClose = targetMarker => {
    const temp = targetMarker.infoContent[2].props.children[1]
    console.log(temp, typeof temp)
    axios
      .post('/api/restaurants/recommend/delete', {
        address: temp
      })
      .catch(console.log)
    this.setState({
      markers: this.state.markers.filter(marker => {
        if (marker !== targetMarker) {
          return marker
        }
      })
    })
  }

  render() {
    return (
      <SearchBoxExampleGoogleMap
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100vh` }} />}
        center={this.state.center}
        onMapMounted={this.handleMapMounted}
        onBoundsChanged={this.handleBoundsChanged}
        onSearchBoxMounted={this.handleSearchBoxMounted}
        bounds={this.state.bounds}
        onPlacesChanged={this.handlePlacesChanged}
        markers={this.state.markers}
        onMarkerClicker={this.handleMarkerClicker}
        onMarkerClose={this.handleMarkerClose}
      />
    )
  }
}
const mapStateToProps = state => ({
  currentUser: state.auth
})

export default connect(mapStateToProps, null)(SearchBoxExample)
