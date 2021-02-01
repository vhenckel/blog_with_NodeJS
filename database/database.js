const Env = require('dotenv').config().parsed

const DB_HOST = Env.DB_HOST
const DB_PORT = Env.DB_PORT
const DB_USER = Env.DB_USER
const DB_PASSWORD = Env.DB_PASSWORD
const DB_DATABASE = Env.DB_DATABASE

const Sequelize = require('sequelize')
const connection = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: DB_PORT,
  timezone: "-03:00"
})

module.exports = connection