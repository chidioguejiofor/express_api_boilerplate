/* eslint-disable */
require('dotenv/config');

const { parse } = require('pg-connection-string');

const connectionObj = parse(process.env.DATABASE_URL);

module.exports = {
  development: {
    ...connectionObj,
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    ...connectionObj,
    dialect: 'postgres',
  },
};
