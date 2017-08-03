import React, { Component } from 'react'
import 'APP/public/signup.css'

// name, email, photo, password
import { Button, Row, Col, Card, Input, Icon } from 'react-materialize'
import LoaderButton from './LoaderButton'

export default function SignUp({
  name,
  email,
  password,
  handleInput,
  validateInput,
  handleSubmit,
  isLoading
}) {
  return (
    <Row>
      <Col offset="m2 l4" s={12} m={8} l={4} className="grid-example blue-text">
        <Card className="blue-text" textClassName="blue-text" title="Sign Up">
          <form onSubmit={handleSubmit}>
            <Row>
              <Input
                autoFocus
                name="name"
                offset="m1"
                className="blue-text"
                s={12}
                m={10}
                label="Name"
                validate
                value={name}
                onChange={handleInput}
              >
                <Icon className="blue-text">account_circle</Icon>
              </Input>
            </Row>
            <Row>
              <Input
                name="email"
                offset="m1"
                id="email"
                s={12}
                m={10}
                className="blue-text"
                label="Email"
                id="email"
                validate
                value={email}
                type="email"
                onChange={handleInput}
              >
                <Icon className="blue-text">email</Icon>
              </Input>
            </Row>
            <Row>
              <Input
                name="password"
                id="password"
                offset="m1"
                className="blue-text"
                type="password"
                label="password"
                value={password}
                s={12}
                m={10}
                onChange={handleInput}
              >
                <Icon className="blue-text">vpn_key</Icon>
              </Input>
            </Row>
            <Row>
              <Col offset="s2 m1 l3" s={12} m={8} l={10} className="blue-text">
                <LoaderButton
                  type="submit"
                  isLoading={isLoading}
                  text="Sign up"
                  loadingText="Signing up..."
                  disabled={!validateInput}
                  waves="light"
                  className="blue white-text"
                />
              </Col>
            </Row>
          </form>
        </Card>
      </Col>
    </Row>
  )
}
