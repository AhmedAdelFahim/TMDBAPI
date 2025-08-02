import type { Knex } from 'knex';
import TABLES from '../tables.constant';

const tableName = TABLES.USER;
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.string('email').unique();
    table.string('name');
    table.string('password');
    table.timestamps(null, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
