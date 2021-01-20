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
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import MissingParametersException from "../exceptions/MissingParametersException";
import { ISearchCriteria } from "../interfaces/searchCriteria";
import { parseSearchCriteriaToTypeORMWhereClause } from "../utils/SearchCriteriaParser";
import BaseService from "./baseService";
import { getFileRepository } from "../repository/fileRepository";
import WrongFileTypeException from "../exceptions/WrongFileTypeException";
import { IPaginatedResult } from "../interfaces/paginatedResult";

type BoatFKs = { shipyard: string, boatType: string, port: string };

/**
 * Boat service
 *
 * @category Services
 * @class BoatService
 * @extends {BaseService<Boat>}
 */
class BoatService extends BaseService<Boat> {
    private shipyardRepository = getRepository(Shipyard);
    private portRepository = getRepository(Port);
    private boatTypeRepository = getRepository(BoatType);
    private commentRepository = getRepository(Comment);
    private ratingRepository = getRepository(Rating);
    private fileRepository = getFileRepository(process.env.BOAT_IMG_DIR);

    constructor() {
        super(Boat);
    }

    /**
     * Returns paginated Boat array with matching params and specified pagination
     *
     * @param {number} [skip=0]
     * @param {number} [take=40]
     * @param {*} [startDate=null]
     * @param {*} [endDate=null]
     * @param {ISearchCriteria[]} [searchParams=[]]
     * @return {*} 
     * @memberof BoatService
     */
    public async getAllPaginated(skip: number = 0, take: number = 40, startDate = null, endDate = null, searchParams: ISearchCriteria[] = []): Promise<IPaginatedResult<Boat>> {
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
                    where: {
                        ...whereParams,
                        isDeleted: false
                    }
                })
                count = await this.repository.count({
                    where: {
                        ...whereParams,
                        isDeleted: false
                    }
                })
                boats = boats.filter(this.boatAvailabilityFilter(startDate, endDate));
            } else {
                boats = await this.repository.find({
                    ...relationsOptions,
                    ...paginationOptions,
                    where: {
                        ...whereParams,
                        isDeleted: false
                    }
                })
                count = await this.repository.count({
                    where: {
                        ...whereParams,
                        isDeleted: false
                    }
                })
            }
        } else {
            if (startDate && endDate) {
                boats = await this.repository.find({
                    ...relationsOptions,
                    where: {
                        isDeleted: false,
                    }
                });
                count = await this.repository.count();
                boats = boats.filter(this.boatAvailabilityFilter(startDate, endDate));
            } else {
                boats = await this.repository.find({
                    ...relationsOptions,
                    ...paginationOptions,
                    where: {
                        isDeleted: false,
                    }
                });
                count = await this.repository.count();
            }
        }
        return {
            data: boats,
            totalPages: count / take
        };
    }

    /**
     * Returns functions that accepts a Boat and returns whether its rental dates overlap with given date range
     *
     * @private
     * @param {*} startDate
     * @param {*} endDate
     * @return {*} 
     * @memberof BoatService
     */
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

    /**
     * Updates matched Boat with given params if Boat belongs to User
     *
     * @param {string} id
     * @param {Partial<CreateBoatDto>} boatData
     * @param {User} user
     * @return {*} 
     * @memberof BoatService
     */
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

    /**
     * Creates and returns Boat with given params and User.
     *
     * @param {CreateBoatDto} boatData
     * @param {User} user
     * @return {*} 
     * @memberof BoatService
     */
    public async create(boatData: CreateBoatDto, user: User) {
        const { shipyard, boatType, port }: BoatFKs = boatData;
        const base64Data = boatData.base64Data || undefined;
        delete boatData.base64Data;

        const lowercaseShipyard = shipyard.toLowerCase();

        if (base64Data && !this.fileRepository.validFileType(base64Data)) {
            throw new WrongFileTypeException(this.fileRepository.fileType(base64Data));
        }

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
        const savedBoat = await this.repository.findOne(createdBoat.id, { relations: ["user", "port", "shipyard", "boatType", "ratings", "comments", "rentals", "rentals.renter"] });

        let imgPath = null;

        if (base64Data !== undefined) {
            try {
                imgPath = this.fileRepository.save(savedBoat.id, base64Data);
            } catch (e) {
                throw e;
            }

            if (imgPath !== null) {
                savedBoat.path = imgPath;
                await this.repository.save(savedBoat);
            }
        }

        return await savedBoat;
    }

    /**
     * Sets mached Boat's isDeleted param to true
     *
     * @param {string} id
     * @memberof BoatService
     */
    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<Boat>(Boat);
        }
        await this.repository.update(id, { isDeleted: true });
    }

    public async getById(id: string) {
        const boat = await this.repository.findOne(id, {
            relations: ["user", "shipyard", "boatType", "ratings", "ratings.user", "comments", "comments.user"], where: {
                isDeleted: false,
            }
        });
        if (!boat) {
            throw new EntityNotFoundException<Boat>(Boat);
        }

        return boat;
    }

    /**
     * Returns Boat belonging to mached User
     *
     * @param {string} userId
     * @return {*} 
     * @memberof BoatService
     */
    public async getByUserId(userId: string) {
        const entity = await this.repository.find({ where: { user: userId, isDeleted: false }, relations: ["user", "port", "shipyard", "boatType", "ratings", "comments", "rentals", "rentals.renter"], order: { createdAt: "ASC" } });
        if (!entity) {
            throw new EntityNotFoundException<Boat>(Boat);
        }
        return entity;
    }

    /**
     * Adds new Comment with given data to matched Boat
     *
     * @param {string} boatId
     * @param {PostCommentDTO} commentData
     * @param {User} user
     * @return {*} 
     * @memberof BoatService
     */
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

    /**
     * Adds new Rating with given data to matched Boat
     *
     * @param {string} boatId
     * @param {PostRatingDTO} ratingData
     * @param {User} user
     * @return {*} 
     * @memberof BoatService
     */
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

    /**
     * Creates and returns Shipyard with given name
     *
     * @private
     * @param {string} shipyard
     * @return {*} 
     * @memberof BoatService
     */
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