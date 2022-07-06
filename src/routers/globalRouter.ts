import express from 'express';
import { trending } from '../controllers/storiesController';
import { join, login } from '../controllers/userController';

export const globalRouter = express.Router();

globalRouter.get('/', trending);
globalRouter.get('/login', login);
globalRouter.get('/join', join);
