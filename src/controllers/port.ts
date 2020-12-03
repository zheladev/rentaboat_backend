import { NextFunction, Request, Response, Router } from "express";
import CreatePortDTO from "../dtos/createPort";
import Port from "../entities/port";
import Controller from "../interfaces/controller";
import authMiddleware from "../middleware/auth";
import PortService from "../services/port";


class PortController implements Controller {
    public path = "/ports";
    public router = Router();
    public portService = new PortService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPorts);
        this.router.get(`${this.path}/:id`, this.getPortById);
        this.router.post(`${this.path}`, authMiddleware, this.createPort);
        this.router.all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, this.modifyPort)
            .delete(`${this.path}/:id`, this.deletePort)
    }

    private getAllPorts = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const ports = await this.portService.getAll();
            response.send(ports);
        } catch (error) {
            next(error)
        }
    }

    private getPortById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const port = await this.portService.getById(id);
            response.send(port);
        } catch (error) {
            next(error)
        }
    }

    private modifyPort = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const portData: Partial<Port> = request.body;
        try {
            //TODO: add proper authorization
            const modifiedPort = await this.portService.update(id, portData);
            response.send(modifiedPort);
        } catch (error) {
            next(error)
        }
    }

    private deletePort = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const deletedPort = await this.portService.delete(id);
            response.send(deletedPort);
        } catch (error) {
            next(error)
        }
    }

    private createPort = async (request: Request, response: Response, next: NextFunction) => {
        const portData: CreatePortDTO = request.body;
        try {
            const createdPort = await this.portService.create(portData);
            response.send(createdPort);
        } catch (error) {
            next(error)
        }
    }
}

export default PortController;