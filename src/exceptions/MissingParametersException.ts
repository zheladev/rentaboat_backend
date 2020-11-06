import HttpException from "./HttpException";

class MissingParametersException extends HttpException{
    constructor() {
        super(400, "Missing parameters to process request.");
    }
}

export default MissingParametersException;