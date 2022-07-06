import express from 'express';
import { newStories, trending } from '../controllers/storiesController';
import { join, login } from '../controllers/userController';
export const globalRouter = express.Router();
globalRouter.get('/', trending);
globalRouter.get('/new', newStories);
globalRouter.get('/login', login);
globalRouter.get('/join', join);
