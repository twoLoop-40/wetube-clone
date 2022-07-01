import { makeHandler } from '../util';

export const handleWatchVideo = makeHandler((req, res) => {
  return res?.send('Watch Video');
});
export const handleStoryId = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return isNaN(parseInt(id)) || id === '0'
    ? res?.send('Invalid Story Id')
    : res?.send(`Story ${id}`);
});
export const handleEditStory = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return res?.send(`Edit Story for ${id}`);
});
export const handleDeleteStory = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return res?.send(`Delete Story for ${id}`);
});
