import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("product_variants", {
        id: {
            type: "serial",
            primaryKey: true,
        },

        product_id: {
            type: "integer",
            references: "products",
            onDelete: "CASCADE",
            notNull: true
        },

        size: {
            type: "text",
            notNull: true
        },

        color: {
            type: "text",
            notNull: true
        },

        sku: {
            type: "text",
            unique: true,
            notNull: true,
        },

        price: {
            type: "numeric(10,2)",
            notNull: true,
            check: "price >= 0",
        },

        stock: {
            type: "integer",
            notNull: true,
            default: 0,
            check: "stock >= 0",
        },

        is_active: {
            type: "boolean",
            notNull: true,
            default: true,
        },
    })

    pgm.createIndex("product_variants", "product_id")

    pgm.dropColumn("products", "price")
    pgm.dropColumn("products", "stock")

    pgm.dropConstraint("order_items", "order_items_product_id_fkey");
    pgm.renameColumn("order_items", "product_id", "variant_id");

    pgm.addConstraint("order_items", "order_items_variant_id_fkey", {
        foreignKeys: {
            columns: "variant_id",
            references: "product_variants",
            onDelete: "RESTRICT",
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropConstraint("order_items", "order_items_variant_id_fkey");
    pgm.renameColumn("order_items", "variant_id", "product_id");

    pgm.addConstraint("order_items", "order_items_product_id_fkey", {
        foreignKeys: {
            columns: "product_id",
            references: "products",
            onDelete: "RESTRICT",
        },
    });

    pgm.addColumn("products", {
        price: {
            type: "numeric(10,2)",
            notNull: true,
            check: "price >= 0",
        },
    });

    pgm.addColumn("products", {
        stock: {
            type: "integer",
            notNull: true,
            default: 0,
            check: "stock >= 0",
        },
    });

    pgm.dropTable("product_variants");
}
