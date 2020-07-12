[![Build Status](https://travis-ci.org/cjrpostma/repair-cycle-api.svg?branch=master)](https://travis-ci.org/cjrpostma/repair-cycle-api)
[![Coverage Status](https://coveralls.io/repos/github/cjrpostma/repair-cycle-api/badge.svg?branch=chore/ci)](https://coveralls.io/github/cjrpostma/repair-cycle-api?branch=chore/ci)
[![Maintainability](https://api.codeclimate.com/v1/badges/5e1f96c03eaae74d97ed/maintainability)](https://codeclimate.com/github/cjrpostma/repair-cycle-api/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5e1f96c03eaae74d97ed/test_coverage)](https://codeclimate.com/github/cjrpostma/repair-cycle-api/test_coverage)

### 1. Abstract

This is a simple prototype RESTful API built to practice Node/Express and specifically, generating JSON Web Tokens for authentication and authorization.

Learning goals:

- [x] Write a util to generate a JWT
- [x] Write middleware to verify a JWT
- [x] Practice writing protected routes
- [x] Hashing passwords prior to storage
- [x] Creating a database connection pool that functions in dev and prod environments
- [x] Practice organizing a RESTful API directory structure in various ways
- [x] Utilize various middle to rate limit, handle CORS, etc.
- [x] Practice setting variables for multiple environments
- [x] Deploy to Heroku and utilize Heroku Postgres addon
- [x] Practice implementing a CI pipeline via Travis CI with automated deployment to Heroku and test coverage reporting via Coveralls

### 2. Technology

- Node
- Express
- Postgres
- jsonwebtoken
- Heroku with Postgres addon

### 3. Deployment

https://repair-cycle-api.herokuapp.com/api/v1

###### Register a new user
POST `/users/register`

Provide the following JSON in the request body:
```javascript
{
  "name": "<Your name>",
  "email": "<Your email>",
  "password": "<A password (min length 6)>",
}
```

###### Log in as a user (email, password)
POST `/users/login`

Provide the following JSON in the request body:
```javascript
{
  "email": "<Email you registered with>",
  "password": "<Password you registered with>",
}
```

###### Get all users (protected route)
GET `/users`

Provide the following HTTP Header:
`Authorization: Bearer <Your JWT>`



