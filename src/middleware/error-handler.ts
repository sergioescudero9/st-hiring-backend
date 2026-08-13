import { Request, Response, NextFunction } from 'express';

interface HttpError extends Error {
    statusCode?: number;
}

export const errorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(err.statusCode ?? 500).json({ message: err.message ?? 'Internal server error' });
};
