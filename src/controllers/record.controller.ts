import { Request, Response } from 'express';
import { recordRepository } from '../repositories/record.repository';
import { createRecordSchema, updateRecordSchema } from '../models/schemas';

export const recordController = {
  async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      type: req.query.type as any,
      category: req.query.category as string,
      from_date: req.query.from_date as string,
      to_date: req.query.to_date as string,
    };

    const records = await recordRepository.findAll(limit, offset, filters);
    
    res.json({ 
      status: 'success', 
      data: records.data,
      pagination: {
        total: records.total,
        page,
        limit,
        totalPages: Math.ceil(records.total / limit)
      }
    });
  },

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const record = await recordRepository.findById(id);
    
    if (!record) {
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }
    res.json({ status: 'success', data: record });
  },

  async create(req: Request, res: Response) {
    const data = createRecordSchema.parse(req.body);
    const date = data.date || new Date().toISOString();
    
    const record = await recordRepository.create({
      ...data,
      date,
      created_by: req.user!.id
    });
    
    res.status(201).json({ status: 'success', data: record });
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data = updateRecordSchema.parse(req.body);
    
    const record = await recordRepository.findById(id);
    if (!record) {
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }

    await recordRepository.update(id, data);
    res.json({ status: 'success', message: 'Record updated successfully' });
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    
    const record = await recordRepository.findById(id);
    if (!record) {
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }

    await recordRepository.delete(id);
    res.json({ status: 'success', message: 'Record deleted successfully' });
  }
};
