export default interface IDBQuery {
  type: string;
  table: string;
  data?: any;
  select?: string;
  primaryKey?: string;
}
