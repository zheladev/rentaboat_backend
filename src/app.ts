import * as express from 'express';
import Controller from 'interfaces/controller';
import 'dotenv/config';
import errorMiddleware from './middleware/errorHandler';
import cors = require('cors');

const corsOptions: cors.CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'Authorization'
    ],
    exposedHeaders: ['X-Access-Token'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    preflightContinue: false,
  };

/**
 *
 *
 * @class App
 */
class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: Controller[], middlewares: any[], port: number) {
        this.app = express();
        this.port = port;
        
        this.enableCORS();
        this.app.use(express.static('public'));
        this.initializeMiddlewares(middlewares);
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
         //expose public folder
    }

    /**
     * Enables CORS on the server.
     *
     * @memberof App
     */
    enableCORS() {
        this.app.use(cors(corsOptions));
    }

    /**
     * Initializes app with given controllers
     *
     * @param {Array<Controller>} controllers
     * @memberof App
     */
    initializeControllers(controllers: Array<Controller>) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        })
    }


    /**
     * Uses given middlewares on app
     *
     * @param {Array<any>} middlewares
     * @memberof App
     */
    initializeMiddlewares(middlewares: Array<any>) {
        middlewares.forEach((middleware) => {
            this.app.use(middleware);
        })
    }

    /**
     *
     *
     * @private
     * @memberof App
     */
    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    /**
     * Starts the app and serves it
     *
     * @memberof App
     */
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on ${this.port}`)
        })
    }
}

export default App;
