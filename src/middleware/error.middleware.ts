import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = /*error.message ||*/ 'We\'re a long way from texas';
    response.status(status)
        .send({status, message});
}

export default errorMiddleware;