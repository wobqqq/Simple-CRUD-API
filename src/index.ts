import http, { IncomingMessage, Server, ServerResponse } from 'http';
import os from 'os';
import cluster from 'cluster';
import { clusterQueryHandler } from './services/DB';
import httpHandler from './http';
import IDBQuery from './contracts/IDBQuery';
import {
  PORT, CLUSTER_MODE, MASTER_PORT, IS_CLUSTER_MODE,
} from './helpers/EnvHelper';
import initRoutes from './routes';
import router from './services/Router';
import statusCodes from './http/StatusCodes';

const slavePorts = os
  .cpus()
  .map((item, i) => MASTER_PORT + i)
  .filter((item) => item !== MASTER_PORT);
let slavePortIndex = 0;

const httpProxyHandler = async (masterRequest: IncomingMessage, masterResponse: ServerResponse) => {
  slavePortIndex = (slavePortIndex + 1) % slavePorts.length;
  const slavePort = slavePorts[slavePortIndex];
  const options = {
    port: slavePort,
    path: masterRequest.url,
    method: masterRequest.method,
    headers: masterRequest.headers,
  };

  const proxy = await http.request(options, (slaveResponse: IncomingMessage) => {
    const statusCode = slaveResponse.statusCode === undefined
      ? statusCodes.NOT_FOUND
      : slaveResponse.statusCode;

    masterResponse.writeHead(statusCode, slaveResponse.headers);
    slaveResponse.pipe(masterResponse, { end: true });
  });

  masterRequest.pipe(proxy, { end: true });
};

const createServer = (): Server => {
  const server = http.createServer(async (masterRequest, masterResponse) => {
    const isHttpProxy = PORT === MASTER_PORT && IS_CLUSTER_MODE;

    if (isHttpProxy) {
      await httpProxyHandler(masterRequest, masterResponse);
    } else {
      await httpHandler(masterRequest, masterResponse);
    }
  });

  /* eslint no-console: ["error", { allow: ["log", "info"] }] */
  server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));

  return server;
};

const createFork = (i: number): void => {
  const forkPort = PORT + i;
  const worker = cluster.fork({
    PORT: forkPort,
    MASTER_PORT: PORT,
    CLUSTER_MODE,
  });
  worker.on('message', (query: IDBQuery) => clusterQueryHandler(query, worker));
};

const createCluster = (): void => {
  const cpus = os.cpus();
  Object
    .values(cpus)
    .forEach((value, i) => createFork(i));
};

const createClusterServer = (): Server | null => {
  if (cluster.isPrimary) {
    createCluster();
  } else {
    return createServer();
  }

  return null;
};

const startServer = (): Server | null => {
  initRoutes(router);

  if (IS_CLUSTER_MODE) {
    return createClusterServer();
  }

  return createServer();
};

export default startServer;
