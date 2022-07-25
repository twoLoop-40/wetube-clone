import express from 'express';
import { editProfile, finishGithublogin, logout, postEdit, startGithublogin, } from '../controllers/userController';
import { protectMiddleware, uploadFiles } from '../middlewares';
export const userRouter = express.Router();
userRouter
    .route('/edit')
    .all(protectMiddleware)
    .get(editProfile)
    .post(uploadFiles.single('avatar'), postEdit);
userRouter.get('/github/start', startGithublogin);
userRouter.get('/github/finish', finishGithublogin);
userRouter.get('/logout', logout);
