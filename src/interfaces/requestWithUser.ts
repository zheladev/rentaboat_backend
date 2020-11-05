import { Request } from "express";
import User from "../entities/user";

interface RequestWithUser extends Request {
    user: User;
}

export default RequestWithUser;