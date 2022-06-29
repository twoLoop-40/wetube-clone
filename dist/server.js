import express from 'express';
const PORT = 4000;
const app = express();
const makeLogger = (logger) => {
    return (req, res, next) => {
        logger(req, res);
        next();
    };
};
const URLLogger = makeLogger((req) => {
    console.log(`PATH: ${req === null || req === void 0 ? void 0 : req.path}`);
});
const timeLogger = makeLogger(() => {
    console.log(`TIME: ${new Date().toISOString()}`);
});
const securityLogger = makeLogger((req) => {
    (req === null || req === void 0 ? void 0 : req.secure) ? console.log('SECURE') : console.log('INSECURE');
});
const privateMiddleWare = makeLogger((req, res) => {
    if (req.path === '/protected') {
        res.send('You are not allowed');
    }
    else {
        console.log('You are allowed');
    }
});
const handleHome = (req, res) => {
    return res.send('<h1>You are home</h1>');
};
app.use(URLLogger, timeLogger, securityLogger, privateMiddleWare);
app.get('/', handleHome);
const listner = () => console.log(`Server is listening on port ${PORT}`);
app.listen(PORT, listner);
