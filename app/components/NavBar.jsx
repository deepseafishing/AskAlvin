/* global $ */
import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import {
  Row,
  Col,
  Navbar,
  NavItem,
  Dropdown,
  Button,
  Icon,
  Modal
} from 'react-materialize'
import { connect } from 'react-redux'
import 'APP/public/navbar.css'
import { logout } from 'APP/app/reducers/auth'

class NavBar extends React.Component {
  validateActive(href) {
    return this.props.location.pathname === href
  }

  renderLoginSignup() {
    return [
      <li key={1} className={this.validateActive('/login') ? 'active' : ''}>
        <NavLink to="/login">Login</NavLink>
      </li>
    ]
  }

  renderLogout() {
    return [
      <li key={1} className="blue-text">
        Welcome, {this.props.user.name} !
      </li>,
      <NavItem key={2} onClick={this.props.logout}>
        Logout
      </NavItem>,
      <Dropdown
        key={3}
        trigger={
          <li>
            <NavLink
              to="#!"
              onClick={() => {
                $('#fullstack-profile').modal('open')
              }}
            >
              <img
                key={3}
                src={this.props.user.photo}
                className="profile-photo circle"
              />
              <i className="material-icons right">arrow_drop_down</i>
            </NavLink>
          </li>
        }
      />,
      <Modal
        key={4}
        id="fullstack-profile"
        header="What about recommending your favorite restaurant to FullStack Alumi today?"
        bottomSheet
      >
        <img
          key={3}
          src={this.props.user.photo}
          className="modal-profile-photo circle"
        />
        <div className="modal-profile-text">
          <span> Hello! </span>
          <span> {' ' + this.props.user.name}</span>
          <br />
          <span> Cohort </span>:
          <span> {this.props.user.cohort}</span>
        </div>
      </Modal>
    ]
  }

  render() {
    return (
      <Navbar brand="Ask Alvin" right>
        <div className="col s8">
          {this.props.user ? this.renderLogout() : this.renderLoginSignup()}
        </div>
      </Navbar>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth
})
const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout())
  }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar))
