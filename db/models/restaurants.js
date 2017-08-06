'use strict'

const {
  JSON
} = require('sequelize')

module.exports = db => db.define('restaurants', {
  marker: JSON
  // inside of the json is going to be lat: some #, long: some #
})

module.exports.associations = (Restaurant, {
  User,
  RestaurantUser,
  Review
}) => {
  Restaurant.belongsToMany(User, {
    through: RestaurantUser
  })
  // Restaurant.belongsToMany(Review, {
  // through: RestaurantUser
  // })
  Restaurant.hasMany(RestaurantUser)
}
