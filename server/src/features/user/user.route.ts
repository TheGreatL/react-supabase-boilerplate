import {Router} from 'express';
import {UserController} from './user.controller';
import {authMiddleware} from '../../shared/middleware/auth.middleware';

const route = Router();

route.get('/', authMiddleware, UserController.getAllUsers);
route.get('/:id', authMiddleware, UserController.getUserById);

export default route;
