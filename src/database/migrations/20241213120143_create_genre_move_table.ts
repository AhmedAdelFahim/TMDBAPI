import type { Knex } from 'knex';
import TABLES from '../tables.constant';

const tableName = TABLES.GENRE_MOVIE;

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.string('tmdb_movie_id');
    table.string('tmdb_genre_id');
    table.unique(['tmdb_genre_id', 'tmdb_movie_id']);
    table.timestamps(null, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
