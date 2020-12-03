import { NextFunction, Request, Response, Router } from "express";
import CreateShipyardDTO from "../dtos/createShipyard";
import Shipyard from "../entities/shipyard";
import Controller from "../interfaces/controller";
import { authMiddleware } from "../middleware/auth";
import ShipyardService from "../services/shipyard";


class ShipyardController implements Controller {
    public path = "shipyards";
    public router = Router();
    public shipyardService = new ShipyardService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllShipyards);
        this.router.get(`${this.path}/:id`, this.getShipyardById);
        this.router.post(`${this.path}`, authMiddleware, this.createShipyard);
        this.router.all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, this.modifyShipyard)
            .delete(`${this.path}/:id`, this.deleteShipyard)
    }

    private getAllShipyards = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const shipyards = await this.shipyardService.getAll();
            response.send(shipyards);
        } catch (error) {
            next(error)
        }
    }

    private getShipyardById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const shipyard = await this.shipyardService.getById(id);
            response.send(shipyard);
        } catch (error) {
            next(error)
        }
    }

    private modifyShipyard = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const shipyardData: Partial<Shipyard> = request.body;
        try {
            //TODO: add proper authorization
            const modifiedShipyard = await this.shipyardService.update(id, shipyardData);
            response.send(modifiedShipyard);
        } catch (error) {
            next(error)
        }
    }

    private deleteShipyard = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const deletedShipyard = await this.shipyardService.delete(id);
            response.send(deletedShipyard);
        } catch (error) {
            next(error)
        }
    }

    private createShipyard = async (request: Request, response: Response, next: NextFunction) => {
        const shipyardData: CreateShipyardDTO = request.body;
        try {
            const createdShipyard = await this.shipyardService.create(shipyardData);
            response.send(createdShipyard);
        } catch (error) {
            next(error)
        }
    }
}

export default ShipyardController;