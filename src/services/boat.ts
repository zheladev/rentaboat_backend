import { getRepository } from "typeorm";
import CreateBoatDto from "../dtos/createBoat";
import PostCommentDTO from "../dtos/postComment";
import PostRatingDTO from "../dtos/postRating";
import Boat from "../entities/boat";
import Comment from "../entities/comment";
import Port from "../entities/port";
import Rating from "../entities/rating";
import { PostgresTimeInterval } from "../entities/rental";
import Shipyard from "../entities/shipyard";
import BoatType from "../entities/types/boatType";
import User from "../entities/user";
import * as fs from 'fs';
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import MissingParametersException from "../exceptions/MissingParametersException";
import { IFile } from "../interfaces/file";
import { ISearchCriteria } from "../interfaces/searchCriteria";
import { parseFile } from "../utils/fileUpload";
import { parseSearchCriteriaToTypeORMWhereClause } from "../utils/SearchCriteriaParser";
import BaseService from "./baseService";
import HttpException from "../exceptions/HttpException";

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

    public async getAllPaginated(skip: number = 0, take: number = 40, startDate = null, endDate = null, searchParams: ISearchCriteria[] = []) {
        const relationsOptions = {
            relations: [
                "user",
                "shipyard",
                "boatType",
                "ratings",
                "comments",
                "port",
                "rentals"
            ]
        }

        const paginationOptions = {
            take: take,
            skip: skip * take,
        }

        let boats = [];
        let count = 0;
        if (searchParams.length > 0) {
            const whereParams = parseSearchCriteriaToTypeORMWhereClause(searchParams);
            if (startDate && endDate) {
                boats = await this.repository.find({
                    ...relationsOptions,
                    where: whereParams,
                })
                count = await this.repository.count({
                    where: whereParams,
                })
                boats = boats.filter(this.boatAvailabilityFilter(startDate, endDate));
            } else {
                boats = await this.repository.find({
                    ...relationsOptions,
                    ...paginationOptions,
                    where: whereParams,
                })
                count = await this.repository.count({
                    where: whereParams,
                })
            }
        } else {
            if (startDate && endDate) {
                boats = await this.repository.find({
                    ...relationsOptions,
                });
                count = await this.repository.count();
                boats = boats.filter(this.boatAvailabilityFilter(startDate, endDate));
            } else {
                boats = await this.repository.find({
                    ...relationsOptions,
                    ...paginationOptions
                });
                count = await this.repository.count();
            }
        }
        return {
            data: boats,
            totalPages: count / take
        };
    }

    private boatAvailabilityFilter(startDate, endDate) {
        return (boat: Boat) => {
            let isRented = false;
            for (let i = 0; i < boat.rentals.length && !isRented; i++) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const startR = new Date(boat.rentals[i].startDate);
                const endR = new Date(boat.rentals[i].startDate);
                endR.setDate(startR.getDate() + Number((boat.rentals[i].durationInDays as PostgresTimeInterval).days));

                isRented = (endR >= start && startR <= end);
            }
            return !isRented;
        }
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

        const base64Data = boatData.base64Data || undefined;
        delete boatData.base64Data;

        const createdBoat = await this.repository.create({
            ...boatData,
            shipyard: shipyardEntity,
            boatType: boatTypeEntity,
            port: portEntity,
            user: user,
        });

        await this.repository.save(createdBoat);
        const savedBoat = await this.repository.findOne(createdBoat.id, { relations: ["user", "port", "shipyard", "boatType", "ratings", "comments", "rentals", "rentals.renter"] });

        //Save file if uploaded
        if (base64Data !== undefined) {
            try {
                const baseDir = './public/boats';
                const fileName = savedBoat.id;
                const file: IFile = parseFile(base64Data);
                fs.writeFile(`${baseDir}/${fileName}.${file.fileFormat}`, file.base64Data, { encoding: 'base64' }, () => {});
            } catch (e) {
                throw e;
            }
        }

        return savedBoat;
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