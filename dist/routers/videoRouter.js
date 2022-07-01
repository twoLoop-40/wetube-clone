import express from 'express';
import { makeHandler } from '../util';
export const videoRouter = express.Router();
const handleWatchVideo = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('Watch Video');
});
videoRouter.get('/watch', handleWatchVideo);
