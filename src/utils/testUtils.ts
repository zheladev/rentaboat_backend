import { SinonStub, SinonStubbedInstance } from "sinon";
import { ObjectLiteral, Repository } from "typeorm";

export const repositoryStubConstructor = (stub: SinonStub) => {
    return (repository: SinonStubbedInstance<Repository<ObjectLiteral>>) => stub.returns(repository as unknown as any);
}