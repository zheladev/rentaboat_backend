import 'reflect-metadata';
import App from './app';
import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/routeLogger';
import config from './typeorm-config';
import { createConnection } from 'typeorm';
import cookieParser = require('cookie-parser');
import UserController from './controllers/user';
import AuthenticationController from './controllers/auth';
import authMiddleware from './middleware/auth';
import BoatController from './controllers/boat';



(async () => {
    try {
        await createConnection(config);
    } catch (error) {
        console.log('Error while connecting to the database\n', error);
        return error;
    }
    const app = new App(
        [
            new UserController(),
            new AuthenticationController(),
            new BoatController(),
        ],
        [
            bodyParser.json(),
            loggerMiddleware,
            cookieParser(),
        ],
        3000,
    );
    app.listen();
})();
