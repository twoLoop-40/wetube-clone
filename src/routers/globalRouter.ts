import express from 'express';
import { makeHandler } from '../util';

export const globalRouter = express.Router();

const handleHome = makeHandler((req, res) => {
  return res?.send('Home');
});
const handleTrending = makeHandler((req, res) => {
  return res?.send('Trending');
});
const handleNew = makeHandler((req, res) => {
  return res?.send('New');
});
const handleLogin = makeHandler((req, res) => {
  return res?.send('Login');
});
const handleJoin = makeHandler((req, res) => {
  return res?.send('Join');
});

globalRouter.get('/', handleHome);
globalRouter.get('/trending', handleTrending);
globalRouter.get('/new', handleNew);
globalRouter.get('/login', handleLogin);
globalRouter.get('/join', handleJoin);
