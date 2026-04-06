import { getDb } from '../config/database';
import { FinancialRecord, RecordType } from '../models/types';

export const recordRepository = {
  async findAll(
    limit: number, 
    offset: number, 
    filters?: { type?: RecordType; category?: string; from_date?: string; to_date?: string }
  ): Promise<{ data: FinancialRecord[], total: number }> {
    const db = await getDb();
    let query = 'SELECT * FROM records WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM records WHERE 1=1';
    const params: any[] = [];

    if (filters?.type) {
      query += ' AND type = ?';
      countQuery += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters?.category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters?.from_date) {
      query += ' AND date >= ?';
      countQuery += ' AND date >= ?';
      params.push(filters.from_date);
    }
    if (filters?.to_date) {
      query += ' AND date <= ?';
      countQuery += ' AND date <= ?';
      params.push(filters.to_date);
    }

    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    const data = await db.all<FinancialRecord[]>(query, [...params, limit, offset]);
    const { total } = await db.get<{total: number}>(countQuery, params) || { total: 0 };
    
    return { data, total };
  },

  async findById(id: number): Promise<FinancialRecord | undefined> {
    const db = await getDb();
    return db.get<FinancialRecord>('SELECT * FROM records WHERE id = ?', [id]);
  },

  async create(record: Omit<FinancialRecord, 'id'>): Promise<FinancialRecord> {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO records (amount, type, category, date, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [record.amount, record.type, record.category, record.date, record.notes || null, record.created_by]
    );
    const id = result.lastID!;
    return this.findById(id) as Promise<FinancialRecord>;
  },

  async update(id: number, record: Partial<FinancialRecord>): Promise<void> {
    const db = await getDb();
    const sets: string[] = [];
    const params: any[] = [];
    
    for (const [key, value] of Object.entries(record)) {
      if (key !== 'id' && value !== undefined) {
        sets.push(`${key} = ?`);
        params.push(value);
      }
    }
    
    if (sets.length === 0) return;
    
    params.push(id);
    await db.run(`UPDATE records SET ${sets.join(', ')} WHERE id = ?`, params);
  },

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM records WHERE id = ?', [id]);
  },

  async getDashboardSummary() {
    const db = await getDb();
    const income = await db.get<{total: number}>("SELECT SUM(amount) as total FROM records WHERE type = 'INCOME'") || { total: 0 };
    const expense = await db.get<{total: number}>("SELECT SUM(amount) as total FROM records WHERE type = 'EXPENSE'") || { total: 0 };
    const categoryTotals = await db.all<{category: string, total: number}>("SELECT category, SUM(amount) as total FROM records GROUP BY category");
    
    return {
      total_income: income.total || 0,
      total_expense: expense.total || 0,
      net_balance: (income.total || 0) - (expense.total || 0),
      by_category: categoryTotals
    };
  }
};
