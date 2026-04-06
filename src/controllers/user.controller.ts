import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';

export const userController = {
  async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const users = await userRepository.findAll(limit, offset);
    res.json({ 
      status: 'success', 
      data: users.data.map(({password_hash, ...u}) => u), 
      pagination: {
        total: users.total,
        page,
        limit,
        totalPages: Math.ceil(users.total / limit)
      }
    });
  },

  async updateRole(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { role } = req.body;
    
    if (!['VIEWER', 'ANALYST', 'ADMIN'].includes(role)) {
      return res.status(400).json({ status: 'error', message: 'Invalid role' });
    }

    await userRepository.updateRole(id, role);
    res.json({ status: 'success', message: 'Role updated successfully' });
  }
};
