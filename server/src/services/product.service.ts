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
    stock: number,
    category_id: number | null
): Promise<Product> => {
    try {
        const result = await pool.query<ProductRow>(
            `INSERT INTO products (name, description, price, image_url, stock, category_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [name, description, price, image_url, stock, category_id]
        );

        return mapRow(result.rows[0]);
    } catch (error) {
        console.error("createProduct failed:", error);
        throw new Error("Не удалось создать товар");
    }
};

export const updateProduct = async (
    id: number,
    name: string,
    description: string | null,
    price: number,
    image_url: string | null,
    stock: number,
    category_id: number | null
): Promise<Product | null> => {
    try{
        const result = await pool.query<ProductRow>(
            `
                UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, stock = $5,category_id = $6, updated_at = NOW() WHERE id = $7 RETURNING *
            `,
            [name, description, price, image_url, stock,category_id, id]
        )

        if (result.rows.length === 0) {
            return null;
        }

        return mapRow(result.rows[0]);
    } catch(error) {
        console.error("updateProduct failed:", error);
        throw new Error("Не удалось обновить товар");
    }
}

export const deleteProduct = async (
    id: number,
): Promise<Product | null> => {
    try{
        const result = await pool.query<ProductRow>(
            `UPDATE products SET is_active = false WHERE id = $1 RETURNING *`,
            [id]
        )

        if (result.rows.length === 0) {
            return null; 
        }

        return mapRow(result.rows[0]);
    } catch (error) {
        console.error("deleteProduct failed:", error);
        throw new Error("Не удалось удалить товар");
    }
}

export const getProduct = async (
    id:number
): Promise<Product | null> => {
    try {
        const result = await pool.query<ProductRow>("SELECT * FROM products WHERE id = $1",[id]);

        if (result.rows.length === 0) {
            return null;
        }

        return mapRow(result.rows[0]);
    } catch (error) {
        console.error("getProduct failed:", error);
        throw new Error("Не удалось получить информацию о товаре");
    }
};