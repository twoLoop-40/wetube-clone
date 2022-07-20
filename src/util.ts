import express from 'express';
export type Handler = (req?: express.Request, res?: express.Response) => void;
export const makeHandler = (handler: Handler) => {
  return (
    req?: express.Request,
    res?: express.Response,
    next?: express.NextFunction
  ) => {
    req && res
      ? handler(req, res)
      : req
      ? handler(req)
      : res
      ? handler(req, res)
      : handler();
    if (next) next();
  };
};

export type Controller = {
  (
    req: express.Request,
    res: express.Response,
    next?: express.NextFunction
  ): void;
};
