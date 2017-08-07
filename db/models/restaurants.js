'use strict'

const {
  JSON,
  ARRAY,
  DOUBLE,
  STRING
} = require('sequelize')

module.exports = db => db.define('restaurants', {
  name: STRING,
  position: ARRAY(DOUBLE),
  address: STRING,
  phone: STRING,
  website: STRING,
  open_times: ARRAY(STRING)
})

module.exports.associations = (Restaurant, {
  User,
  RestaurantUser
  // Review
}) => {
  Restaurant.belongsToMany(User, {
    through: RestaurantUser
  })
  // Restaurant.belongsToMany(Review, {
  // through: RestaurantUser
  // })
  Restaurant.hasMany(RestaurantUser)
}
