import { makeHandler } from '../util';
export const handleUser = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('User');
});
export const handleEditProfile = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('Edit Profile');
});
export const handleUserId = makeHandler((req, res) => {
    const { id } = req ? req.params : { id: '0' };
    return res === null || res === void 0 ? void 0 : res.send(`User ${id}`);
});
