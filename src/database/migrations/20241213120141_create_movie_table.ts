import type { Knex } from 'knex';
import TABLES from '../tables.constant';

const tableName = TABLES.MOVIE;

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.string('tmdb_movie_id').unique();
    table.string('title');
    table.text('overview');
    table.string('poster_path');
    table.string('original_title');
    table.string('movie_type');
    table.bigInteger('rate_count').defaultTo(0);
    table.double('rate').defaultTo(0);
    table.date('release_date');
    table.timestamps(null, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
