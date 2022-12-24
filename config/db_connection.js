/*
*    Adding MySQL Module and DB settings from config file.
*/
const mysql = require('mysql2/promise');
const config = require('./db_config');

/*
*   Function to connect and execute DB queries directly to the remote environment db4free.net
*/

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db); // Create MySQL Connection
  const [results, ] = await connection.execute(sql, params); // Execute DB queries and return its result

  return results;
}

module.exports = { query }