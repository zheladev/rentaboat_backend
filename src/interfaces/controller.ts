import { Router } from 'express';
import { Repository } from 'typeorm';
interface Controller {
    path: string;
    router: Router;
}

export default Controller;