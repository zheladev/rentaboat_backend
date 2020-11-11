import { getRepository } from "typeorm";
import CreateRentalDTO from "../dtos/createRental";
import Boat from "../entities/boat";
import Rental from "../entities/rental";
import User from "../entities/user";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import BaseService from "./baseService";

class RentalService extends BaseService<Rental> {
    private boatRepository = getRepository(Boat);
    constructor() {
        super(Rental)
    }

    public async getByBoatId(boatId: string) {
        const rentals = await this.repository.find({where: {boat: boatId}});
        if(rentals.length < 1) {
            throw new EntityNotFoundException<Rental>();
        }

        return rentals;
    }   

    public async getByTenantId(userId: string, user: User) {
        if(!(userId === user.id || user.userType.intValue <= 1)) {
            throw new ForbiddenActionException("Access tenant rentals");
        }

        const rentals = await this.repository.find({where: {tenant: userId}});

        return rentals;
    }

    public async getByUserId(userId: string, user: User) {
        if(!(userId === user.id || user.userType.intValue <= 1)) {
            throw new ForbiddenActionException("Access renter rentals");
        }

        //TODO: test, probably doesn't work
        const rentals = await this.repository.find({
            relations: ["boat", "boat.user"],
            where: {
                boat: {
                    user: {
                        id: userId
                    }
                }
            }
        });

        return rentals;
    }

    public async create(rentalData: CreateRentalDTO, user: User) {
        const { boatId } = rentalData;

        const boat = await this.boatRepository.findOne(boatId, { relations: ["rental"]});

        const boatRentals = boat.rentals.map((rental) => rental);

        if(!this.checkIfValidRentalDate(rentalData, boatRentals)) {
            throw new ForbiddenActionException("Duplicate date");
        }

        //create
    }

    private async checkIfValidRentalDate(rentalData: CreateRentalDTO, rentals: Rental[]) : Promise<boolean> {
        let isValid = true;

        if(await this.repository.findOne({ where: { boat: rentalData.boatId, startDate: rentalData.startDate}}) !== undefined) {
            isValid = false;
        }

        if (isValid) {
            
        }

        return isValid;
    }
}

export default RentalService;