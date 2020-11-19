import { Between, getRepository, SelectQueryBuilder } from "typeorm";
import CreateRentalDTO from "../dtos/createRental";
import Boat from "../entities/boat";
import Rental, { PostgresTimeInterval } from "../entities/rental";
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
        const rentals = await this.repository.find({where: {boat: boatId}, relations: ["tenant"]});
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

        const rentals = await this.repository
            .createQueryBuilder('rental')
            .leftJoinAndSelect('rental.boat', 'boat')
            .leftJoinAndSelect('boat.user', 'user')
            .where('user.id=:id', {id: userId})
            .getMany();

        return rentals;
    }

    public async create(rentalData: CreateRentalDTO, user: User) {
        const { boatId } = rentalData;

        const boat = await this.boatRepository.findOne(boatId, { relations: ["rentals"]});

        const boatRentals = boat.rentals.map((rental) => rental);

        if(! await this.checkIfValidRentalDate(rentalData, boatRentals)) {
            throw new ForbiddenActionException("Duplicate date");
        }

        const createdRental = await this.repository.create({
            ...rentalData,
            tenant: user,
            boat: boat,
        })
        await this.repository.save(createdRental);

        return await this.repository.findOne(createdRental.id);
    }

    private async checkIfValidRentalDate(rentalData: CreateRentalDTO, rentals: Rental[]) : Promise<boolean> {
        let isValid = true;
        const date : Date = new Date(rentalData.startDate);
        const dateFilter = this.filterByDateInterval(date);

        const endDate : Date = new Date(date);
        endDate.setDate(date.getDate() + this.getDaysFromPostgresInterval(rentalData.durationInDays));

        const rental = await this.repository.findOne({ 
            where: { 
                boat: rentalData.boatId, 
                startDate: Between(date, endDate)
            }
        });

        isValid = rental === undefined && rentals.filter(dateFilter).length === 0;

        return isValid;
    }

    private getDaysFromPostgresInterval(interval: string) {
        const daysEndIdx: number = interval.indexOf('D');
        let daysStartIdx: number = 1;

        for (let i = daysEndIdx -1; i > 0; i--) {
            if (interval.charAt(i) === 'W' || interval.charAt(i) === 'M' || interval.charAt(i) === 'Y') {
                daysStartIdx = i+1;
            }
        }

        return Number(interval.substring(daysStartIdx, daysEndIdx));
    }

    private filterByDateInterval = (date: Date) => (r: Rental) : boolean => {
        const from = new Date(r.startDate);
        const to = new Date(r.startDate);
        to.setDate(from.getDate() + Number((r.durationInDays as PostgresTimeInterval).days));
        return date > from && date < to;
    }
}

export default RentalService;