import bcrypt from 'bcrypt';
import { initDb, getDb } from '../config/database';

async function seed() {
  await initDb();
  const db = await getDb();

  console.log('Seeding Database...');

  // Clear existing
  await db.exec('DELETE FROM records; DELETE FROM users;');

  // Insert Users
  const adminHash = await bcrypt.hash('admin123', 10);
  const analystHash = await bcrypt.hash('analyst123', 10);
  const viewerHash = await bcrypt.hash('viewer123', 10);

  await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', adminHash, 'ADMIN']);
  await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['analyst', analystHash, 'ANALYST']);
  await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['viewer', viewerHash, 'VIEWER']);

  const admin = await db.get<{id: number}>('SELECT id FROM users WHERE username = ?', ['admin']);
  if (!admin) throw new Error('Admin not found after insert');

  // Insert Records
  const records = [
    { amount: 5000, type: 'INCOME', category: 'Salary', date: '2025-01-01T10:00:00Z', notes: 'January Salary' },
    { amount: 1200, type: 'EXPENSE', category: 'Rent', date: '2025-01-05T10:00:00Z', notes: 'Office Rent' },
    { amount: 300, type: 'EXPENSE', category: 'Utilities', date: '2025-01-06T10:00:00Z', notes: 'Internet and Electricity' },
    { amount: 1500, type: 'INCOME', category: 'Consulting', date: '2025-01-10T10:00:00Z', notes: 'Client A' },
    { amount: 50, type: 'EXPENSE', category: 'Office Supplies', date: '2025-01-12T10:00:00Z', notes: 'Pens and Paper' },
  ];

  for (const r of records) {
    await db.run(
      'INSERT INTO records (amount, type, category, date, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [r.amount, r.type, r.category, r.date, r.notes, admin.id]
    );
  }

  console.log('Database seeded successfully!');
  console.log('Accounts:');
  console.log(' - admin / admin123 (Role: ADMIN)');
  console.log(' - analyst / analyst123 (Role: ANALYST)');
  console.log(' - viewer / viewer123 (Role: VIEWER)');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
