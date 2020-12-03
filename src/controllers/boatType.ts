import { NextFunction, Request, Response, Router } from "express";
import BoatType from "../entities/types/boatType";
import Controller from "../interfaces/controller";
import { authMiddleware } from "../middleware/auth";
import BoatTypeService from "../services/boattype";


class BoatTypeController implements Controller {
    public path = "/boat-types";
    public router = Router();
    private boatTypeService = new BoatTypeService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllBoatTypes);
        this.router.get(`${this.path}/:id`, this.getBoatTypeById);
        this.router.post(`${this.path}`, authMiddleware, this.createBoatType);
        this.router.all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, this.modifyBoatType)
            .delete(`${this.path}/:id`, this.deleteBoatType)
    }

    private getAllBoatTypes = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const boatTypes = await this.boatTypeService.getAll();
            response.send(boatTypes)
        } catch (error) {
            next(error);
        }

    }

    private getBoatTypeById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const boatType = await this.boatTypeService.getById(id);
            response.send(boatType)
        } catch (error) {
            next(error);
        }
    }

    private modifyBoatType = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        
        const boatTypeData: Partial<BoatType> = request.body;
        try {
            const updatedBoatType = await this.boatTypeService.update(id, boatTypeData);
            response.send(updatedBoatType);
        } catch (error) {
            next(error);
        }
    }

    private deleteBoatType = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const deletedBoatType = await this.boatTypeService.delete(id);
            response.send(deletedBoatType)
        } catch (error) {
            next(error);
        }
    }

    private createBoatType = async (request: Request, response: Response, next: NextFunction) => {
        const boatTypeData: Partial<BoatType> = request.body;
        try {
            const createdBoatType = await this.boatTypeService.create(boatTypeData);
            response.send(createdBoatType);
        } catch (error) {
            next(error);
        }
    }
}

export default BoatTypeController;