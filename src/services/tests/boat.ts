
import * as mocha from 'mocha';
import * as typeorm from 'typeorm';
import Boat from '../../entities/boat';
import { expect, use } from 'chai';
import * as faker from 'faker';
import * as chaiAsPromised from 'chai-as-promised';
import { ObjectLiteral } from 'typeorm';
import { createSandbox, createStubInstance, SinonStub, SinonStubbedInstance, stub } from 'sinon';
import { repositoryStubConstructor } from '../../utils/testUtils';
import BoatService from '../boat';

use(chaiAsPromised);

mocha.describe('BoatService', () => {

    const sandbox: sinon.SinonSandbox = createSandbox();
    const connectionStub = createStubInstance(typeorm.Connection);
    stub(typeorm, "createConnection").resolves((connectionStub as unknown) as typeorm.Connection);

    const fakeRepositoryFunctions: SinonStubbedInstance<typeorm.Repository<ObjectLiteral> | any> = sandbox.createStubInstance(typeorm.Repository);
    const getRepositoryStub: SinonStub = sandbox.stub(typeorm, 'getRepository');
    let fakeGetRepository = repositoryStubConstructor(getRepositoryStub);

    afterEach(async () => {
        await sandbox.reset();
        fakeGetRepository = repositoryStubConstructor(getRepositoryStub);
    })

    describe('when calling delete(id: string)', async () => {
        describe('delete(validId)', () => {
            it('should return deleted boat if boat with given id exists', async () => {
                const id: string = faker.random.uuid();
                const boat: Partial<Boat> = {
                    id: id,
                    isDeleted: false,
                };

                fakeRepositoryFunctions.findOne = (id: string) => Promise.resolve(boat as Boat);
                fakeRepositoryFunctions.update = (id: string, { isDeleted }: { isDeleted: boolean }) => {
                    return {
                        id: id,
                        isDeleted: isDeleted,
                    };
                }

                fakeGetRepository(fakeRepositoryFunctions);
                const boatService = new BoatService();

                const res = boatService.delete(id);
                await expect(res).is.empty;
            });

            it('should reject the request when user with given id does not exist', async () => {
                const id1: string = faker.random.uuid();
                const id2: string = faker.random.uuid();
                const boat: Partial<Boat> = {
                    id: id1,
                };

                fakeRepositoryFunctions.findOne = (id: string) => {
                    return id === boat.id ? boat : null;
                };
                fakeRepositoryFunctions.update = (id: string, { isDeleted }: { isDeleted: boolean }) => null;

                fakeGetRepository(fakeRepositoryFunctions);
                const boatService = new BoatService();

                await expect(boatService.delete(id2)).to.be.rejected;
            });
        });

        describe('delete(invalidId)', () => {
            it('should reject the request', async () => {
                const id = faker.random.uuid();
                const badId = id.substr(1);

                const boat: Partial<Boat> = {
                    id: id,
                };
                fakeRepositoryFunctions.findOne = (id: string) => {
                    return id === boat.id ? boat : null;
                };
                fakeRepositoryFunctions.update = (id: string, { isDeleted }: { isDeleted: boolean }) => null;

                fakeGetRepository(fakeRepositoryFunctions);
                const boatService = new BoatService();

                await expect(boatService.delete(badId)).to.be.rejected;
            });
        });
    })
});