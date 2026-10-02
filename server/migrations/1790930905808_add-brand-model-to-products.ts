import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn("products", {
        brand: {
            type: "text",
            notNull: true
        },

        model: {
            type: "text",
            notNull: true
        }
    })

    pgm.dropColumn("products","name")
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn("products", {
        name: {
            type: "varchar(255)",
            notNull: true,
        },
    })

    pgm.dropColumn("products","brand")
    pgm.dropColumn("products","model")
}
