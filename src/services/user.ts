import User from "../entities/user";
import BaseService from "./baseService";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import CreateBillingInformationDTO from "../dtos/createBillingInformation";
import { getRepository } from "typeorm";
import BillingInformation from "../entities/billingInformation";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import UserType from "../entities/types/userType";

/**
 * User service. User creation is handled through AuthService.
 *
 * @class UserService
 * @extends {BaseService<User>}
 */
class UserService extends BaseService<User> {
    private billingInformationRepository = getRepository(BillingInformation);
    private userTypeRepository = getRepository(UserType);
    constructor() {
        super(User);
    }

    /**
     * Sets matched entity's isDeleted param to true
     * 
     * @override
     * @param {string} id
     * @memberof UserService
     */
    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<User>(User);
        }
        await this.repository.update(id, { isDeleted: true });
    }

    /**
     * Promotes matched user to Owner if its UserType is user
     *
     * @param {string} id
     * @return {*} 
     * @memberof UserService
     */
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

    /**
     *  Adds new BillingInformation with given data to matched user
     *
     * @param {string} userId
     * @param {CreateBillingInformationDTO} billingInformationData
     * @return {*} 
     * @memberof UserService
     */
    public async createBillingInformation(userId: string, billingInformationData: CreateBillingInformationDTO) {
        const user = await this.repository.findOne(userId);
        if (!user) {
            throw new EntityNotFoundException<User>(User);
        }

        const createdBI = await this.billingInformationRepository.create({ ...billingInformationData, user: user });
        await this.billingInformationRepository.save(createdBI);

        return createdBI;
    }

    /**
     *  Returns array of BillingInformation matched to given user id  
     *
     * @param {string} id
     * @return {*} 
     * @memberof UserService
     */
    public async getAllBillingInformation(id: string) {
        const billingInformationArray = this.billingInformationRepository.find({ where: { user: id } });

        return billingInformationArray;
    }
}

export default UserService;