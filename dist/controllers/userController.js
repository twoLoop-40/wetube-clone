var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import User from '../models/User';
import { makeHandler } from '../util';
import bcrypt from 'bcrypt';
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
export const getLogin = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.render('login', { pageTitle: 'Login' });
});
export const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const pageTitle = 'Login';
    const user = yield User.findOne({ username });
    if (!user) {
        res === null || res === void 0 ? void 0 : res.status(400).render('login', {
            pageTitle,
            errorMessage: 'User does not exist',
        });
        return;
    }
    const ok = yield bcrypt.compare(password, user.password);
    if (!ok) {
        res === null || res === void 0 ? void 0 : res.status(400).render('login', {
            pageTitle,
            errorMessage: 'Password is incorrect',
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res === null || res === void 0 ? void 0 : res.redirect('/');
});
export const getJoin = (req, res) => {
    return res === null || res === void 0 ? void 0 : res.render('join', { pageTitle: 'Join' });
};
export const postJoin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, location, username, passwordConfirm } = req.body;
    const pageTitle = 'Join';
    if (password !== passwordConfirm) {
        return res.status(400).render('join', {
            pageTitle,
            errorMessage: 'Passwords do not match',
        });
    }
    const exists = yield User.exists({ $or: [{ email }, { username }] });
    if (exists) {
        res.status(400).render('join', {
            pageTitle,
            errorMessage: 'Email or username already exists',
        });
    }
    try {
        yield User.create({
            name,
            email,
            password,
            passwordConfirm,
            location,
            username,
        });
        res.redirect('/login');
        return;
    }
    catch (error) {
        res.status(400).render('join', {
            pageTitle,
            errorMessage: error instanceof mongoose.Error.ValidationError
                ? error.message
                : 'Unknown error',
        });
        return;
    }
});
export const getEdit = (req, res) => {
    return res === null || res === void 0 ? void 0 : res.render('edit', { pageTitle: 'Edit profile' });
};
export const postEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { session: { user }, body: { name, email, location, username }, file, } = req;
    const _id = user === null || user === void 0 ? void 0 : user._id;
    const avatarUrl = user === null || user === void 0 ? void 0 : user.avatarUrl;
    // console.log(_id);
    // console.log(file);
    const updatedUser = yield User.findByIdAndUpdate(_id, {
        avatarURl: file ? file.path : avatarUrl,
        name,
        email,
        location,
        username,
    }, { new: true });
    if (updatedUser) {
        req.session.user = updatedUser;
    }
    return res.redirect('/users/edit');
});
