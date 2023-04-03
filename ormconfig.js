const root = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src';

module.exports = {
   type: process.env.DB_CONNECTION,
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   entities: [
      `${root}/infra/repos/postgres/entities/index.{js,ts}`
   ]
}
