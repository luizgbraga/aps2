import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const logged = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization as string;
  if (!token) return res.status(401).send('JWT token was not provided');
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as {
      id: string;
    };
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).send('Invalid or expired JWT token');
  }
};
