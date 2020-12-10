//import { plainToClass } from 'class-transformer';
//import { isUUID, validate, ValidationError } from 'class-validator';
import * as express from 'express';
import 'reflect-metadata';
import HttpException from '../exceptions/HttpException';
import validator from 'validator';

// function validationMiddleware(type: any, skipMissingProperties = false): express.RequestHandler {
//     return (req, res, next) => {
//         validate(plainToClass(type, req.body), { skipMissingProperties })
//             .then((errors: Array<ValidationError>) => {
//                 if (errors.length > 0) {
//                     const message = errors.map((error: ValidationError) => {
//                         Object.values(error.constraints);
//                     }).join(', ');
//                     next(new HttpException(400, message));
//                 } else {
//                     next();
//                 }
//             });
//     }
// }

const validateUUID = (request: express.Request, response, next) => {
    const id = request.params.id;
    if (id) {
        if (!validator.isUUID(id)) {
            next(new HttpException(400, `Bad request. ${id} is not a valid UUID`));
        }
    }
    next();

}


export default validateUUID;