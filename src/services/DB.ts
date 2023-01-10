import { Worker } from 'cluster';
import InMemoryDB from './inMemoryDB';
import queryHandler from './inMemoryDB/DB';
import IDBQuery from '../contracts/IDBQuery';

const db = new InMemoryDB();

const clusterQueryHandler = (query: IDBQuery, worker: Worker): void => {
  const result = queryHandler(query);
  worker.send(result);
};

export {
  db,
  clusterQueryHandler,
};
