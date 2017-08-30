const app = require('APP'),
  { env } = app
const debug = require('debug')(`${app.name}:auth`)
const passport = require('passport')
const axios = require('axios')

const { User, OAuth } = require('APP/db')
const auth = require('express').Router()
const axios = require('axios')

if (process.env.NODE_ENV !== 'production') require('../secret')

/*************************
 * Auth strategies
 *
 * The OAuth model knows how to configure Passport middleware.
 * To enable an auth strategy, ensure that the appropriate
 * environment variables are set.
 *
 * You can do it on the command line:
 *
 *   FACEBOOK_CLIENT_ID=abcd FACEBOOK_CLIENT_SECRET=1234 npm run dev
 *
 * Or, better, you can create a ~/.$your_app_name.env.json file in
 * your home directory, and set them in there:
 *
 * {
 *   FACEBOOK_CLIENT_ID: 'abcd',
 *   FACEBOOK_CLIENT_SECRET: '1234',
 * }
 *
 * Concentrating your secrets this way will make it less likely that you
 * accidentally push them to Github, for example.
 *
 * When you deploy to production, you'll need to set up these environment
 * variables with your hosting provider.
 **/

// Facebook needs the FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET
// environment variables.
OAuth.setupStrategy({
  provider: 'facebook',
  strategy: require('passport-facebook').Strategy,
  config: {
    clientID: env.FACEBOOK_CLIENT_ID,
    clientSecret: env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${app.baseUrl}/api/auth/login/facebook`
  },
  passport
})

// Google needs the GOOGLE_CLIENT_SECRET AND GOOGLE_CLIENT_ID
// environment variables.
OAuth.setupStrategy({
  provider: 'google',
  strategy: require('passport-google-oauth').OAuth2Strategy,
  config: {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${app.baseUrl}/api/auth/login/google`
  },
  passport
})

// Github needs the GITHUB_CLIENT_ID AND GITHUB_CLIENT_SECRET
// environment variables.
OAuth.setupStrategy({
  provider: 'github',
  strategy: require('passport-github2').Strategy,
  config: {
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: `${app.baseUrl}/api/auth/login/github`
  },
  passport
})

// Other passport configuration:
// Passport review in the Week 6 Concept Review:
// https://docs.google.com/document/d/1MHS7DzzXKZvR6MkL8VWdCxohFJHGgdms71XNLIET52Q/edit?usp=sharing
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  debug('will deserialize user.id=%d', id)
  User.findById(id)
    .then(user => {
      if (!user) debug('deserialize retrieved null user for id=%d', id)
      else debug('deserialize did ok user.id=%d', id)
      done(null, user)
    })
    .catch(err => {
      debug('deserialize did fail err=%s', err)
      done(err)
    })
})

// require.('passport-local').Strategy => a function we can use as a constructor, that takes in a callback
passport.use(
  new (require('passport-local')).Strategy(async (email, password, done) => {
    debug('will authenticate user(email: "%s")', email)
<<<<<<< Updated upstream
    try {
      const tokenRes = await axios.post(
        'https://learn.fullstackacademy.com/auth/local',
        {
          email,
          password
        }
      )
      const token = tokenRes.data.token
      const user = await axios.request({
        url: 'https://learn.fullstackacademy.com/api/users/me',
        method: 'get',
        headers: {
          Cookie: `token=${token};`
        }
      })
      const cohort = await axios.request({
        url: `https://learn.fullstackacademy.com/api/cohorts/${user.data
          .cohort}`,
        method: 'get',
        headers: {
          Cookie: `token=${token};`
        }
      })

      User.findOrCreate({
        where: { email: user.data.email },
        defaults: {
          // if the user doesn't exist, create including this info
          password: password,
          name: user.data.fullName,
          photo: `https://s3.amazonaws.com/learndotresources/${user.data
            .photo_url}`,
          cohort: cohort.data.name
        }
      })
        .spread((user, created) => {
          done(null, user)
        })
        .catch(err => {
          throw err
        })
    } catch (err) {
      debug('akldfjlakfjklasjfasdlkf', err)
      done(err)
    }
=======

    axios
      .post('https://learn.fullstackacademy.com/auth/local', {
        email,
        password
      })
      .then((req, res, next) => {
        console.log(res)
      })
      .catch(err => console.log(err))
    // User.findOne({
    //   where: { email },
    //   attributes: { include: ['password_digest'] }
    // })
    //   .then(user => {
    //     if (!user) {
    //       debug('authenticate user(email: "%s") did fail: no such user', email)
    //       return done(null, false, { message: 'Login incorrect' })
    //     }
    //     return user.authenticate(password).then(ok => {
    //       if (!ok) {
    //         debug('authenticate user(email: "%s") did fail: bad password')
    //         return done(null, false, { message: 'Login incorrect' })
    //       }
    //       debug(
    //         'authenticate user(email: "%s") did ok: user.id=%d',
    //         email,
    //         user.id
    //       )
    //       done(null, user)
    //     })
    //   })
    //   .catch(done)
>>>>>>> Stashed changes
  })
)

auth.get('/whoami', (req, res) => res.send(req.user))

// auth.post('/signup/local', (req, res, next) => {
//   User.findOrCreate({
//     where: {
//       email: req.body.email
//     },
//     defaults: {
//       name: req.body.name,
//       password: req.body.password
//     }
//   }).then(([user, created]) => {
//     if (created) {
//       req.logIn(user, err => {
//         if (err) return next(err)
//         res.json(user)
//       })
//     } else {
//       res.sendStatus(401)
//     }
//   })
// })

// POST requests for local login:
auth.post(
  '/login/local',
  passport.authenticate('local', {
    successRedirect: '/'
  })
)

// GET requests for OAuth login:
// Register this route as a callback URL with OAuth provider
<<<<<<< Updated upstream
auth.get('/login/:strategy', (req, res, next) =>
  passport.authenticate(req.params.strategy, {
    scope: 'email', // You may want to ask for additional OAuth scopes. These are
=======
auth.get('/login/:strategy', (req, res, next) => {
  return passport.authenticate(req.params.strategy, {
    // You may want to ask for additional OAuth scopes. These are
>>>>>>> Stashed changes
    // provider specific, and let you access additional data (like
    // their friends or email), or perform actions on their behalf.
    // scope: ['user:email'],
    successRedirect: '/'

    // Specify other config here
  })(req, res, next)
)

auth.post('/logout', (req, res) => {
  req.logout()
  res.redirect('/api/auth/whoami')
})

module.exports = auth
