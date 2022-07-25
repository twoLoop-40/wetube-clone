import mongoose from 'mongoose';
import { URLSearchParams } from 'url';
import User, { UserSchema } from '../models/User';
import { Controller, makeHandler } from '../util';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

declare module 'express-session' {
  interface SessionData {
    user: UserSchema;
    loggedIn: boolean;
  }
}
type ParamData =
  | string
  | URLSearchParams
  | Record<string, string | readonly string[]>
  | Iterable<[string, string]>
  | readonly [string, string][];

const makeURLFromConfig = (
  baseUrl: string,
  configParams: ParamData,
  handler: (baseUrl: string, paramArgs: ParamData) => string
) => {
  return handler(baseUrl, configParams);
};
const joinURL = (baseUrl: string, params: ParamData) => {
  return baseUrl + '?' + new URLSearchParams(params).toString();
};
export const startGithublogin: Controller = (req, res) => {
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
type AccessFunction<T> = {
  (
    arg1: (arg: string) => Promise<T>,
    arg2: (arg: T) => void,
    arg3: (arg: void) => void
  ): (input: string) => void;
};
export const finishGithublogin: Controller = async (req, res) => {
  const fetchData = async (url: string) => {
    try {
      const json = await fetch(url, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      }).then(response => response.json());
      if ('access_token' in json) {
        const { access_token } = json;
        console.log(access_token);
        return access_token;
      } else {
        throw new Error('No access token');
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const getUserRequest = async <T>(token: T) => {
    const apiUrl = 'https://api.github.com';
    const getUserData = (urlMaker: (args: string[]) => string[]) => {
      return (...routes: string[]) =>
        Promise.all(
          urlMaker(routes).map(url => {
            console.log(url);
            return fetch(url, {
              headers: {
                Authorization: `token ${token}`,
              },
            }).then(response => response.json());
          })
        );
    };
    const userDataFromRoutes = getUserData(routes =>
      routes.map(route => apiUrl + route)
    );

    const data = await userDataFromRoutes('/user', '/user/emails');

    interface Email {
      primary: boolean;
      verified: boolean;
      email: string;
    }
    const findEmails = <T>(...verifiers: ((arg: T) => boolean)[]) => {
      return (emails: T[]) => {
        const verifiedEmails = emails.find(email =>
          verifiers.every(verifier => verifier(email))
        );
        return verifiedEmails;
      };
    };
    const emailObj = findEmails<Email>(
      email => email.primary === true,
      email => email.verified === true
    )(data[1]);

    type UserVerification = { (email: string): Promise<boolean> };
    type handleExistingUser = { (email: string): void };
    type handleNewUser = { (user: typeof data[0], email: string): void };
    const logInByEmail = (
      checkUser: UserVerification,
      userLoginByEmail: handleExistingUser,
      makeUser: handleNewUser
    ) => {
      return async (emailObj: Email, user: typeof data[0]) => {
        const { email } = emailObj;
        if (await checkUser(email)) {
          userLoginByEmail(email);
        } else {
          makeUser(user, email);
        }
      };
    };
    if (emailObj) {
      type LogInProcess = { (user: UserSchema | null): void };
      const logInProcess: LogInProcess = user => {
        req.session.user = user || undefined;
        req.session.loggedIn = true;
        res.redirect('/');
      };
      await logInByEmail(
        async email => {
          const existingUser = await User.findOne({ email });
          return existingUser !== null;
        },
        async email => {
          const existingUser = await User.findOne({ email });
          logInProcess(existingUser);
          return;
        },
        async (user, email) => {
          const newUser = await User.create({
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
        }
      )(emailObj, data[0]);
    } else {
      res.redirect('/login');
      return;
    }
  };
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID || '',
    client_secret: process.env.GITHUB_CLIENT_SECRET || '',
    code: req.query.code?.toString() || '',
  };
  const finalUrl = makeURLFromConfig(baseUrl, config, joinURL);
  const getAccess: AccessFunction<string> = (
    getToken,
    successCallback,
    errorCallback
  ) => {
    return async (url: string) => {
      const token = await getToken(url);

      return token ? successCallback(token) : errorCallback();
    };
  };
  const access = getAccess(fetchData, getUserRequest, () => {
    res.redirect('/login');
    return;
  });
  access(finalUrl);
};

export const editProfile = makeHandler((req, res) => {
  return res?.send('Edit Profile');
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

export const logout: Controller = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
  return;
};
