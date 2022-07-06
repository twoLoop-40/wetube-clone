import express from 'express';
import { deleteStory, editStory, seeStory, } from '../controllers/storiesController';
export const storyRouter = express.Router();
storyRouter.get('/:id', seeStory);
storyRouter.get('/:id/edit', editStory);
storyRouter.get('/:id/delete', deleteStory);
