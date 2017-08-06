'use strict'

const {
  STRING,
  TEXT
} = require('sequelize')

module.exports = db => db.define('reviews', {
  title: STRING,
  body: TEXT,
})

// module.exports.associations = (Review, {
// User,
// RestaurantUser,
// Restaurant
// }) => {
// Review.belongsToMany(User, {
// through: RestaurantUser
// })
// Review.belongsToMany(Restaurant, {
// through: RestaurantUser
// })
// Review.hasMany(RestaurantUser)
// }
