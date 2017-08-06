'use strict'

const {
  Restaurant,
  RestaurantUser,
  User
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
      Restaurant.findAll()
        .then(restaurants => res.json(restaurants))
        .catch(next))
  .get('/allowed', mustBeLoggedIn, (req, res, next) =>
    Restaurant.findAll({
      where: {
        access: true
      }
    })
      .then(restaurants => res.json(restaurants))
      .catch(next))

  // when axios request hits post, restaurant find or creates restaurant in the db in restaurant table, with given marker info
  .post('/recommend', (req, res, next) =>
    Restaurant.findOrCreate({
      where: {
        marker: req.body
      }
    })
    // then we take that restaurant and post it in the RestaurantUser table
      .spread((restaurant, created) => RestaurantUser.findOrCreate({
        where: {
          user_id: req.user.id,
          restaurant_id: restaurant.id
        }
      }))
      .spread((relationship, created) => res.json(relationship))
      .catch(next)
  )
/*
 *.post('/',
 *  (req, res, next) =>
 *    Restaurant.create(req.body)
 *      .then(user => res.status(201).json(user))
 *      .catch(next))
 *.get('/:id',
 *  mustBeLoggedIn,
 *  (req, res, next) =>
 *    Restaurant.findById(req.params.id)
 *      .then(user => res.json(user))
 *      .catch(next))
 */
