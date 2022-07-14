import express from 'express';
import { home, search } from '../controllers/storiesController';
import { join, login } from '../controllers/userController';

export const globalRouter = express.Router();

globalRouter.get('/', home);
globalRouter.get('/login', login);
globalRouter.get('/join', join);
globalRouter.get('/search', search);
