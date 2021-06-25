#!/usr/bin/env node
// @ts-check
const { default: Meyer } = require('meyer');
const { default: KnexDbms } = require('meyer-dbms-knex');
const path = require('path');
const parse = require('pg-connection-string').parse;

if (!process.env.DATABASE_URL) {
  console.error('No database URL provided from environment');
  process.exit(1);
}

let ssl = true;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// if (process.env.NODE_ENV === 'production') {
//   ssl = true
// }

async function run() {
  const options = parse(process.env.DATABASE_URL);

  /** @type import('knex').PgConnectionConfig */
  const options2 = {
    ...options,
    port: Number(options.port),
    ssl: Boolean(ssl || options.ssl),
  };
  const dbms = new KnexDbms('pg', options2);
  const meyer = new Meyer({
    tableName: '_migrations',
    migrationsPath: path.join(__dirname, '..', 'migrations'),
    development: process.env.MIGRATION_MODE === 'development',
    dbms,
  });

  await meyer.execute();
  await dbms.close();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
