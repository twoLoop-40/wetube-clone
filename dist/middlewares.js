import multer from 'multer';
export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = 'Wetube';
    console.log(res.locals);
    res.locals.user = req.session.user || {};
    if (next) {
        next();
    }
    return;
};
export const protectMiddleware = (req, res, next) => {
    if (req.session.loggedIn && next) {
        next();
    }
    else {
        return res.redirect('/login');
    }
};
export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn && next) {
        next();
    }
    else {
        return res.redirect('/');
    }
};
export const uploadFiles = multer({ dest: 'uploads/' });
