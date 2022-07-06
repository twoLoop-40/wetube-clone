import { makeHandler } from '../util';
export const trending = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.render('home', { pageTitle: 'Trending' });
});
export const newStories = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('New');
});
export const seeStory = makeHandler((req, res) => {
    const { id } = req ? req.params : { id: '0' };
    return isNaN(parseInt(id)) || id === '0'
        ? res === null || res === void 0 ? void 0 : res.send('Invalid Story Id')
        : res === null || res === void 0 ? void 0 : res.render('watch', { pageTitle: 'Watch' });
});
export const editStory = makeHandler((req, res) => {
    const { id } = req ? req.params : { id: '0' };
    return res === null || res === void 0 ? void 0 : res.render('edit', { pageTitle: `Edit ${id}` });
});
export const deleteStory = makeHandler((req, res) => {
    const { id } = req ? req.params : { id: '0' };
    return res === null || res === void 0 ? void 0 : res.send(`Delete Story for ${id}`);
});
