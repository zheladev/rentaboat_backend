import { NextFunction, Request, Response, Router } from "express";
import CreateSupportTicketDTO from "../dtos/createSupportTicket";
import SupportTicket from "../entities/supportTicket";
import User from "../entities/user";
import Controller from "../interfaces/controller";
import RequestWithUser from "../interfaces/requestWithuser";
import { authMiddleware } from "../middleware/auth";
import validateUUID from "../middleware/validation";
import SupportTicketService from "../services/supportTicket";


class SupportTicketController implements Controller {
    public path = "supportTickets";
    public router = Router();
    public supportTicketService = new SupportTicketService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllSupportTickets);
        this.router.get(`${this.path}/:id`, validateUUID, this.getSupportTicketById);
        this.router.post(`${this.path}`, authMiddleware, this.createSupportTicket);
        this.router.all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validateUUID, this.modifySupportTicket)
            .patch(`${this.path}/:id/resolve`, validateUUID, this.resolveSupportTicket)
            .patch(`${this.path}/:id/assign`, validateUUID, this.assignSupportTicketToCurrentUser)
            .delete(`${this.path}/:id`, validateUUID, this.deleteSupportTicket)
    }

    private assignSupportTicketToCurrentUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const user: User = request.user;
        try {
            const assignedTicket = await this.supportTicketService.assignSupportUser(id, user);
            response.send(assignedTicket);
        } catch (error) {
            next(error)
        }
    }

    private resolveSupportTicket = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const resolvedTicket = await this.supportTicketService.resolveTicket(id);
            response.send(resolvedTicket);
        } catch (error) {
            next(error)
        }
    }

    private getAllSupportTickets = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const supportTickets = await this.supportTicketService.getAll();
            response.send(supportTickets);
        } catch (error) {
            next(error)
        }
    }

    private getSupportTicketById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const supportTicket = await this.supportTicketService.getById(id);
            response.send(supportTicket);
        } catch (error) {
            next(error)
        }
    }

    private modifySupportTicket = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const supportTicketData: Partial<SupportTicket> = request.body;
        try {
            //TODO: add proper authorization
            const modifiedSupportTicket = await this.supportTicketService.update(id, supportTicketData);
            response.send(modifiedSupportTicket);
        } catch (error) {
            next(error)
        }
    }

    private deleteSupportTicket = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const deletedSupportTicket = await this.supportTicketService.delete(id);
            response.send(deletedSupportTicket);
        } catch (error) {
            next(error)
        }
    }

    private createSupportTicket = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const supportTicketData: CreateSupportTicketDTO = request.body;
        const user: User = request.user;
        try {
            const createdSupportTicket = await this.supportTicketService.create(supportTicketData, user);
            response.send(createdSupportTicket);
        } catch (error) {
            next(error)
        }
    }
}

export default SupportTicketController;