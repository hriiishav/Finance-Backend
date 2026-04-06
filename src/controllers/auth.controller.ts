import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { registerSchema, loginSchema } from '../models/schemas';

export const authController = {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);
    
    const existing = await userRepository.findByUsername(data.username);
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Username already exists' });
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create(data.username, hash, data.role as any);
    
    res.status(201).json({ status: 'success', data: { id: user.id, username: user.username, role: user.role } });
  },

  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const user = await userRepository.findByUsername(data.username);
    
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials or inactive user' });
    }

    const isValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({ status: 'success', data: { token, user: { id: user.id, username: user.username, role: user.role } } });
  }
};
