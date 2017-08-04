'use strict'

const {
  Restaurant
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
