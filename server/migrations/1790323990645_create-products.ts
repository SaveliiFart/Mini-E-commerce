import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("products", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    name: {
      type: "varchar(255)",
      notNull: true,
    },

    description: {
      type: "text",
    },

    price: {
      type: "numeric(10,2)",
      notNull: true,
      check: "price >= 0",
    },

    image_url: {
      type: "text",
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
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("products");
}

