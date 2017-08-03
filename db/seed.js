'use strict'

const db = require('APP/db'),
  {
    User,
    Restaurant,
    RestaurantUser,
    Review,
    Promise,
  } = db,
  {
    mapValues
  } = require('lodash')

function seedEverything() {
  const seeded = {
    users: users(),
    restaurants: restaurants(),
    reviews: reviews()
  }

  seeded.restaurantUsers = restaurantUsers(seeded)
  // seeded.histories = histories(seeded)

  return Promise.props(seeded)
}

// users, restaurants, restaurantUsers, reviews
//
const users = seed(User, {
  a: {
    first_name: 'god',
    last_name: 'god',
    email: 'god@god.god',
    password: 'god',
    level: 1,
    experience: 0,
    isAdmin: false
  },
  b: {
    first_name: 'Stanley',
    last_name: 'Tiu',
    email: 'stanleytiu7@gmail.com',
    password: '1234',
    level: 9999,
    experience: 99999,
    isAdmin: true
  },
  c: {
    first_name: 'Won Jun',
    last_name: 'Kang',
    email: 'wonjunkang@naver.com',
    password: '1234',
    level: 9998,
    experience: 99998,
    isAdmin: true
  },
})

const restaurants = seed(Restaurant, {
  a: {
    name: 'something',
    address: '123 fake street from Google',
    location: [40.741895, -73.989308]
  },
  b: {
    name: 'hello',
    address: '321 hello street from Google',
    location: [37.8077876, -122.47520070000002]
  },
  c: {
    name: 'what',
    address: '213 trump way from trump',
    location: [40.7623737, -73.97391189999996]
  }
})
const reviews = seed(Review, {
  a: {
    title: 'Hello',
    body: 'WORLDWORLDWORLD'
  },
  b: {
    title: 'I am',
    body: 'What I eat'
  },
  c: {
    title: 'I think',
    body: 'therefore I am'
  },
  d: {
    title: 'Where',
    body: 'and when'
  },
  e: {
    title: 'Luke',
    body: 'I am your father'
  },
  f: {
    title: 'NOOOOOOOOOOOO',
    body: 'NOOOOOOOOOOOOO'
  }
})
const restaurantUsers = seed(RestaurantUser, ({
  restaurants,
  users,
  reviews
}) => ({
  a: {
    restaurant_id: restaurants.a.id,
    user_id: users.a.id,
    review_id: reviews.a.id,
    access: true
  },
  b: {
    restaurant_id: restaurants.a.id,
    user_id: users.b.id,
    review_id: reviews.b.id,
  },
  c: {
    restaurant_id: restaurants.b.id,
    user_id: users.c.id,
    review_id: reviews.c.id,
  },
  d: {
    restaurant_id: restaurants.b.id,
    user_id: users.a.id,
    review_id: reviews.d.id,
  }
}))

/*
 *const histories = seed(History, ({
 *  users,
 *  restaurants
 *}) => ({
 *  a: {
 *    restaurant_id: restaurants.a.id,
 *    user_id: users.a.id
 *  },
 *  b: {
 *    restaurant_id: restaurants.b.id,
 *    user_id: users.c.id
 *  },
 *  c: {
 *    restaurant_id: restaurants.a.id,
 *    user_id: users.a.id
 *  }
 *}))
 */

if (module === require.main) {
  db.didSync
    .then(() => db.sync({
      force: true
    }))
    .then(seedEverything)
    .finally(() => process.exit(0))
}

class BadRow extends Error {
  constructor(key, row, error) {
    super(error)
    this.cause = error
    this.row = row
    this.key = key
  }

  toString() {
    return `[${this.key}] ${this.cause} while creating ${JSON.stringify(this.row, 0, 2)}`
  }
}

function seed(Model, rows) {
  return (others = {}) => {
    if (typeof rows === 'function') {
      rows = Promise.props(
        mapValues(others,
          other =>
            typeof other === 'function' ? other() : other)
      ).then(rows)
    }

    return Promise.resolve(rows)
      .then(rows => Promise.props(
        Object.keys(rows)
          .map(key => {
            const row = rows[key]
            return {
              key,
              value: Promise.props(row)
                .then(row => Model.create(row)
                  .catch(error => {
                    throw new BadRow(key, row, error)
                  })
                )
            }
          }).reduce(
            (all, one) => Object.assign({}, all, {
              [one.key]: one.value
            }), {}
          )
      ))
      .then(seeded => {
        console.log(`Seeded ${Object.keys(seeded).length} ${Model.name} OK`)
        return seeded
      }).catch(error => {
        console.error(`Error seeding ${Model.name}: ${error} \n${error.stack}`)
      })
  }
}

module.exports = Object.assign(seed, {
  users,
})
