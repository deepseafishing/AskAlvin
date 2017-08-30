'use strict'

const app = require('APP'),
  debug = require('debug')(`${app.name}:oauth`),
<<<<<<< Updated upstream
  {
    STRING,
    JSON
  } = require('sequelize')
=======
  { STRING, JSON } = require('sequelize')
>>>>>>> Stashed changes

module.exports = db => {
  const OAuth = db.define(
    'oauths',
    {
      uid: STRING,
      provider: STRING,

      // OAuth v2 fields
      accessToken: STRING,
      refreshToken: STRING,

      // OAuth v1 fields
      token: STRING,
      tokenSecret: STRING,

<<<<<<< Updated upstream
    // The whole profile as JSON
    profileJson: JSON,
  }, {
    // Further reading on indexes:
    // 1. Sequelize and indexes: http://docs.sequelizejs.com/en/2.0/docs/models-definition/#indexes
    // 2. Postgres documentation: https://www.postgresql.org/docs/9.1/static/indexes.html
    indexes: [{
      fields: ['uid'],
      unique: true
    }],
  })
=======
      // The whole profile as JSON
      profileJson: JSON
    },
    {
      // Further reading on indexes:
      // 1. Sequelize and indexes: http://docs.sequelizejs.com/en/2.0/docs/models-definition/#indexes
      // 2. Postgres documentation: https://www.postgresql.org/docs/9.1/static/indexes.html
      indexes: [{ fields: ['uid'], unique: true }]
    }
  )
>>>>>>> Stashed changes

  // OAuth.V2 is a default argument for the OAuth.setupStrategy method - it's our callback function that will execute when the user has successfully logged in
  OAuth.V2 = (accessToken, refreshToken, profile, done) =>
    OAuth.findOrCreate({
      where: {
        provider: profile.provider,
        uid: profile.id
      }
    })
      .spread(oauth => {
        debug(profile)
<<<<<<< Updated upstream
        debug('provider:%s will log in user:{name=%s uid=%s}',
=======
        debug(
          'provider:%s will log in user:{name=%s uid=%s}',
>>>>>>> Stashed changes
          profile.provider,
          profile.displayName,
          profile.id
        )
        oauth.profileJson = profile
        oauth.accessToken = accessToken

        // db.Promise.props is a Bluebird.js method; basically like "all" but for an object whose properties might contain promises.
        // Docs: http://bluebirdjs.com/docs/api/promise.props.html
        return db.Promise.props({
          oauth,
          user: oauth.getUser(),
<<<<<<< Updated upstream
          _saveProfile: oauth.save(),
        })
      })
      .then(({
        oauth,
        user
      }) => user ||
      OAuth.User.create({
        name: profile.displayName,
      })
        .then(user => db.Promise.props({
          user,
          _setOauthUser: oauth.setUser(user)
        }))
        .then(({
          user
        }) => user)
=======
          _saveProfile: oauth.save()
        })
      })
      .then(
        ({ oauth, user }) =>
          user ||
          OAuth.User
            .create({
              name: profile.displayName
            })
            .then(user =>
              db.Promise.props({
                user,
                _setOauthUser: oauth.setUser(user)
              })
            )
            .then(({ user }) => user)
>>>>>>> Stashed changes
      )
      .then(user => done(null, user))
      .catch(done)

  // setupStrategy is a wrapper around passport.use, and is called in authentication routes in server/auth.js
<<<<<<< Updated upstream
  OAuth.setupStrategy =
    ({
      provider,
      strategy,
      config,
      oauth = OAuth.V2,
      passport
    }) => {
      const undefinedKeys = Object.keys(config)
        .map(k => config[k])
        .filter(value => typeof value === 'undefined')
      if (undefinedKeys.length) {
        for (const key in config) {
          if (!config[key]) debug('provider:%s: needs environment var %s', provider, key)
        }
        debug('provider:%s will not initialize', provider)
        return
=======
  OAuth.setupStrategy = ({
    provider,
    strategy,
    config,
    oauth = OAuth.V2,
    passport
  }) => {
    const undefinedKeys = Object.keys(config)
      .map(k => config[k])
      .filter(value => typeof value === 'undefined')
    if (undefinedKeys.length) {
      for (const key in config) {
        if (!config[key])
          debug('provider:%s: needs environment var %s', provider, key)
>>>>>>> Stashed changes
      }

      debug('initializing provider:%s', provider)

      passport.use(new strategy(config, oauth))
    }

  return OAuth
}

<<<<<<< Updated upstream
module.exports.associations = (OAuth, {
  User
}) => {
=======
module.exports.associations = (OAuth, { User }) => {
>>>>>>> Stashed changes
  // Create a static association between the OAuth and User models.
  // This lets us refer to OAuth.User above, when we need to create
  // a user.
  OAuth.User = User
  OAuth.belongsTo(User)
}
