'use strict'

const {
  STRING,
  ARRAY,
  DOUBLE
} = require('sequelize')

module.exports = db => db.define('restaurants', {
  name: STRING,
  address: STRING,
  // inside of the json is going to be lat: some #, long: some #
  location: ARRAY(DOUBLE)
})

module.exports.associations = (Restaurant, {
  User,
  RestaurantUser,
  Review
}) => {
  Restaurant.belongsToMany(User, {
    through: RestaurantUser
  })
  Restaurant.belongsToMany(Review, {
    through: RestaurantUser
  })
  Restaurant.hasMany(RestaurantUser)
}
