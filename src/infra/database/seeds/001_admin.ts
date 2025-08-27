import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const email = 'admin@example.com';
  const exists = await knex('users').where({ email }).first();
  if (!exists) {
    const password = await bcrypt.hash('Admin@123456', 10);
    await knex('users').insert({ nome: 'Admin', email, password } as any);
  }
}
