import express from 'express';
import { editProfile, seeUser, seeUsers } from '../controllers/userController';
export const userRouter = express.Router();
userRouter.get('/', seeUsers);
userRouter.get('/edit-profile', editProfile);
userRouter.get('/:id', seeUser);
