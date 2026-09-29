import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("order_items", {
        id: {
            type: "serial",
            primaryKey: true,
        },

        order_id: {
            type: "integer",
            references: "orders",
            onDelete: "CASCADE",
            notNull: true
        },

        product_id: {
            type: "integer",
            references: "products",
            onDelete: "RESTRICT",
            notNull: true
        },

        quantity: {
            type: "integer",
            notNull: true,
            check: "quantity > 0",
        },

        price: {
            type: "numeric(10,2)",
            notNull: true,
            check: "price >= 0",
        },
    })

    pgm.createIndex("order_items", "order_id");
    pgm.createIndex("order_items", "product_id");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("order_items")
}
