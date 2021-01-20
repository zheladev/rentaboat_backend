import HttpException from "./HttpException";

class WrongAuthenticationTokenException extends HttpException {
    constructor(str) {
        super(401, `Wrong authentication token. ${str}`);
    }
}

export default WrongAuthenticationTokenException;