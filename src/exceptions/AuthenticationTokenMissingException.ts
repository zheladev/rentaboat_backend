import HttpException from "./HttpException";

class AuthenticationTokenMissingException extends HttpException {
    constructor() {
        super(401, 'Missing authentication token.');
    }
}

export default AuthenticationTokenMissingException;