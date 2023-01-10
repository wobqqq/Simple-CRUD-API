import * as dotenv from 'dotenv';

dotenv.config();

export const PORT: number = process.env.PORT === undefined
  ? 4000
  : Number(process.env.PORT);

export const MASTER_PORT: number = process.env.MASTER_PORT === undefined
  ? PORT
  : Number(process.env.MASTER_PORT);

export const { CLUSTER_MODE } = process.env;

export const IS_CLUSTER_MODE: boolean = CLUSTER_MODE === 'on';
