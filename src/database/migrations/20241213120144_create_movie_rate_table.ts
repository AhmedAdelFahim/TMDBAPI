import type { Knex } from 'knex';
import TABLES from '../tables.constant';

const tableName = TABLES.MOVIE_RATING;

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.bigInteger('movie_id');
    table.bigInteger('user_id');
    table.decimal('rating');
    table.foreign('user_id').references(`${TABLES.USER}.id`);
    table.foreign('movie_id').references(`${TABLES.MOVIE}.id`);
    table.unique(['user_id', 'movie_id']);
    table.timestamps(null, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
