import { Entity, getRepository } from "typeorm";
import CreateBoatDto from "../dtos/createBoat";
import PostCommentDTO from "../dtos/postComment";
import PostRatingDTO from "../dtos/postRating";
import Boat from "../entities/boat";
import Comment from "../entities/comment";
import Port from "../entities/port";
import Rating from "../entities/rating";
import Shipyard from "../entities/shipyard";
import BoatType from "../entities/types/boatType";
import User from "../entities/user";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import MissingParametersException from "../exceptions/MissingParametersException";
import { ISearchCriteria } from "../interfaces/searchCriteria";
import { parseSearchCriteriaToTypeORMWhereClause } from "../utils/SearchCriteriaParser";
import BaseService from "./baseService";

type BoatFKs = { shipyard: string, boatType: string, port: string };

class BoatService extends BaseService<Boat> {
    private shipyardRepository = getRepository(Shipyard);
    private portRepository = getRepository(Port);
    private boatTypeRepository = getRepository(BoatType);
    private commentRepository = getRepository(Comment);
    private ratingRepository = getRepository(Rating);

    constructor() {
        super(Boat);
    }

    public async getAllPaginated(skip: number = 0, take: number = 40, searchParams: ISearchCriteria[] = []) {
        const commonOptions = {
            take: take,
            skip: skip * take,
            relations: [
                "user",
                "shipyard",
                "boatType",
                "ratings",
                "comments",
                "port"
            ]
        }

        let boats = [];
        let count = 0;
        if (searchParams.length > 0) {
            const whereParams = parseSearchCriteriaToTypeORMWhereClause(searchParams);
            boats = await this.repository.find({
                ...commonOptions,
                where: whereParams,
            })
            count = await this.repository.count({
                where: whereParams,
            })
        } else {
            boats = await this.repository.find({
                ...commonOptions
            });
            count = await this.repository.count();
        }
        return {
            data: boats,
            totalPages: count/take
        };
    }

    public async updateWithUser(id: string, boatData: Partial<CreateBoatDto>, user: User) {
        const boat = await this.repository.findOne({ id: id }, { relations: ["user"] });

        if (boat === undefined) {
            throw new EntityNotFoundException<Boat>(Boat);
        }

        if (!(boat.user.id === user.id || user.userType.intValue <= 1)) {
            throw new ForbiddenActionException("Modify boat");
        }

        await this.update(id, boatData);
        return await this.repository.findOne(id, { relations: ["user", "port", "shipyard", "boatType", "ratings", "comments", "rentals", "rentals.renter"] });
    }

    public async create(boatData: CreateBoatDto, user: User) {
        const { shipyard, boatType, port }: BoatFKs = boatData;
        const lowercaseShipyard = shipyard.toLowerCase();

        const shipyardEntity = await this.getShipyardEntity(lowercaseShipyard);

        const boatTypeEntity = await this.boatTypeRepository.findOne({ name: boatType });

        const portEntity = await this.portRepository.findOne({ name: port });

        if (!(boatTypeEntity && portEntity)) {
            throw new MissingParametersException();
        }

        const createdBoat = await this.repository.create({
            ...boatData,
            shipyard: shipyardEntity,
            boatType: boatTypeEntity,
            port: portEntity,
            user: user,
        });

        await this.repository.save(createdBoat);
        return await this.repository.findOne(createdBoat.id, { relations: ["user", "port", "shipyard", "boatType", "ratings", "comments", "rentals", "rentals.renter"] });
    }

    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<Boat>(Boat);
        }
        await this.repository.update(id, { isDeleted: true });
    }

    public async getById(id: string) {
        const boat = await this.repository.findOne(id, { relations: ["user", "shipyard", "boatType", "ratings", "comments"] });
        if (!boat) {
            throw new EntityNotFoundException<Boat>(Boat);
        }

        return boat;
    }

    public async getByUserId(userId: string) {
        const entity = await this.repository.find({ where: { user: userId }, relations: ["user", "port", "shipyard", "boatType", "ratings", "comments", "rentals", "rentals.renter"], order: { createdAt: "ASC" } });
        if (!entity) {
            throw new EntityNotFoundException<Boat>(Boat);
        }
        return entity;
    }

    public async postComment(boatId: string, commentData: PostCommentDTO, user: User) {
        const boat = await this.repository.findOne(boatId);

        if (!boat) {
            throw new EntityNotFoundException<Boat>(Boat);
        }

        const createdComment = await this.commentRepository.create({
            ...commentData,
            boat: boat,
            user: user
        });
        await this.commentRepository.save(createdComment);

        return this.commentRepository.findOne(createdComment.id);
    }

    public async postRating(boatId: string, ratingData: PostRatingDTO, user: User) {
        const boat = await this.repository.findOne(boatId);

        if (!boat) {
            throw new EntityNotFoundException<Boat>(Boat);
        }

        const createdRating = await this.ratingRepository.create({
            ...ratingData,
            boat: boat,
            user: user
        });
        await this.ratingRepository.save(createdRating);

        return this.ratingRepository.findOne(createdRating.id);
    }

    private async getShipyardEntity(shipyard: string) {
        let shipyardEntity = await this.shipyardRepository.findOne({ name: shipyard });

        if (!shipyardEntity) {
            shipyardEntity = await this.shipyardRepository.create({
                name: shipyard,
            })
            await this.shipyardRepository.save(shipyardEntity);
        }

        return shipyardEntity;
    }
}

export default BoatService;