'use strict'

module.exports = db => db.define('histories', {})

module.exports.associations = (History, {
  Restaurant,
  User
}) => {
  History.belongsTo(User)
  History.belongTo(Restaurant)
}
