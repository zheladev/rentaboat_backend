import { NextFunction, Request, Response, Router } from "express";
import CreateBoatDto from "../dtos/createBoat";
import PostCommentDTO from "../dtos/postComment";
import PostRatingDTO from "../dtos/postRating";
import Comment from "../entities/comment";
import User from "../entities/user";
import Controller from "../interfaces/controller";
import RequestWithUser from "../interfaces/requestWithuser";
import { ISearchCriteria } from "../interfaces/searchCriteria";
import { authMiddleware } from "../middleware/auth";
import validateUUID from "../middleware/validation";
import BoatService from "../services/boat";
import { parseSearchCriteriaStr } from "../utils/SearchCriteriaParser";


class BoatController implements Controller {
    public path = "/boats";
    public router = Router();
    private boatService = new BoatService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllBoats);
        this.router.get(`${this.path}/:id`, validateUUID, this.getBoatById);
        this.router.get(`${this.path}/owner/:id`, this.getBoatByOwnerId);
        this.router.post(`${this.path}`, authMiddleware, this.createBoat);
        this.router.post(`${this.path}/:id/comment`, authMiddleware, this.postComment);
        this.router.post(`${this.path}/:id/rating`, authMiddleware, this.postRating);
        this.router.all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validateUUID, this.modifyBoat)
            .delete(`${this.path}/:id`, validateUUID, this.deleteBoat)
    }
    private getAllBoats = async (request: Request, response: Response, next: NextFunction) => {
        const rawQueryParams = request.query.search as string || '';
        const take = Number(request.query.limit as string) || 10;
        const skip = Number(request.query.page as string) || 0;
        console.log(rawQueryParams);
        const searchCriteriaArr: ISearchCriteria[] = parseSearchCriteriaStr(rawQueryParams);
        try {
            const boats = await this.boatService.getAll(skip, take, searchCriteriaArr);
            response.send(boats)
        } catch (error) {
            next(error);
        }

    }

    private getBoatByOwnerId = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const boats = await this.boatService.getByUserId(id);
            response.send(boats);
        } catch (error) {
            next(error);
        }
    }

    private getBoatById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const boat = await this.boatService.getById(id);
            response.send(boat);
        } catch (error) {
            next(error);
        }
    }

    private modifyBoat = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const user = request.user;
        
        const boatData: Partial<CreateBoatDto> = request.body;
        try {
            const updatedBoat = await this.boatService.updateWithUser(id, boatData, user);
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
        const boatData: CreateBoatDto = request.body;
        try {
            const createdBoat = await this.boatService.create(boatData, user);
            response.send(createdBoat);
        } catch (error) {
            next(error);
        }
    }

    private postComment = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const user: User = request.user;
        const boatId = request.params.id;
        const commentData: PostCommentDTO = request.body;
        try {
            const comment = await this.boatService.postComment(boatId, commentData, user);
            response.send(comment);
        } catch(error) {
            next(error);
        }
    }

    private postRating = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const user: User = request.user;
        const boatId = request.params.id;
        const ratingData: PostRatingDTO = request.body;
        try {
            const rating = await this.boatService.postRating(boatId, ratingData, user);
            response.send(rating);
        } catch(error) {
            next(error);
        }
    }
}

export default BoatController;