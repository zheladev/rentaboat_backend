import { Request, Response } from "express";

function loggerMiddleware(request: Request, response: Response, next) {
    if (request) {
        console.log(`${request.method} ${request.url}`);
    }
    next();
}

export default loggerMiddleware; 