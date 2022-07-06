import express from 'express';
import { getEdit, postEdit, watch } from '../controllers/storiesController';

export const storyRouter = express.Router();

storyRouter.get('/:id(\\d+)', watch);
storyRouter.route('/:id(\\d+)/edit').get(getEdit).post(postEdit);
