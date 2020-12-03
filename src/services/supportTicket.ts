import { Entity, getRepository } from "typeorm";
import CreateSupportTicketDTO from "../dtos/createSupportTicket";
import Rental from "../entities/rental";
import SupportTicket from "../entities/supportTicket";
import SupportTicketType from "../entities/types/supportTicketType";
import User from "../entities/user";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import BaseService from "./baseService";

class SupportTicketService extends BaseService<SupportTicket> {
    private rentalRepository = getRepository(Rental);
    private supportTicketTypeRepository = getRepository(SupportTicketType);

    constructor() {
        super(SupportTicket)
    }

    public async create(supportTicketData: CreateSupportTicketDTO, user: User) {
        const rental = await this.rentalRepository.findOne(supportTicketData.rental);
        if (!rental) {
            throw new EntityNotFoundException<Rental>(Rental);
        }

        const supportTicketType = await this.supportTicketTypeRepository.findOne({
            where: {
                name: supportTicketData.supportTicketType
            }
        });
        if (!supportTicketType) {
            throw new EntityNotFoundException<SupportTicketType>(SupportTicketType);
        }

        const createdSupportTicket = await this.repository.create({
            ...supportTicketData,
            rental: rental,
            issuer: user,
            isAssigned: false,
            isResolved: false,
            supportTicketType: supportTicketType,
        })
        await this.repository.save(createdSupportTicket);

        return this.repository.findOne(createdSupportTicket.id, { relations: ["issuer", "supportTicketType", "rental"] })
    }

    public async resolveTicket(id: string) {
        const supportTicket = await this.repository.findOne(id);
        if (!supportTicket) {
            throw new EntityNotFoundException<SupportTicket>(SupportTicket);
        }

        supportTicket.isResolved = true;
        await this.repository.save(supportTicket);

        return supportTicket;
    }

    public async assignSupportUser(id: string, user: User) {
        if (user.userType.intValue > 1) {
            throw new ForbiddenActionException("Assign support ticket.");
        }

        const supportTicket = await this.repository.findOne(id);
        if (!supportTicket) {
            throw new EntityNotFoundException<SupportTicket>(SupportTicket);
        }

        supportTicket.isAssigned = true;
        supportTicket.assignedTo = user;
        await this.repository.save(supportTicket);

        return supportTicket;
    }
}

export default SupportTicketService;