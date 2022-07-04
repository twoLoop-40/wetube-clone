import { makeHandler } from '../util';
export const seeUsers = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('See Users');
});
export const editProfile = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('Edit Profile');
});
export const seeUser = makeHandler((req, res) => {
    const { id } = req ? req.params : { id: '0' };
    return res === null || res === void 0 ? void 0 : res.send(`See user id: ${id}`);
});
export const login = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('Login');
});
export const join = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('Join');
});
