import InMemoryDBError from '../../errors/InMemoryDBError';
import IDBQuery from '../../contracts/IDBQuery';
import AppError from '../../errors/AppError';

const database: { [table: string]: { [column: string]: any } } = {};

const selectAllRows = (table: string) => database[table];

const selectWhereRows = (table: string, data: string, primaryKey: string) => {
  const result = database[table].find((item: any) => (item[primaryKey] === data));

  return result ?? null;
};

const dropTable = (table: string): void => {
  let tables;

  if (table === '*') {
    tables = Object.keys(database);
  } else {
    tables = [table];
  }

  tables.forEach((item) => delete database[item]);
};

const selectRows = (
  table: string,
  select: string,
  data: string,
  primaryKey: string,
): object[] | object => {
  if (select === '') {
    throw new AppError('"select" option not set');
  }

  switch (select) {
    case '*':
      return selectAllRows(table);
    case 'wherePrimaryKey':
      return selectWhereRows(table, data, primaryKey);
    default:
      throw new InMemoryDBError(`Operation "${select}" not found`);
  }
};

const insertRow = (table: string, data: object): void => {
  database[table].push(data);
};

const updateRow = (
  table: string,
  data: { [primaryKey: string]: string },
  primaryKey: string,
): void => {
  const index = database[table]
    .map((item: any) => item[primaryKey])
    .indexOf(data[primaryKey]);

  if (index === undefined) {
    throw new InMemoryDBError('Index not found');
  }

  database[table][index] = data;
};

const deleteRow = (table: string, data: string | number, primaryKey: string): void => {
  const index = database[table].findIndex((item: any) => item[primaryKey] === data);

  if (index === undefined) {
    throw new InMemoryDBError('Index not found');
  }

  database[table].splice(index, 1);
};

const queryHandler = (query: IDBQuery): object | object[] => {
  const {
    table,
    data,
    select = '',
    type,
    primaryKey = 'id',
  } = query;

  if (database[table] === undefined) {
    database[table] = [];
  }

  let result = {};

  switch (type) {
    case 'drop':
      dropTable(table);
      break;
    case 'select':
      result = selectRows(table, select, data, primaryKey);
      break;
    case 'insert':
      insertRow(table, data);
      break;
    case 'delete':
      deleteRow(table, data, primaryKey);
      break;
    case 'update':
      updateRow(table, data, primaryKey);
      break;
    default:
      throw new InMemoryDBError(`Operation "${type}" not found`);
  }

  return result;
};

export default queryHandler;
