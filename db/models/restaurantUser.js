'use strict'

const {
  STRING,
  INTEGER,
  BOOLEAN,
  TEXT
} = require('sequelize')

module.exports = db => db.define('restaurantUsers', {
  access: {
    type: BOOLEAN,
    defaultValue: false
  },
  review: {
    type: TEXT,
    defaultValue: ''
  }
})

module.exports.associations = (RestaurantUser, {
  User,
  Restaurant,
  // Review
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
