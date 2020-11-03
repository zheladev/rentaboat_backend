import HttpException from "./HttpException";

class ForbiddenActionException extends HttpException {
    action: string;
    constructor(action: string) {
        super(403, `Forbidden`)
        this.action = action;
    }
}

export default ForbiddenActionException;