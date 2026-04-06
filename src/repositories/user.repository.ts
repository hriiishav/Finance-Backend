import { getDb } from '../config/database';
import { User, Role } from '../models/types';

export const userRepository = {
  async findByUsername(username: string): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>('SELECT * FROM users WHERE username = ?', [username]);
  },
  
  async findById(id: number): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>('SELECT * FROM users WHERE id = ?', [id]);
  },

  async create(username: string, password_hash: string, role: Role): Promise<User> {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, password_hash, role]
    );
    const id = result.lastID!;
    return this.findById(id) as Promise<User>;
  },

  async findAll(limit: number, offset: number): Promise<{data: User[], total: number}> {
    const db = await getDb();
    const data = await db.all<User[]>('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);
    const { total } = await db.get<{total: number}>('SELECT COUNT(*) as total FROM users') || { total: 0 };
    return { data, total };
  },

  async updateRole(id: number, role: Role): Promise<void> {
    const db = await getDb();
    await db.run('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  }
};
