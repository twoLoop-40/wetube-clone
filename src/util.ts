import express from 'express';
export type Logger = (req?: express.Request, res?: express.Response) => void;
export const makeLogger = (logger: Logger) => {
  return (
    req?: express.Request,
    res?: express.Response,
    next?: express.NextFunction
  ) => {
    req && res
      ? logger(req, res)
      : req
      ? logger(req)
      : res
      ? logger(req, res)
      : logger();
    if (next) next();
  };
};
