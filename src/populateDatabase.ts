import config from './typeorm-config';
import 'reflect-metadata';
import { createConnection, getRepository, Repository } from 'typeorm';
import UserType from './entities/types/userType';
import BoatType from './entities/types/boatType';
import 'dotenv/config';
import SupportTicketType from './entities/types/supportTicketType';

const USER_TYPES = [
    {
        intValue: 0,
        name: 'admin',
        isRegistrable: false,
        isAdmin: true,
    },
    {
        intValue: 1,
        name: 'support',
        isRegistrable: false,
        isAdmin: true,
    },
    {
        intValue: 2,
        name: 'owner',
        isRegistrable: true,
        isAdmin: false,
    },
    {
        intValue: 3,
        name: 'user',
        isRegistrable: true,
        isAdmin: false,
    }
]

const BOAT_TYPES = [
    {
        name: 'yatch',
        intValue: 0
    },
    {
        name: 'sailboat',
        intValue: 1
    },
    {
        name: 'catamaran',
        intValue: 2
    },
    {
        name: 'powerCat',
        intValue: 3
    },
    {
        name: 'schooner',
        intValue: 4
    },
    {
        name: 'motorboat',
        intValue: 5
    },
    {
        name: 'dinghy',
        intValue: 6
    }
]

const SUPPORT_TICKET_TYPES = [
    {
        name: 'payment',
        intValue: 0
    },
    {
        name: 'rental',
        intValue: 1
    },
    {
        name: 'boat',
        intValue: 2
    },
    {
        name: 'user',
        intValue: 3
    }
]

createConnection(config).then(() => {
    const userTypeRepo = getRepository(UserType);
    const boatTypeRepo = getRepository(BoatType);
    const supportTicketRepo = getRepository(SupportTicketType);

    const saveToDb = (arr, repo: Repository<any>) => {
        arr.forEach(e => {
            repo.save(repo.create({ ...e }));
        });
    }

    console.log('populating user types...');
    saveToDb(USER_TYPES, userTypeRepo);
    console.log('populating boat types...');
    saveToDb(BOAT_TYPES, boatTypeRepo);
    console.log('populating support ticket types...');
    saveToDb(SUPPORT_TICKET_TYPES, supportTicketRepo);
});