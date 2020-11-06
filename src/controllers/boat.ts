import { NextFunction, Request, Response, Router } from "express";
import User from "../entities/user";
import Controller from "../interfaces/controller";
import RequestWithUser from "../interfaces/requestWithuser";
import authMiddleware from "../middleware/auth";
import BoatService from "../services/boat";


class BoatController implements Controller {
    public path = "/boats";
    public router = Router();
    private boatService = new BoatService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllBoats);
        this.router.get(`${this.path}/:id`, this.getBoatById);
        this.router.all(`${this.path}/*`, authMiddleware)
            .post(`${this.path}`, this.createBoat)
            .patch(`${this.path}/:id`, this.modifyBoat)
            .delete(`${this.path}/:id`, this.deleteBoat);
    }

    private getAllBoats = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const boats = await this.boatService.getAll();
            response.send(boats)
        } catch (error) {
            next(error);
        }

    }

    private getBoatById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const boat = await this.boatService.getById(id);
            response.send(boat)
        } catch (error) {
            next(error);
        }
    }

    private modifyBoat = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        //TODO: modify boat DTO
        const boatData = request.body;
        try {
            const updatedBoat = await this.boatService.update(id, boatData);
            response.send(updatedBoat);
        } catch (error) {
            next(error);
        }
    }

    private deleteBoat = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const deletedBoat = await this.boatService.delete(id);
            response.send(deletedBoat)
        } catch (error) {
            next(error);
        }
    }

    private createBoat = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const user: User = request.user;
        const boatData = request.body;
        try {
            //TODO: add user
            const createdBoat = await this.boatService.create(boatData);
            response.send(createdBoat);
        } catch (error) {
            next(error);
        }
    }
}