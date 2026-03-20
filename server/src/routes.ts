import {Router} from 'express';
import authRoute from './features/auth/auth.route';
import userRoute from './features/user/user.route';

const routes = Router();

routes.use('/auth', authRoute);
routes.use('/users', userRoute);

export default routes;
