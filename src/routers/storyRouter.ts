import express from 'express';
import { makeHandler } from '../util';

export const storyRouter = express.Router();
const handleWatchVideo = makeHandler((req, res) => {
  return res?.send('Watch Video');
});
const handleStoryId = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return isNaN(parseInt(id)) || id === '0'
    ? res?.send('Invalid Story Id')
    : res?.send(`Story ${id}`);
});
const handleEditStory = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return res?.send(`Edit Story for ${id}`);
});
const handleDeleteStory = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return res?.send(`Delete Story for ${id}`);
});

storyRouter.get('/watch', handleWatchVideo);
storyRouter.get('/:id', handleStoryId);
storyRouter.get('/:id/edit', handleEditStory);
storyRouter.get('/:id/delete', handleDeleteStory);
