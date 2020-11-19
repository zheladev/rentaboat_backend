import { NextFunction, Request, Response, Router } from "express";
import { create } from "ts-node";
import CreateRentalDTO from "../dtos/createRental";
import Rental from "../entities/rental";
import User from "../entities/user";
import Controller from "../interfaces/controller";
import RequestWithUser from "../interfaces/requestWithuser";
import authMiddleware from "../middleware/auth";
import RentalService from "../services/rental";

class RentalController implements Controller {
    public path = "/rentals";
    public router = Router();
    private rentalService = new RentalService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllRentals);
        this.router.get(`${this.path}/:id`, this.getRentalById);
        this.router.get(`${this.path}/boat/:id`, this.getRentalsByBoatId);
        this.router.post(`${this.path}`, authMiddleware, this.createRental);
        this.router.all(`${this.path}/*`, authMiddleware)
            .get(`${this.path}/user/:id`, this.getRentalsByUserId)
            .get(`${this.path}/tenant/:id`, this.getRentalsByTenantId)
            .patch(`${this.path}/:id`, this.modifyRental)
            .delete(`${this.path}/:id`, this.deleteRental);
    }

    private getAllRentals = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const rentals = await this.rentalService.getAll();
            response.send(rentals);
        } catch (error) {
            next(error);
        }
    }

    private getRentalById = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const rental = await this.rentalService.getById(id);
            response.send(rental);
        } catch (error) {
            next(error);
        }
    }

    private getRentalsByBoatId = async (request: Request, response: Response, next: NextFunction) => {
        const boatId = request.params.id;
        try {
            const rentals = await this.rentalService.getByBoatId(boatId);
            response.send(rentals);
        } catch (error) {
            next(error);
        }
    }

    private getRentalsByUserId = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const userId = request.params.id;
        const user: User = request.user; 
        try {
            const rentals = await this.rentalService.getByUserId(userId, user);
            response.send(rentals);
        } catch (error) {
            next(error)
        }
    }

    private getRentalsByTenantId = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const tenantId = request.params.id;
        const user: User = request.user;
        try {
            const rentals = await this.rentalService.getByTenantId(tenantId, user);
            response.send(rentals);
        } catch (error) {
            next(error)
        }
    }

    private modifyRental = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const user: User = request.user;
        const rentalData: Partial<Rental> = request.body;
        try {
            const modifiedRental = await this.rentalService.update(id, rentalData);
            response.send(modifiedRental);
        } catch (error) {
            next(error)
        }
    }

    private deleteRental = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
        const deletedRental = await this.rentalService.delete(id);
        response.send(deletedRental);
        } catch (error) {
            next(error)
        }
    }

    private createRental = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const rentalData: CreateRentalDTO = request.body;
        const user: User = request.user;
        try {
            const createdRental = await this.rentalService.create(rentalData, user);
            response.send(createdRental);
        } catch (error) {
            next(error)
        }
    }
}

export default RentalController;