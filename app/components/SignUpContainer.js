import React, { Component } from 'react'
import 'APP/public/signup.css'
import { withRouter } from 'react-router-dom'

// name, email, photo, password
import { connect } from 'react-redux'
import SignUp from './SignUp'
import { signup, whoami } from 'APP/app/reducers/auth'

export class SignUpContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      isLoading: false
    }
  }

  handleInput = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  validateInput = () => {
    return (
      this.state.name.length > 0 &&
      this.state.password.length > 0 &&
      this.state.email.length > 0
    )
  }
  handleSubmit = evt => {
    evt.preventDefault()
    this.setState({ isLoading: true })
    const credentials = {
      email: evt.target.email.value,
      password: evt.target.password.value,
      name: evt.target.name.value
    }
    this.props.signup(credentials, this.props.history).catch(e => {
      alert(e)
      this.props.whoami()
      this.setState({ isLoading: false })
    })
  }

  render() {
    return (
      <SignUp
        handleInput={this.handleInput}
        name={this.state.name}
        email={this.state.email}
        password={this.state.password}
        validateInput={this.validateInput()}
        handleSubmit={this.handleSubmit}
        isLoading={this.state.isLoading}
      />
    )
  }
}
export default connect(null, { signup, whoami })(SignUpContainer)
