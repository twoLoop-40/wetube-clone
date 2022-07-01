import { makeHandler } from '../util';

export const handleUser = makeHandler((req, res) => {
  return res?.send('User');
});
export const handleEditProfile = makeHandler((req, res) => {
  return res?.send('Edit Profile');
});
export const handleUserId = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return res?.send(`User ${id}`);
});
