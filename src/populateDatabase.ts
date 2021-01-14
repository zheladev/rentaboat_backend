import config from './typeorm-config';
import 'reflect-metadata';
import { createConnection, getRepository, Repository } from 'typeorm';
import UserType from './entities/types/userType';
import BoatType from './entities/types/boatType';
import 'dotenv/config';
import SupportTicketType from './entities/types/supportTicketType';
import User from './entities/user';
import Port from './entities/port';
import Boat from './entities/boat';
import Shipyard from './entities/shipyard';

const SUPERUSER = {
    username: "admin",
    email: "admin@rentaboat.com",
    password: "root",
    firstName: "admin",
    lastName: "admin",
    address: "address"
};

const USERS = [
    {
        username: "user1",
        email: "user1@rentaboat.com",
        password: "user1",
        firstName: "John",
        lastName: "Doe",
        address: "addressuser1",
        userType: 'user'
    },
    {
        username: "user2",
        email: "user2@rentaboat.com",
        password: "Dude",
        firstName: "Dudelastname",
        lastName: "user2",
        address: "addressuser2",
        userType: 'user'
    },
    {
        username: "owner1",
        email: "owner1@rentaboat.com",
        password: "Rich",
        firstName: "Asf Man",
        lastName: "owner1",
        address: "addressowner1",
        userType: 'owner'
    },
    {
        username: "owner2",
        email: "owner2@rentaboat.com",
        password: "Amadeo",
        firstName: "García Campos",
        lastName: "owner2",
        address: "addressowner2",
        userType: 'owner'
    },
]

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
];

//Add from http://www.fondear.com/Todo_Charter/Puertos/Valencia/Valencia.htm
//Lat long º to dec https://www.latlong.net/degrees-minutes-seconds-to-decimal-degrees#:~:text=About%20DMS%20to%20Decimal%20Degrees,and%20displayed%20below%20the%20form.
const PORTS = [
    {
        name: "La Marina de Valencia",
        coordinates: {
            type: 'Point',
            coordinates: [39.46666667, 0.30138889]
        }
    },
    {
        name: "Valencia Mar",
        coordinates: {
            type: 'Point',
            coordinates: [39.41666667, 0.31666667]
        }
    },
    {
        name: "CN Benidorm",
        coordinates: {
            type: 'Point',
            coordinates: [38.53166667, 0.13166667]
        }
    },
    {
        name: "CN Castellon",
        coordinates: {
            type: 'Point',
            coordinates: [39.96666667, 0.01666667]
        }
    },
    {
        name: "Puerto Barcares",
        coordinates: {
            type: 'Point',
            coordinates: [39.86666667, 3.08527778]
        }
    },
    {
        name: "RCN Palma de Mallorca",
        coordinates: {
            type: 'Point',
            coordinates: [41.35138889, 2.16666667]
        }
    },
    {
        name: "RCN Barcelona",
        coordinates: {
            type: 'Point',
            coordinates: [41.35138889, 2.16666667]
        }
    }
]

const SHIPYARDS = [
    {
        name: "TEST Shipyard 1"
    },
    {
        name: "TEST Shipyard 2"
    }
]

const BOATS = [...Array.from(Array(99).keys()).map(n => {
    return {
        name: `Boat ${n + 1}`,
        description: `Description Boat ${n + 1}`,
        pricePerDay: Math.ceil(Math.random() * 1000),
        length: Math.ceil(Math.random() * 30),
        model: `modelBoat ${n + 1}`,
        passengerCapacity: Math.ceil(Math.random() * 30),
        numberOfCabins: Math.ceil(Math.random() * 6),
        numberOfBathrooms: Math.ceil(Math.random() * 2),
    }
})];

(async () => {
    try {
        await createConnection(config);
    } catch (error) {
        console.log('Error while connecting to the database\n', error);
        return error;
    }
    const saveToDb = async (arr, repo: Repository<any>) => {
        return Promise.all(arr.map(async e => {
            await repo.save(await repo.create({ ...e }));
        }));
    }

    const userTypeRepo = getRepository(UserType);
    const boatTypeRepo = getRepository(BoatType);
    const supportTicketRepo = getRepository(SupportTicketType);
    const portRepo = getRepository(Port);
    const userRepo = getRepository(User);
    const boatRepo = getRepository(Boat);
    const shipyardRepo = getRepository(Shipyard);

    console.log('populating user types...');
    await saveToDb(USER_TYPES, userTypeRepo);
    console.log('user types table populated.')

    console.log('populating boat types...');
    await saveToDb(BOAT_TYPES, boatTypeRepo);
    console.log('boat types table populated.');

    console.log('populating support ticket types...');
    await saveToDb(SUPPORT_TICKET_TYPES, supportTicketRepo);
    console.log('support ticket types table populated.');

    console.log('populating ports...');
    await saveToDb(PORTS, portRepo);
    console.log('ports table populated.');

    console.log('populating shipyards...');
    await saveToDb(SHIPYARDS, shipyardRepo);
    console.log('shipyards table populated.');

    console.log('Creating admin user...')
    const adminType = await userTypeRepo.findOne({ intValue: 0 });
    const createdUser = await userRepo.create({
        ...SUPERUSER,
        userType: adminType
    });

    const user = await userRepo.save(createdUser);
    console.log('Admin user created.');

    console.log('Creating test users...');
    const userType = await userTypeRepo.findOne({ intValue: 3 });
    const ownerType = await userTypeRepo.findOne({ intValue: 2 });
    const userTypesMap = { user: userType, owner: ownerType };

    const usersToBeInserted = USERS.map((u) => ({ ...u, userType: userTypesMap[u.userType] }));
    await saveToDb(usersToBeInserted, userRepo);
    console.log('Test users created.');

    console.log('creating test boats...');
    const owner1 = await userRepo.findOne({ username: 'owner1' });
    const owner2 = await userRepo.findOne({ username: 'owner2' });
    const ports = await portRepo.find();
    const shipyards = await shipyardRepo.find();
    const boatTypes = await boatTypeRepo.find();

    const boatsToBeInserted = BOATS.map((b, i) => ({
        ...b,
        user: i % 2 === 0 ? owner1 : owner2,
        port: ports[Math.floor(Math.random() * ports.length)],
        shipyard: shipyards[Math.floor(Math.random() * shipyards.length)],
        boatType: boatTypes[Math.floor(Math.random() * boatTypes.length)]
    }));

    await saveToDb(boatsToBeInserted, boatRepo);
    console.log('test boats created.');


})();