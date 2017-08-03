'use strict'
const axios = require('axios')
const {
  User,
  Restaurant,
  RestaurantUser,
  Review
} = require('APP/db')

const {
  mustBeLoggedIn,
  forbidden,
  assertAdmin
} = require('./auth.filters')

module.exports = require('express').Router()
  .get('/',
    // assertAdmin,
    (req, res, next) =>
      User.findAll()
        .then(users => res.json(users))
        .catch(next))
  .get('/rs',
    // assertAdmin,
    (req, res, next) =>
      RestaurantUser.findAll()
        .then(el => res.json(el))
        .catch(next))

  .post('/',
    (req, res, next) =>
      User.create(req.body)
        .then(user => res.status(201).json(user))
        .catch(next))
  .get('/google', (req, res, next) => {
    axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json?location=40.730610,-73.935242&radius=10000&type=restaurant&key=AIzaSyB-GQEdmzIa5BPjowzaKDoaTklmxYaJvu8')
      .then(data => {
        console.log(data.data.results)
        res.send('ok')
      })
      .catch(next)
  })
  .get('/:id',
    // mustBeLoggedIn,
    (req, res, next) =>
      User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(next))
  .get('/:id/recommended',
    // mustBeLoggedIn,
    (req, res, next) =>
      User.findById(req.params.id, {
        include: [{
          model: RestaurantUser,
          where: {
            access: false
          },
          include: [{
            model: Restaurant
          }, {model: Review}],
        }]
      })
        .then(users => res.json(users))
        .catch(next))
  .post('/:id/recommend',
    // mustBeLoggedIn,
    (req, res, next) => {
      // google request here then store into restaurants table
      // update user table with exp and or level
    })
// https://maps.googleapis.com/maps/api/place/textsearch/json?location=40.7128,74.0059&radius=50000&type=restaurant&key=AIzaSyB-GQEdmzIa5BPjowzaKDoaTklmxYaJvu8
