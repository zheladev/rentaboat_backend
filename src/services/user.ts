import User from "../entities/user";
import BaseService from "./baseService";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import CreateBillingInformationDTO from "../dtos/createBillingInformation";
import { getRepository } from "typeorm";
import BillingInformation from "../entities/billingInformation";

class UserService extends BaseService<User> {
    private billingInformationRepository = getRepository(BillingInformation);
    constructor() {
        super(User);
    }

    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<User>(User);
        }
        await this.repository.update(id, { isDeleted: true });
    }

    public async createBillingInformation(userId: string, billingInformationData: CreateBillingInformationDTO) {
        if (!await this.repository.findOne(userId)) {
            throw new EntityNotFoundException<User>(User);
        }

        const createdBI = await this.billingInformationRepository.create({ ...billingInformationData });
        await this.billingInformationRepository.save(createdBI);

        return createdBI;
    }

    public async getAllBillingInformation(id: string) {
        const billingInformationArray = this.billingInformationRepository.find({ where: { user: id } });

        return billingInformationArray;
    }
}

export default UserService;