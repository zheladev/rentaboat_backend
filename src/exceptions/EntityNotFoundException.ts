import HttpException from "./HttpException";


class EntityNotFoundException<T> extends HttpException {
    constructor(x : new () => T) {
        super(404, `${x.name} with specified params not found.`);
    }
}

export default EntityNotFoundException;