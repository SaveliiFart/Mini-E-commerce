import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
        pgm.createType("user_role", ["customer", "admin"])

        pgm.createTable("users", {
        id: {
            type: "serial",
            primaryKey: true,
        },

        telegram_id: {
            type: "bigint",
            unique: true,
            notNull: true,
        },

        name: {
            type: "varchar(255)",
            notNull: true,
        },

        phone: {
            type: "text",
        },

        role: {
            type: "user_role",
            notNull: true,
            default: "customer",
        },

        created_at: {
            type: "timestamp",
            default: pgm.func("current_timestamp"),
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("users")
    pgm.dropType("user_role")
}
