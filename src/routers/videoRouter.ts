import express from 'express';
import {
  deleteVideo,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  watch,
} from '../controllers/videoController';

export const videoRouter = express.Router();

videoRouter.post('/upload', postUpload);
videoRouter.get('/upload', getUpload);
videoRouter.get('/:id([0-9a-f]{24})', watch);
videoRouter.route('/:id([0-9a-f]{24})/edit').get(getEdit).post(postEdit);
videoRouter.get('/:id([0-9a-f]{24})/delete', deleteVideo);
