/* global google */
import {
  default as React,
  Component
} from 'react'
import {
  connect
} from 'react-redux'
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps'
import {
  fetchRestaurant,
  postRestaurant
} from 'APP/app/reducers/restaurant.jsx'
import fancyMapStyles from 'APP/public/fancyMapStyles.js'
import axios from 'axios'
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

const RecommendationMapConst = withGoogleMap(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    defaultOptions={{ styles: fancyMapStyles }}
  >
    <div>
      {console.log(props.markers)}
      {props.markers.length !== 0 &&
        props.markers.map((marker, index) =>
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
class RecommendationMap extends Component {
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
   axios.get('/api/restaurants')
     .then(restaurants => {
       const data = restaurants.data
       console.log('restaurants', restaurants)
       console.log('data', data)
       console.log(data[0].restaurant.name)
       const stateArray = data.map(el => ({
         position: {
           lat: el.restaurant.position[0],
           lng: el.restaurant.position[1]
         },
         showInfo: false,
         infoContent: [
           <div key = {0}>
             <b>Information</b>
           </div>,
           <div key={1}>
            Name: {el.restaurant.name}
           </div>,
           <div key={2}>
          Address: {el.restaurant.address}
           </div>,
           <div key = {3} >
          Phone: {el.restaurant.phone}
           </div>,
           <div key={4}>
          Website: {el.restaurant.website}
             <hr />
           </div>,
           <div key={5}>
             <b>Weekly Schedule:</b>
           </div>,
           <div key={6}>
             {el.restaurant.open_times.map(str => <p>{str}</p>)}
           </div>,
           <div key={7}>
             <hr/>
             <b>Recommended By:</b>
           </div>,
           <div key={8}>
              Name: {el.restaurant.users[0].name}
           </div>,
           <div key={9}>
            Cohort: {el.restaurant.users[0].cohort}
           </div>
         ]
       }))
       console.log(stateArray)
       this.setState({
         markers: stateArray
       })
       console.log(this.state)
     })
 }

 handleBoundsChanged = () => {
   this.setState({
     bounds: this._map.getBounds(),
     center: this._map.getCenter()
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
   this.setState({
     markers: this.state.markers.map(marker => {
       if (marker === targetMarker) {
         return {
           ...marker,
           showInfo: false
         }
       }
       return marker
     })
   })
 }

 render() {
   return (
     <RecommendationMapConst
       containerElement={<div style={{ height: `100vh` }} />
       }
       mapElement = {
         <div style={{ height: `100vh` }} />
       }
       center = {
         this.state.center
       }
       onMapMounted = {
         this.handleMapMounted
       }
       onBoundsChanged = {
         this.handleBoundsChanged
       }
       bounds = {
         this.state.bounds
       }
       onPlacesChanged = {
         this.handlePlacesChanged
       }
       markers = {
         this.state.markers
       }
       onMarkerClicker = {
         this.handleMarkerClicker
       }
       onMarkerClose = {
         this.handleMarkerClose
       }
     />
   )
 }
}
const mapStateToProps = state => ({
  currentUser: state.auth
})

export default connect(mapStateToProps, null)(RecommendationMap)
