import cluster from 'cluster';
import { ChildProcess } from 'child_process';
import queryHandler from './DB';
import IDB from '../../contracts/IDB';
import IDBQuery from '../../contracts/IDBQuery';
import { IS_CLUSTER_MODE } from '../../helpers/EnvHelper';
import AppError from '../../errors/AppError';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["createQuery"] }] */
class InMemoryDB implements IDB {
  public async createQuery(query: IDBQuery): Promise<any> {
    if (IS_CLUSTER_MODE) {
      return InMemoryDB.createClusterQuery(query);
    }

    return InMemoryDB.createNormalQuery(query);
  }

  private static async createClusterQuery(query: IDBQuery): Promise<any> {
    const process: ChildProcess | undefined = cluster.worker?.process;

    if (process === undefined) {
      throw new AppError('Child process not found');
    }

    const queryPromise = new Promise((resolve) => {
      process.send(query);
      process.on('message', (result) => resolve(result));
    });

    return queryPromise;
  }

  private static async createNormalQuery(query: IDBQuery): Promise<any> {
    return queryHandler(query);
  }
}

export default InMemoryDB;
