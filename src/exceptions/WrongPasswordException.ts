import HttpException from "./HttpException";

class WrongPasswordException extends HttpException {
    constructor() {
        super(401, "Wrong username or password");
    }
}

export default WrongPasswordException;