import HttpException from "./HttpException";

//TODO: make it generic for all unique key violations
class EmailAlreadyInUseException extends HttpException {
    email: string;
    constructor(email: string) {
        super(400, `${email} is already in use.`);
        this.email = email;
    }
}

export default EmailAlreadyInUseException;

