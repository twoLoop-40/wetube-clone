import express from 'express';
import {
  handleDeleteStory,
  handleEditStory,
  handleStoryId,
  handleWatchVideo,
} from '../controllers/videoController';

export const storyRouter = express.Router();

storyRouter.get('/watch', handleWatchVideo);
storyRouter.get('/:id', handleStoryId);
storyRouter.get('/:id/edit', handleEditStory);
storyRouter.get('/:id/delete', handleDeleteStory);
