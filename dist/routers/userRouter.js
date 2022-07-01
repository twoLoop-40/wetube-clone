import express from 'express';
import { handleEditProfile, handleUser, handleUserId, } from '../controllers/userController';
export const userRouter = express.Router();
userRouter.get('/', handleUser);
userRouter.get('/edit-profile', handleEditProfile);
userRouter.get('/:id', handleUserId);
