import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string }; 
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) =>  {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { id: number; email: string };
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
