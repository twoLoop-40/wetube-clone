import { Schema, Model, model } from 'mongoose';

export interface VideoSchema {
  title: string;
  description: string;
  createdAt: Date;
  hashtags: string[];
  meta: {
    views: number;
    rating: number;
  };
}

export interface VideoModel extends Model<VideoSchema> {
  formatHashtags(hashtags: string): string[];
}
export const videoSchema = new Schema<VideoSchema, VideoModel>({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, required: true, trim: true, minlength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});

videoSchema.static('formatHashtags', function (hashtags: string) {
  return hashtags
    .split(',')
    .map((word: string) => (word[0] === '#' ? word : `#${word}`));
});
const Video = model<VideoSchema, VideoModel>('Video', videoSchema);
export default Video;
