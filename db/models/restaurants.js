'use strict'

// bcrypt docs: https://www.npmjs.com/package/bcrypt
const {
  STRING,
  INTEGER,
  VIRTUAL
} = require('sequelize')

module.exports = db => db.define('restaurants', {
  name: STRING,
  vote_number: INTEGER,
  defaultScope: {},
})

module.exports.associations = (Restaurant, {
  User
}) => {
  Restaurant.belongsTo(User)
}
