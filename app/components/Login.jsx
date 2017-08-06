import React from 'react'
import { Row, Col, Card, Input, Icon, Button } from 'react-materialize'
import LoaderButton from './LoaderButton'
import 'APP/node_modules/materialize-social/materialize-social.css'

export default function Login({
  email,
  password,
  handleSubmit,
  validateInput,
  handleInput,
  isLoading
}) {
  return (
    <Row>
      <Col offset="m2 l4" s={12} m={8} l={4} className="grid-example blue-text">
        <Card className="blue-text" textClassName="blue-text" title="Log In">
          <form onSubmit={handleSubmit}>
            <Row>
              <Input
                name="email"
                offset="m1"
                s={12}
                m={10}
                className="blue-text"
                label="Email"
                value={email}
                validate
                type="email"
                onChange={handleInput}
              >
                <Icon className="blue-text">email</Icon>
              </Input>
            </Row>
            <Row>
              <Input
                name="password"
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
                  waves="light"
                  className="blue white-text"
                  disabled={!validateInput}
                  isLoading={isLoading}
                  text="Login"
                  loadingText="Logging in..."
                />
              </Col>
            </Row>
          </form>
          <a href="https://www.fullstackacademy.com">
            <LoaderButton text="If you want to sign up..." />
          </a>
        </Card>
      </Col>
    </Row>
  )
}
