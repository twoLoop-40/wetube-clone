import { makeHandler } from '../util';

export const trending = makeHandler((req, res) => {
  return res?.render('home', { pageTitle: 'Trending' });
});
export const newStories = makeHandler((req, res) => {
  return res?.send('New');
});

export const seeStory = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return isNaN(parseInt(id)) || id === '0'
    ? res?.send('Invalid Story Id')
    : res?.render('watch', { pageTitle: 'Watch' });
});
export const editStory = makeHandler((req, res) => {
  const { id }: { id?: string } = req ? req.params : { id: '0' };
  return res?.render('edit', { pageTitle: `Edit ${id}` });
});
export const deleteStory = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return res?.send(`Delete Story for ${id}`);
});
