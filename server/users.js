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
    assertAdmin,
    (req, res, next) =>
      User.findAll()
        .then(users => res.json(users))
        .catch(next))
  .get('/rs',
    assertAdmin,
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
  // get info about yourself
  .get('/me',
    mustBeLoggedIn,
    (req, res, next) =>
      User.findOne({
        where: {
          email: req.user.email
        }
      })
        .then(user => res.json(user))
        .catch(next))
  // get all your own recommendations
  .get('/me/recommended',
    mustBeLoggedIn,
    (req, res, next) => User.findOne({
      where: {
        email: req.user.email
      },
      include: [{
        model: Restaurant,
        attributes: ['name', 'address', 'phone', 'website', 'open_times', 'position']
      }]
    })
      .then(restaurants => res.json(restaurants))
      .catch(next))
  // admin find a person by their id
  .get('/:id',
    assertAdmin,
    (req, res, next) =>
      User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(next))

// admin get all markers from restaurant user where the field is false and the user id matches
// .post('/me/recommended',
// mustBeLoggedIn,
// (req, res, next) =>
// User.findAll({
// include: [{
// model: RestaurantUser,
// where: {
// email: 
// },
// include: [{
// model: Restaurant
// }, {
// model: Review
// }],
// }]
// })
// .then(users => res.json(users))
// .catch(next))
// get 
// .post('/recommend',
// mustBeLoggedIn,
// (req, res, next) => {
// update user table with exp and or level
// })
// https://maps.googleapis.com/maps/api/place/textsearch/json?location=40.7128,74.0059&radius=50000&type=restaurant&key=AIzaSyB-GQEdmzIa5BPjowzaKDoaTklmxYaJvu8
