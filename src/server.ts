import 'reflect-metadata';
import App from './app';
import * as bodyParser from 'body-parser';
import errorMiddleware from './middleware/error.middleware';
import loggerMiddleware from './middleware/routeLogger.middleware';
import config from './typeorm-config';
import { createConnection } from 'typeorm';
import cookieParser = require('cookie-parser');



(async () => {
  try {
    await createConnection(config);
} catch(error){
    console.log('Error while connecting to the database\n', error);
    return error;
}
  const app = new App(
    [/*add controllers here */],
    [
      bodyParser.json(),
      loggerMiddleware,
      errorMiddleware,
      cookieParser(),
    ],
    3000,
  );
  app.listen();
})();
