import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller";
import RentalService from "../services/rental";

class RentalController implements Controller {
    public path = "/rentals";
    public router = Router();
    private rentalService = new RentalService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

    }

    private getAllRentals = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const rentals = await this.rentalService.getAll();
            response.send(rentals);
        } catch (error) {
            next(error);
        }
    }

    private getRentalById = async (request: Request, response: Response, next: NextFunction) => {
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
            const rental = await this.rentalService.getByBoatId(boatId);
        } catch (error) {
            next(error);
        }
    }

    private getRentalUserId = async (request: Request, response: Response, next: NextFunction) => {
        
    }

    private getRentalTenantId = async (request: Request, response: Response, next: NextFunction) => {
        
    }

    private modifyRental = async (request: Request, response: Response, next: NextFunction) => {
        
    }

    private deleteRental = async (request: Request, response: Response, next: NextFunction) => {
        
    }

    private createRental = async (request: Request, response: Response, next: NextFunction) => {
        
    }
}