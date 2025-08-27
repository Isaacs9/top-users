import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('users');
  if (!exists) {
    await knex.schema.createTable('users', (t) => {
      t.increments('id').primary();
      t.string('nome').notNullable();
      t.string('email').notNullable().unique();
      t.string('password').notNullable();
      t.string('rua').nullable();
      t.string('numero').nullable();
      t.string('bairro').nullable();
      t.string('complemento').nullable();
      t.string('cidade').nullable();
      t.string('estado').nullable();
      t.string('cep').nullable();
      t.string('status').notNullable().defaultTo('ativo');
      t.boolean('isDeleted').notNullable().defaultTo(false);
      t.timestamp('createdAt').defaultTo(knex.fn.now());
      t.timestamp('updatedAt').defaultTo(knex.fn.now());
      t.timestamp('deletedAt').nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
