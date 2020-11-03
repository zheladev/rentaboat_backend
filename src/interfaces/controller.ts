import { Router } from 'express';
import { Repository } from 'typeorm';
import BaseService from '../services/baseService';
interface Controller {
    path: string;
    router: Router;
}

export default Controller;