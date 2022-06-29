export const makeLogger = (logger) => {
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
