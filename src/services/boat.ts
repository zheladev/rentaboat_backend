import { getRepository } from "typeorm";
import CreateBoatDto from "../dtos/createBoat";
import Boat from "../entities/boat";
import Port from "../entities/port";
import Shipyard from "../entities/shipyard";
import BoatType from "../entities/types/boatType";
import User from "../entities/user";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import MissingParametersException from "../exceptions/MissingParametersException";
import BaseService from "./baseService";

type BoatFKs = { shipyard: string, boatType: string, port: string};

class BoatService extends BaseService<Boat> {
    private shipyardRepository = getRepository(Shipyard);
    private portRepository = getRepository(Port);
    private boatTypeRepository = getRepository(BoatType);

    constructor() {
        super(Boat);
    }

    public async updateWithUser(id: string, boatData: Partial<CreateBoatDto>, user: User) {
        const boat = await this.repository.findOne({id: id}, {relations: ["user"]});

        if(boat === undefined) {
            throw new EntityNotFoundException<Boat>();
        }

        if (!(boat.user.id === user.id || user.userType.intValue <= 1)) {
            throw new ForbiddenActionException("Modify boat");
        }

        const updatedBoat = await this.update(id, boatData);
        return updatedBoat;
    }

    public async create(boatData: CreateBoatDto, user: User) {
        const { shipyard, boatType, port } : BoatFKs = boatData;
        const lowercaseShipyard = shipyard.toLowerCase();

        const shipyardEntity = await this.getShipyardEntity(lowercaseShipyard);
        
        const boatTypeEntity = await this.boatTypeRepository.findOne({ name: boatType });

        const portEntity = await this.portRepository.findOne({name: port});

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
        return createdBoat;
    }

    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<Boat>();
        }
        await this.repository.update(id, { isDeleted: true });
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