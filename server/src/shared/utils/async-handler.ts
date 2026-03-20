import {Request, Response, NextFunction} from 'express';

type TAsyncRequestHandler<T> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

export const asyncHandler = <T>(fn: TAsyncRequestHandler<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
