import { Request, Response } from 'express';
import { recordRepository } from '../repositories/record.repository';

export const dashboardController = {
  async getSummary(req: Request, res: Response) {
    const summary = await recordRepository.getDashboardSummary();
    res.json({ status: 'success', data: summary });
  }
};
