import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType("order_status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])

    pgm.createTable("orders", {
        id: {
            type: "serial",
            primaryKey: true,
        },

        user_id: {
            type: "integer",
            references: "users",
            onDelete: "SET NULL",
        },

        status: {
            type: "order_status",
            notNull: true,
            default: "pending"
        },

        total_price: {
            type: "numeric(10,2)",
            notNull: true,
            check: "total_price >= 0",
        },

        delivery_address: {
            type: "text",
            notNull: true,
        },

        phone: {
            type: "text",
            notNull: true,
        },

        telegram_username: {
            type: "varchar(64)"
        },

        comment: {
            type: "text"
        },

        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },

        updated_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("orders");
    pgm.dropType("order_status")
}
