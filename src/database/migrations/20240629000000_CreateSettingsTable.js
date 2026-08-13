/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('settings', table => {
        table.increments('id').primary();
        table.string('currency').notNullable().defaultTo('USD');
        table.string('timezone').notNullable().defaultTo('UTC');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('settings');
};
