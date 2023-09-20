import pg from "pg";
import { Connector } from '@google-cloud/cloud-sql-connector';
// import dotenv from 'dotenv';
// dotenv.config();
const { Pool } = pg;

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.INSTANCE_UNIX_SOCKET,
  ipType: 'PUBLIC', 
});

const dbConfig = {
  ...clientOpts,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
};

const client = new Pool(dbConfig);

export default client;