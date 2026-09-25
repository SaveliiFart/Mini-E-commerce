import { pool } from "../config/db.js";
import type { Product } from "../types/product.types.js";


type ProductRow = Omit<Product, "price"> & { price: string };

const mapRow = (row: ProductRow): Product => ({
    ...row,
    price: Number(row.price),
});

export const getProducts = async (): Promise<Product[]> => {
    try {
        const result = await pool.query<ProductRow>("SELECT * FROM products");
        return result.rows.map(mapRow);
    } catch (error) {
        console.error("getProducts failed:", error);
        throw new Error("Не удалось получить список товаров");
    }
};

export const getActiveProducts = async (): Promise<Product[]> => {
    try {
        const result = await pool.query<ProductRow>(
            "SELECT * FROM products WHERE is_active = true"
        );
        return result.rows.map(mapRow);
    } catch (error) {
        console.error("getActiveProducts failed:", error);
        throw new Error("Не удалось получить список активных товаров");
    }
};

export const createProduct = async (
    name: string,
    description: string | null,
    price: number,
    image_url: string | null,
    stock: number
): Promise<Product> => {
    try {
        const result = await pool.query<ProductRow>(
            `INSERT INTO products (name, description, price, image_url, stock)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [name, description, price, image_url, stock]
        );

        return mapRow(result.rows[0]);
    } catch (error) {
        console.error("createProduct failed:", error);
        throw new Error("Не удалось создать товар");
    }
};