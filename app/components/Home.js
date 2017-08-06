import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import 'APP/public/Home.css'
import { Row, Col, Card, Input, Icon, MediaBox } from 'react-materialize'

class Home extends React.Component {
  componentDidMount() {
    $('.parallax').parallax()
  }
  render() {
    return (
      <div>
        <div className="parallax-container first-parallex">
          <div className="parallax">
            <img src="images/alvintheman.jpg" />
          </div>
        </div>
        <div className="section white">
          <div className="row container text-container">
            <h2 className="header">
              Ask Alvin for the Best Places to eat!
              <br /> Because He'll always be alive!
            </h2>
            <h5 className="grey-text text-darken-3 lighten-3 text-parallex">
              Ask Alvin is a Food Restaurants Recommendation Services for
              FullStack Alumni. <br /> Only FullStack Alumni can login and Ask
              Alvin for restuarant. <br />
              <br />
              <br />
              WHAATTT? YOU'RE NOT FULLSTACK ALUMNI YET?
              <br />
              Then consider joining FullStack Academy at here =>
              <a target="_blank" href="https://www.fullstackacademy.com/">
                FullStack Academy
              </a>
            </h5>
            <h4 className="grey-text text-darken-3 lighten-3">
              Sorry, Nimit.. We couldn't find a black & white photo of you.
              <br /> The Deal is always open for us if you're interested. <br />contact
              Stanley at 1706-NY-FSA Campus.
            </h4>
          </div>
        </div>
        <div className="parallax-container second-parallax">
          <div className="parallax">
            <img src="images/davidtheman.png" />
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  user: state.auth
})
const mapDispatchToProps = dispatch => ({})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))