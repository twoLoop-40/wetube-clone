import mongoose from 'mongoose';
import User, { UserSchema } from '../models/User';
import { Controller, makeHandler } from '../util';
import bcrypt from 'bcrypt';

declare module 'express-session' {
  interface SessionData {
    user: UserSchema;
    loggedIn: boolean;
  }
}

export const seeUsers = makeHandler((req, res) => {
  return res?.send('See Users');
});
export const editProfile = makeHandler((req, res) => {
  return res?.send('Edit Profile');
});
export const seeUser = makeHandler((req, res) => {
  const { id } = req ? req.params : { id: '0' };
  return res?.send(`See user id: ${id}`);
});

export const getLogin = makeHandler((req, res) => {
  return res?.render('login', { pageTitle: 'Login' });
});

export const postLogin: Controller = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = 'Login';
  const user = await User.findOne({ username });
  if (!user) {
    res?.status(400).render('login', {
      pageTitle,
      errorMessage: 'User does not exist',
    });
    return;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    res?.status(400).render('login', {
      pageTitle,
      errorMessage: 'Password is incorrect',
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res?.redirect('/');
};
export const getJoin: Controller = (req, res) => {
  return res?.render('join', { pageTitle: 'Join' });
};
export const postJoin: Controller = async (req, res) => {
  const { name, email, password, location, username, passwordConfirm } =
    req.body;

  const pageTitle = 'Join';
  if (password !== passwordConfirm) {
    return res.status(400).render('join', {
      pageTitle,
      errorMessage: 'Passwords do not match',
    });
  }
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) {
    res.status(400).render('join', {
      pageTitle,
      errorMessage: 'Email or username already exists',
    });
  }
  try {
    await User.create({
      name,
      email,
      password,
      passwordConfirm,
      location,
      username,
    });
    res.redirect('/login');
    return;
  } catch (error) {
    res.status(400).render('join', {
      pageTitle,
      errorMessage:
        error instanceof mongoose.Error.ValidationError
          ? error.message
          : 'Unknown error',
    });
    return;
  }
};
export const getEdit: Controller = (req, res) => {
  return res?.render('edit', { pageTitle: 'Edit profile' });
};
export const postEdit: Controller = async (req, res) => {
  const {
    session: { user },
    body: { name, email, location, username },
    file,
  } = req;
  const _id = user?._id;
  const avatarUrl = user?.avatarUrl;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarURl: file ? file.path : avatarUrl,
      name,
      email,
      location,
      username,
    },
    { new: true }
  );
  if (updatedUser) {
    req.session.user = updatedUser;
  }
  return res.redirect('/users/edit');
};
