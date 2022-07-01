import express from 'express';
import { makeHandler } from '../util';
export const userRouter = express.Router();
const handleUser = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('User');
});
const handleEditProfile = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('Edit Profile');
});
const handleUserId = makeHandler((req, res) => {
    const { id } = req ? req.params : { id: '0' };
    return res === null || res === void 0 ? void 0 : res.send(`User ${id}`);
});
userRouter.get('/', handleUser);
userRouter.get('/edit-profile', handleEditProfile);
userRouter.get('/:id', handleUserId);