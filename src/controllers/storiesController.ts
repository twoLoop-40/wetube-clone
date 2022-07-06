import { makeHandler } from '../util';

const videos = [
  {
    title: 'First Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 1,
    id: 1,
  },
  {
    title: 'Second Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 59,
    id: 2,
  },
  {
    title: 'Third Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 59,
    id: 3,
  },
];
export const trending = makeHandler((req, res) => {
  return res?.render('home', { pageTitle: 'Home', videos });
});
export const newStories = makeHandler((req, res) => {
  return res?.send('New');
});

export const watch = makeHandler((req, res) => {
  const dec = (n: number) => n - 1;
  const { id } = req ? req.params : { id: 0 };
  const video = videos[dec(Number(id))];
  return res?.render('watch', { pageTitle: `Watching ${video.title}`, video });
});
export const getEdit = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: 0 };
  const dec = (n: number) => n - 1;
  const video = videos[dec(Number(id))];
  return res?.render('edit', { pageTitle: `Editing: ${video.title}`, video });
});

export const postEdit = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: 0 };
  const { title } = req ? req.body : { title: '' };
  const dec = (n: number) => n - 1;
  videos[dec(Number(id))].title = title;
  return res?.redirect(`/stories/${id}`);
});
