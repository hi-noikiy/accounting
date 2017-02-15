require('dotenv').config();
const co = require('co');
const pg = require('pg');
const url = require('url');

const postgreUrl = process.env.DATABASE_URL;
const params = url.parse(postgreUrl);

const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true,
};

const pool = new pg.Pool(config);

pool.on('error', err => {
  console.error('idle client error', err.message, err.stack);
});

module.exports = co.wrap(function* (query) {
  if (!query) {
    return false;
  }
  try {
    return yield pool.query(query.text, query.values);
  } catch (error) {
    return error;
  }
});
