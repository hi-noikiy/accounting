require('dotenv').config();
const co = require('co');
const pg = require('pg');
const url = require('url');

function getConfig() {
  if (process.env.DATABASE_URL) {
    const params = url.parse(process.env.DATABASE_URL);
    const auth = params.auth.split(':');
    return {
      user: auth[0],
      password: auth[1],
      host: params.hostname,
      port: params.port,
      database: params.pathname.split('/')[1],
      ssl: true,
    };
  }
  return {
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    ssl: process.env.PG_SSL,
  };
}

const config = getConfig();

const pool = new pg.Pool(config);

pool.on('error', err => {
  console.error('idle client error', err.message, err.stack);
});

const sql = co.wrap(function* (query) {
  if (!query) {
    return false;
  }
  try {
    return yield pool.query(query.text, query.values);
  } catch (error) {
    return error;
  }
});
sql.__proto__.prefix = process.env.DATATABLE_PREFIX || '';

module.exports = sql;
