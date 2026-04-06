import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/types';
import { userRepository } from '../repositories/user.repository';

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password_hash'>;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: number };
    const user = await userRepository.findById(decoded.id);
    
    if (!user || user.status === 'INACTIVE') {
      return res.status(401).json({ status: 'error', message: 'User not found or inactive' });
    }

    const { password_hash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword as any;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};
