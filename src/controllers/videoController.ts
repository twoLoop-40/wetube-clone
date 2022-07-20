import { Controller, makeHandler } from '../util';
import Video, { VideoModel } from '../models/Video';
import mongoose from 'mongoose';

export const home: Controller = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: 'desc' });
  res.render('home', { pageTitle: 'Home', videos });
  return;
};
export const newStories = makeHandler((req, res) => {
  return res?.send('New');
});

export const watch: Controller = async (req, res) => {
  const { id } = req ? req.params : { id: 0 };
  const video = await Video.findById(id);
  return res?.render('watch', { pageTitle: `${video?.title}`, video });
};
export const getEdit: Controller = async (req, res) => {
  const { id } = req ? req.params : { id: 0 };
  const video = await Video.findById(id);
  if (!video) {
    res?.render('404', { pageTitle: 'Video not found' });
    return;
  }
  return res?.render('edit', { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit: Controller = async (req, res) => {
  const { id } = req ? req.params : { id: 0 };
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    res?.status(404).render('404', { pageTitle: 'Video not found' });
    return;
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res?.redirect(`/stories/${id}`);
};

export const getUpload: Controller = (req, res) => {
  return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload: Controller = async (req, res) => {
  const { title, description, hashtags } = req.body;

  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    res.redirect('/');
    return;
  } catch (error) {
    res.status(400).render('upload', {
      pageTitle: 'Upload Video',
      errorMessage:
        error instanceof mongoose.Error.ValidationError
          ? error.message
          : 'Something went wrong',
    });
    return;
  }
};

export const deleteVideo: Controller = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByIdAndDelete(id);
  if (!video) {
    res.status(404).render('404', { pageTitle: 'Video not found' });
    return;
  }
  return res.redirect('/');
};

export const search: Controller = async (req, res) => {
  const { keyword } = req.query;
  let videos: VideoModel[] = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, 'i'),
      },
    });
  }

  return res.render('search', { pageTitle: 'Search', videos });
};
