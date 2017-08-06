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
    mustBeLoggedIn,
    (req, res, next) =>
      RestaurantUser.findAll({
        attributes: ['restaurant_id', 'user_id'],
        include: [{
          model: Restaurant,
          include: [{
            model: User,
            attributes: ['name', 'cohort']
          }]
        }]
      })
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
  .post('/recommend', mustBeLoggedIn, (req, res, next) => {
    console.log('here', req.body)
    return Restaurant.findOrCreate({
      where: {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        website: req.body.website,
        position: req.body.position,
        open_times: req.body.open_times
      }
    })
      .spread((restaurant, created) => {
        console.log('here', restaurant)
        return RestaurantUser.findOrCreate({
          where: {
            restaurant_id: restaurant.id,
            user_id: req.user.id
          }
        })
      })
      .then(() => res.status(200).send('done'))
      .catch(next)
  })
  // goes to delete inside of the Restaurant model
  .post('/recommend/delete', (req, res, next) => Restaurant.findOne({
    where: {
      address: req.body.address
    }
  })
    .then(restaurant => RestaurantUser.findOne({
      where: {
        user_id: req.user.id,
        restaurant_id: restaurant.id
      }
    }))
    .then(restaurant => restaurant.destroy())
    .then(() => res.sendStatus(201))
    .catch(next))

/*
 *
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
