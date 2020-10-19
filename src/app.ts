import * as express from 'express';
import Controller from 'interfaces/controller.interface';
import 'dotenv/config';

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: Controller[], middlewares: any[], port: number) {
        this.app = express();
        this.port = port;
        
        this.initializeMiddlewares(middlewares);
        this.initializeControllers(controllers);

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

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on ${this.port}`)
        })
    }
}

export default App;
