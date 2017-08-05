/* global google */
import { default as React, Component } from 'react'
import { connect } from 'react-redux'
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'

import SearchBox from 'APP/node_modules/react-google-maps/lib/places/SearchBox'

const INPUT_STYLE = {
  backgroundColor: `white`,
  boxSizing: `border-box`,
  MozBoxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  marginTop: `27px`,
  padding: `0 12px`,
  borderRadius: `1px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`
}

const SearchBoxExampleGoogleMap = withGoogleMap(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <div>
      <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
        inputPlaceholder="Search NYC Restaurants"
        inputStyle={INPUT_STYLE}
      />
      {props.markers.map((marker, index) =>
        <Marker
          position={marker.position}
          key={index}
          onClick={() => props.onMarkerClicker(marker)}
        >
          {marker.showInfo &&
            <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
              <div>
                {marker.infoContent}
              </div>
            </InfoWindow>}
        </Marker>
      )}
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
    console.log('user:', this.props.currentUser)
    console.log(places)
    // Add a marker for each place returned from search bar
    const markers = places.map(place => ({
      position: place.geometry.location,
      infoContent: [
        <div key={1}>
          Name: {places[0].name}{' '}
        </div>,
        <div key={2}>
          Address: {places[0].formatted_address}
        </div>,
        <div key={3}>
          Phone:{' '}
          {places[0].formatted_phone_number ||
            places[0].international_phone_number}
        </div>,
        <div key={4}>
          Website: {places[0].website}
        </div>
      ],
      showInfo: false
    }))
    console.log('array', markers)

    const mapCenter =
      markers.length > 0 ? markers[0].position : this.state.center

    this.setState({
      center: mapCenter,
      markers: [...this.state.markers, ...markers]
    })
    // axios.
  }

  handleMarkerClicker = targetMarker => {
    console.log('here')
    console.log('marker: ', targetMarker)
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
    console.log('targetMarker: ', targetMarker)
    // this.setState({
    // markers: this.state.markers.map(marker => {
    // if (marker !== targetMarker) {
    // return marker
    /// / if (marker === targetMarker) {
    // return {
    // ...marker,
    // showInfo: false,
    // }
    // }
    // return marker
    // }
    // })
    // })
    console.log('breaking: ', this.state.markers)
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
