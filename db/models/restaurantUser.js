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
  RestaurantUser.belongsTo(User, {
    onDelete: 'CASCADE'
  })
  RestaurantUser.belongsTo(Restaurant, {
    onDelete: 'CASCADE'
  })
  // RestaurantUser.belongsTo(Review, {
  // onDelete: 'CASCADE'
  // })
}
