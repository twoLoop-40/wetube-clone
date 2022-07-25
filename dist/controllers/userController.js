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
import { URLSearchParams } from 'url';
import User from '../models/User';
import { makeHandler } from '../util';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
const makeURLFromConfig = (baseUrl, configParams, handler) => {
    return handler(baseUrl, configParams);
};
const joinURL = (baseUrl, params) => {
    return baseUrl + '?' + new URLSearchParams(params).toString();
};
export const startGithublogin = (req, res) => {
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID || '',
        allow_signup: 'false',
        scope: 'read:user user:email',
    };
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const finalUrl = makeURLFromConfig(baseUrl, config, joinURL);
    res.redirect(finalUrl);
    return;
};
export const finishGithublogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fetchData = (url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const json = yield fetch(url, {
                method: 'POST',
                headers: { Accept: 'application/json' },
            }).then(response => response.json());
            if ('access_token' in json) {
                const { access_token } = json;
                console.log(access_token);
                return access_token;
            }
            else {
                throw new Error('No access token');
            }
        }
        catch (error) {
            console.log(error);
            return;
        }
    });
    const getUserRequest = (token) => __awaiter(void 0, void 0, void 0, function* () {
        const apiUrl = 'https://api.github.com';
        const getUserData = (urlMaker) => {
            return (...routes) => Promise.all(urlMaker(routes).map(url => {
                console.log(url);
                return fetch(url, {
                    headers: {
                        Authorization: `token ${token}`,
                    },
                }).then(response => response.json());
            }));
        };
        const userDataFromRoutes = getUserData(routes => routes.map(route => apiUrl + route));
        const data = yield userDataFromRoutes('/user', '/user/emails');
        const findEmails = (...verifiers) => {
            return (emails) => {
                const verifiedEmails = emails.find(email => verifiers.every(verifier => verifier(email)));
                return verifiedEmails;
            };
        };
        const emailObj = findEmails(email => email.primary === true, email => email.verified === true)(data[1]);
        const logInByEmail = (checkUser, userLoginByEmail, makeUser) => {
            return (emailObj, user) => __awaiter(void 0, void 0, void 0, function* () {
                const { email } = emailObj;
                if (yield checkUser(email)) {
                    userLoginByEmail(email);
                }
                else {
                    makeUser(user, email);
                }
            });
        };
        if (emailObj) {
            const logInProcess = user => {
                req.session.user = user || undefined;
                req.session.loggedIn = true;
                res.redirect('/');
            };
            yield logInByEmail((email) => __awaiter(void 0, void 0, void 0, function* () {
                const existingUser = yield User.findOne({ email });
                return existingUser !== null;
            }), (email) => __awaiter(void 0, void 0, void 0, function* () {
                const existingUser = yield User.findOne({ email });
                logInProcess(existingUser);
                return;
            }), (user, email) => __awaiter(void 0, void 0, void 0, function* () {
                const newUser = yield User.create({
                    avatarUrl: user.avatar_url,
                    name: user.name,
                    username: user.login,
                    email,
                    password: '',
                    socialOnly: true,
                    location: user.location,
                });
                logInProcess(newUser);
                return;
            }))(emailObj, data[0]);
        }
        else {
            res.redirect('/login');
            return;
        }
    });
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID || '',
        client_secret: process.env.GITHUB_CLIENT_SECRET || '',
        code: ((_a = req.query.code) === null || _a === void 0 ? void 0 : _a.toString()) || '',
    };
    const finalUrl = makeURLFromConfig(baseUrl, config, joinURL);
    const getAccess = (getToken, successCallback, errorCallback) => {
        return (url) => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield getToken(url);
            return token ? successCallback(token) : errorCallback();
        });
    };
    const access = getAccess(fetchData, getUserRequest, () => {
        res.redirect('/login');
        return;
    });
    access(finalUrl);
});
export const editProfile = makeHandler((req, res) => {
    return res === null || res === void 0 ? void 0 : res.send('Edit Profile');
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
export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
    return;
};
