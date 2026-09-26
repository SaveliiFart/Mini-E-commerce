import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("categories", {
        id: {
            type: "serial",
            primaryKey: true,
        },

        name: {
            type: "varchar(255)",
            notNull: true,
        },

        is_active: {
            type: "boolean",
            notNull: true,
            default: true,
        },

        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
        pgm.dropTable("categories");
}
