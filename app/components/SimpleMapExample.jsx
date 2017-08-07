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
    defaultZoom={13}
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
          icon={marker.color}
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
      {props.markers[props.markers.length - 1] &&
        props.markers[
          props.markers.length - 1
        ].infoContent.props.children.slice(0, 13)}
      <Button floating className="blue" waves="light" icon="add" />
      <Button floating className="red" waves="light" icon="remove" />
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
      lat: 40.7536111,
      lng: -73.9841667
    },
    markers: [],
    currentMarker: {}
  }

  handleMapMounted = map => {
    this._map = map
    axios.get('/api/restaurants').then(restaurants => {
      const data = restaurants.data
      const stateArray = data.map(place => ({
        position: {
          lat: place.restaurant.position[0],
          lng: place.restaurant.position[1]
        },
        showInfo: false,
        color:
          this.props.user.id ===
          place.restaurant.users[0].restaurantUsers.user_id
            ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        infoContent: (
          <div key={place.restaurant.name}>
            <b>Information</b>
            <br />
            Name: {place.restaurant.name}
            <br />
            Address: {place.restaurant.address}
            <br />
            Phone: {place.restaurant.phone}
            <br />
            Website:
            <a target="_blank" href={place.restaurant.website}>
              {place.restaurant.website}
            </a>
            <div className="open-close-time">
              <b>Weekly Schedule</b>
              <br />
              {place.restaurant.open_times.map(str =>
                <p>
                  {str}
                </p>
              )}
            </div>
          </div>
        )
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
      infoContent: (
        <div key={place.name}>
          <b>Information</b>
          <br />
          Name: {place.name}
          <br />
          Address: {place.formatted_address}
          <br />
          Phone: {place.formatted_phone_number}
          <br />
          Website:{' '}
          <a target="_blank" href={place.website}>
            {place.website}
          </a>
          <br />
          <div className="open-close-time">
            <b>Weekly Schedule</b>
            {checkopen
              ? place.opening_hours.weekday_text.map(str =>
                  <p>
                    {str}
                  </p>
                )
              : 'Days Open: No information available.'}
          </div>
        </div>
      ),
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
    const address = targetMarker.infoContent.props.children[6]
    axios
      .post('/api/restaurants/recommend/delete', {
        address
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
  user: state.auth
})

export default connect(mapStateToProps, null)(SearchBoxExample)
