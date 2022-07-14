import { Schema, model } from 'mongoose';
export const videoSchema = new Schema({
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, minlength: 20 },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, required: true, default: 0 },
        rating: { type: Number, required: true, default: 0 },
    },
});
videoSchema.static('formatHashtags', function (hashtags) {
    return hashtags
        .split(',')
        .map((word) => (word[0] === '#' ? word : `#${word}`));
});
const Video = model('Video', videoSchema);
export default Video;
