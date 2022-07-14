import express from 'express';
import {
  deleteVideo,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  watch,
} from '../controllers/storiesController';

export const storyRouter = express.Router();

storyRouter.post('/upload', postUpload);
storyRouter.get('/upload', getUpload);
storyRouter.get('/:id([0-9a-f]{24})', watch);
storyRouter.route('/:id([0-9a-f]{24})/edit').get(getEdit).post(postEdit);
storyRouter.get('/:id([0-9a-f]{24})/delete', deleteVideo);
