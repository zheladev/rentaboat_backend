import * as express from 'express';
import Controller from 'interfaces/controller';
import 'dotenv/config';
import errorMiddleware from './middleware/errorHandler';

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: Controller[], middlewares: any[], port: number) {
        this.app = express();
        this.port = port;
        
        this.initializeMiddlewares(middlewares);
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    initializeControllers(controllers: Array<Controller>) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        })
    }


    initializeMiddlewares(middlewares: Array<any>) {
        middlewares.forEach((middleware) => {
            this.app.use(middleware);
        })
    }

    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on ${this.port}`)
        })
    }
}

export default App;
