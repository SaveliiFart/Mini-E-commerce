import { pool } from "../config/db.js";
import type { Product } from "../types/product.types.js";

export const getProducts = async (): Promise<Product[]> => {
    try {
        const result = await pool.query<Product>("SELECT * FROM products");
        return result.rows
    } catch (error) {
        console.error("getProducts failed:", error);
        throw new Error("Не удалось получить список товаров");
    }
};

export const getActiveProducts = async (): Promise<Product[]> => {
    try {
        const result = await pool.query<Product>(
            "SELECT * FROM products WHERE is_active = true"
        );
        return result.rows
    } catch (error) {
        console.error("getActiveProducts failed:", error);
        throw new Error("Не удалось получить список активных товаров");
    }
};

export const createProduct = async (
    model: string,
    brand:string,
    description: string | null,
    image_url: string | null,
    category_id: number | null
): Promise<Product> => {
    try {
        const result = await pool.query<Product>(
            `INSERT INTO products (model, brand, description, image_url, category_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [model, brand, description, image_url, category_id]
        );

        return result.rows[0]
    } catch (error) {
        console.error("createProduct failed:", error);
        throw new Error("Не удалось создать товар");
    }
};

export const updateProduct = async (
    id: number,
    model: string,
    brand: string,
    description: string | null,
    image_url: string | null,
    category_id: number | null
): Promise<Product | null> => {
    try{
        const result = await pool.query<Product>(
            `
                UPDATE products SET model = $1, description = $2, image_url = $3,category_id = $4, brand = $5, updated_at = NOW() WHERE id = $6 RETURNING *
            `,
            [model, description, image_url,category_id,brand, id]
        )

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0]
    } catch(error) {
        console.error("updateProduct failed:", error);
        throw new Error("Не удалось обновить товар");
    }
}

export const deleteProduct = async (
    id: number,
): Promise<Product | null> => {
    try{
        const result = await pool.query<Product>(
            `UPDATE products SET is_active = false WHERE id = $1 RETURNING *`,
            [id]
        )

        if (result.rows.length === 0) {
            return null; 
        }

        return result.rows[0]
    } catch (error) {
        console.error("deleteProduct failed:", error);
        throw new Error("Не удалось удалить товар");
    }
}

export const getProduct = async (
    id:number
): Promise<Product | null> => {
    try {
        const result = await pool.query<Product>("SELECT * FROM products WHERE id = $1",[id]);

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0]
    } catch (error) {
        console.error("getProduct failed:", error);
        throw new Error("Не удалось получить информацию о товаре");
    }
};