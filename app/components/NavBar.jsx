import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import {
  Row,
  Col,
  Navbar,
  NavItem,
  Dropdown,
  Button,
  Icon
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
      </li>,
      <li key={2} className={this.validateActive('/signup') ? 'active' : ''}>
        <NavLink to="/signup">Sign up</NavLink>
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
      </NavItem>
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
