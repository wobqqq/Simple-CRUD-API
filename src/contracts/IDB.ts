import IDBQuery from './IDBQuery';

export default interface IDB {
  createQuery(query: IDBQuery): any;
}
