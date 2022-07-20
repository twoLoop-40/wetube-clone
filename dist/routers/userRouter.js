import express from 'express';
import { editProfile, postEdit, seeUser, seeUsers, } from '../controllers/userController';
import { protectMiddleware, uploadFiles } from '../middlewares';
export const userRouter = express.Router();
userRouter.get('/', seeUsers);
userRouter
    .route('/edit')
    .all(protectMiddleware)
    .get(editProfile)
    .post(uploadFiles.single('avatar'), postEdit);
userRouter.get('/:id', seeUser);
