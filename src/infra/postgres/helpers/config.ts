import { ConnectionOptions } from "typeorm";

export const config: ConnectionOptions = {
   type: 'postgres',
   host: 'kesavan.db.elephantsql.com',
   port: 5432,
   username: 'zwdjuvot',
   database: 'zwdjuvot',
   password: 'jRR_HX5GAAxGFG6L5CXdWNYmj1xUNbhg',
   entities: ['dist/infra/postgres/entities/index.js']
};
