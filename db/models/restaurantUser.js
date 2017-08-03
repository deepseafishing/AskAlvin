'use strict'

const {
  STRING,
  INTEGER,
  BOOLEAN
} = require('sequelize')

module.exports = db => db.define('restaurantUsers', {
  access: {
    type: BOOLEAN,
    defaultValue: false
  }
})

module.exports.associations = (RestaurantUser, {
  User,
  Restaurant,
  Review
}) => {
  RestaurantUser.belongsTo(User)
  RestaurantUser.belongsTo(Restaurant)
  RestaurantUser.belongsTo(Review)
}
