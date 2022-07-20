var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeHandler } from '../util';
import Video from '../models/Video';
import mongoose from 'mongoose';
export const home = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videos = yield Video.find({}).sort({ createdAt: 'desc' });
    res.render('home', { pageTitle: 'Home', videos });
    return;
});
export const newStories = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('New');
});
export const watch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req ? req.params : { id: 0 };
    const video = yield Video.findById(id);
    return res === null || res === void 0 ? void 0 : res.render('watch', { pageTitle: `${video === null || video === void 0 ? void 0 : video.title}`, video });
});
export const getEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req ? req.params : { id: 0 };
    const video = yield Video.findById(id);
    if (!video) {
        res === null || res === void 0 ? void 0 : res.render('404', { pageTitle: 'Video not found' });
        return;
    }
    return res === null || res === void 0 ? void 0 : res.render('edit', { pageTitle: `Edit: ${video.title}`, video });
});
export const postEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req ? req.params : { id: 0 };
    const { title, description, hashtags } = req.body;
    const video = yield Video.exists({ _id: id });
    if (!video) {
        res === null || res === void 0 ? void 0 : res.status(404).render('404', { pageTitle: 'Video not found' });
        return;
    }
    yield Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res === null || res === void 0 ? void 0 : res.redirect(`/stories/${id}`);
});
export const getUpload = (req, res) => {
    return res.render('upload', { pageTitle: 'Upload Video' });
};
export const postUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, hashtags } = req.body;
    try {
        yield Video.create({
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
    }
    catch (error) {
        res.status(400).render('upload', {
            pageTitle: 'Upload Video',
            errorMessage: error instanceof mongoose.Error.ValidationError
                ? error.message
                : 'Something went wrong',
        });
        return;
    }
});
export const deleteVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const video = yield Video.findByIdAndDelete(id);
    if (!video) {
        res.status(404).render('404', { pageTitle: 'Video not found' });
        return;
    }
    return res.redirect('/');
});
export const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = yield Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, 'i'),
            },
        });
    }
    return res.render('search', { pageTitle: 'Search', videos });
});
