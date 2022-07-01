export const makeHandler = (handler) => {
    return (req, res, next) => {
        req && res
            ? handler(req, res)
            : req
                ? handler(req)
                : res
                    ? handler(req, res)
                    : handler();
        if (next)
            next();
    };
};
