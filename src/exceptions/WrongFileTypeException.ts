import HttpException from "./HttpException";

class WrongFileTypeException extends HttpException {
    fileType: string;
    constructor(fileType: string) {
        super(422, `${fileType} is not a valid file format.`);
        this.fileType = fileType;
    }
}

export default WrongFileTypeException;

