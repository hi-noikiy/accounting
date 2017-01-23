const co = require('co');
const pg = require('pg');
const url = require('url');
const defaultPostgreUrl = require('./.env').postgreUrl;

const postgreUrl = process.env.DATABASE_URL || defaultPostgreUrl;
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
  const client = yield pool.connect();
  return yield client.query(query.text, query.values);
});
