import express from 'express';
const PORT = 4000;
const app = express();
const makeLogger = (logger) => {
    return (req, res, next) => {
        req && res
            ? logger(req, res)
            : req
                ? logger(req)
                : res
                    ? logger(req, res)
                    : logger();
        if (next)
            next();
    };
};
const URLLogger = makeLogger(req => {
    console.log(`PATH: ${req === null || req === void 0 ? void 0 : req.path}`);
});
const timeLogger = makeLogger(() => {
    console.log(`TIME: ${new Date().toISOString()}`);
});
const securityLogger = makeLogger(req => {
    const protocol = req === null || req === void 0 ? void 0 : req.protocol;
    protocol && protocol === 'https'
        ? console.log('SECURE')
        : console.log('INSECURE');
});
const privateMiddleWare = makeLogger((req, res) => {
    if ((req === null || req === void 0 ? void 0 : req.path) === '/protected') {
        res === null || res === void 0 ? void 0 : res.send('You are not allowed');
    }
    else {
        console.log('Allowed, you may pass');
    }
});
const handleHome = (req, res) => {
    return res.send('<h1>You are home</h1>');
};
app.use(URLLogger, timeLogger, securityLogger, privateMiddleWare);
app.get('/', handleHome);
const listner = () => console.log(`Server is listening on port ${PORT}`);
app.listen(PORT, listner);
