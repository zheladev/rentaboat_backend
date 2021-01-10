import User from "../entities/user";
import BaseService from "./baseService";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import CreateBillingInformationDTO from "../dtos/createBillingInformation";
import { getRepository } from "typeorm";
import BillingInformation from "../entities/billingInformation";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import UserType from "../entities/types/userType";

class UserService extends BaseService<User> {
    private billingInformationRepository = getRepository(BillingInformation);
    private userTypeRepository = getRepository(UserType);
    constructor() {
        super(User);
    }

    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<User>(User);
        }
        await this.repository.update(id, { isDeleted: true });
    }

    public async promoteToOwner(id: string) {
        const user = await this.repository.findOne(id, { relations: ['userType'] });
        if (!user) {
            throw new EntityNotFoundException<User>(User);
        }
        if (user.userType.intValue !== 3) {
            throw new ForbiddenActionException('Downgrade to owner');
        }

        const ownerType = await this.userTypeRepository.findOne({ where: { intValue: 2 } }); //TODO: use enum for owner intValue
        await this.repository.save({
            ...user,
            userType: ownerType,
        });

        return await this.repository.findOne(id, { relations: ['userType'] });
    }

    public async createBillingInformation(userId: string, billingInformationData: CreateBillingInformationDTO) {
        const user = await this.repository.findOne(userId);
        if (!user) {
            throw new EntityNotFoundException<User>(User);
        }

        const createdBI = await this.billingInformationRepository.create({ ...billingInformationData, user: user });
        await this.billingInformationRepository.save(createdBI);

        return createdBI;
    }

    public async getAllBillingInformation(id: string) {
        const billingInformationArray = this.billingInformationRepository.find({ where: { user: id } });

        return billingInformationArray;
    }
}

export default UserService;