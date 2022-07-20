import multer from 'multer';
import { Controller } from './util';

export const localMiddleware: Controller = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = 'Wetube';
  res.locals.user = req.session.user || {};
  if (next) {
    next();
  }
  return;
};

export const protectMiddleware: Controller = (req, res, next) => {
  if (req.session.loggedIn && next) {
    next();
  } else {
    return res.redirect('/login');
  }
};

export const publicOnlyMiddleware: Controller = (req, res, next) => {
  if (!req.session.loggedIn && next) {
    next();
  } else {
    return res.redirect('/');
  }
};

export const uploadFiles = multer({ dest: 'uploads/' });
