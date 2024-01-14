let dotenv = require('dotenv').config()

module.exports = {
    host: dotenv.parsed.HOST,
    user: dotenv.parsed.USER,
    password: dotenv.parsed.PASSWORD,
    database: dotenv.parsed.DATABASE
}