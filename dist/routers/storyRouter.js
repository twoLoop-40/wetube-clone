import express from 'express';
import { makeHandler } from '../util';
export const storyRouter = express.Router();
const handleWatchVideo = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('Watch Video');
});
const handleStoryId = makeHandler((req, res) => {
    const { id } = req ? req.params : { id: '0' };
    console.log(isNaN(parseInt(id)));
    return res === null || res === void 0 ? void 0 : res.send(`Show Story ${id}`);
});
const handleEditStory = makeHandler((req, res) => {
    const { id } = req ? req.params : { id: '0' };
    return res === null || res === void 0 ? void 0 : res.send(`Edit Story for ${id}`);
});
const handleDeleteStory = makeHandler((req, res) => {
    const { id } = req ? req.params : { id: '0' };
    return res === null || res === void 0 ? void 0 : res.send(`Delete Story for ${id}`);
});
storyRouter.get('/watch', handleWatchVideo);
storyRouter.get('/:id', handleStoryId);
storyRouter.get('/:id/edit', handleEditStory);
storyRouter.get('/:id/delete', handleDeleteStory);
