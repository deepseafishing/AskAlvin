'use strict'

// bcrypt docs: https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcryptjs'),
  {
    BOOLEAN,
    STRING,
    INTEGER,
    VIRTUAL
  } = require('sequelize')

module.exports = db =>
  db.define(
    'users', {
      name: STRING,
      cohort: STRING,
      email: {
        type: STRING,
        notNull: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      photo: STRING,
      level: {
        type: INTEGER,
        defaultValue: 1
      },
      experience: {
        type: INTEGER,
        defaultValue: 0
      },
      isAdmin: {
        type: BOOLEAN,
        defaultValue: false
      },

      // We support oauth, so users may or may not have passwords.
      password_digest: STRING, // This column stores the hashed password in the DB, via the beforeCreate/beforeUpdate hooks
      password: VIRTUAL // Note that this is a virtual, and not actually stored in DB
    }, {
      indexes: [{
        fields: ['email'],
        unique: true
      }],
      hooks: {
        beforeCreate: setEmailAndPassword,
        beforeUpdate: setEmailAndPassword
      },
      defaultScope: {
        attributes: {
          exclude: ['password_digest']
        }
      },
      instanceMethods: {
        // This method is a Promisified bcrypt.compare
        authenticate(plaintext) {
          return bcrypt.compare(plaintext, this.password_digest)
        },
        // increase user's exp using this instance method!
        exp_gain(pts) {
          this.exp = this.exp + pts
          console.log('exp: ', this.exp)
        }
      }
    }
  )

module.exports.associations = (
  User, {
    OAuth,
    Restaurant,
    RestaurantUser
    // Review
  }
) => {
  User.hasOne(OAuth)
  User.belongsToMany(Restaurant, {
    through: RestaurantUser
  })
  // User.belongsToMany(Review, {
  // through: RestaurantUser
  // })
  User.hasMany(RestaurantUser)
}

function setEmailAndPassword(user) {
  user.email = user.email && user.email.toLowerCase()
  if (!user.password) return Promise.resolve(user)

  return bcrypt
    .hash(user.get('password'), 10)
    .then(hash => user.set('password_digest', hash))
}
