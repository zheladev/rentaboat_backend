import HttpException from "./HttpException";


class EntityNotFoundException<T> extends HttpException {
    public entityClass: {new(): T};
    constructor() {
        let entityClass: {new(): T};
        super(404, `${entityClass.name} with specified params not found.`);
        this.entityClass = entityClass;
    }
}

export default EntityNotFoundException;