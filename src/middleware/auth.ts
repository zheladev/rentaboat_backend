import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import User from '../entities/user';
import ForbiddenActionException from '../exceptions/ForbiddenActionException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithuser';
 

const ROLES = ['admin', 'support', 'renter', 'client'];

export function checkRole(requiredRoleLevel: string, canAccessIfOwner = false) {
    return async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const userRoleName = request.user.userType.name;
        if (ROLES.indexOf(userRoleName) > ROLES.indexOf(requiredRoleLevel) || canAccessIfOwner) {
            next();
        } else {
            next(new ForbiddenActionException("Access unauthorized resource."));
        }
    }
}

export async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const bearerToken = request.header("Authorization");
  console.log(bearerToken)
  const userRepository = getRepository(User);
  
  if (bearerToken) {
    const secret = process.env.JWT_SECRET;
    try {
        const token = bearerToken.split(' ')[1];
      const jwtPayload = jwt.verify(token, secret) as DataStoredInToken;
      const id = jwtPayload.id;
      const user = await userRepository.findOne(id, {relations: ["userType"]});
      if (user) {
        request.user = user;
        //set new jwt token?
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new WrongAuthenticationTokenException());
  }
}