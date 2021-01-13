import { SinonStub, SinonStubbedInstance } from "sinon";
import { ObjectLiteral, Repository } from "typeorm";

export /**
 * Helper that returns a curried function that expects a SinonStubbedInstance
 *
 * @param {SinonStub} stub
 * @return {*} 
 */
const repositoryStubConstructor = (stub: SinonStub): Function => {
    return (repository: SinonStubbedInstance<Repository<ObjectLiteral>>): SinonStub<any[], any> => stub.returns(repository as unknown as any);
}