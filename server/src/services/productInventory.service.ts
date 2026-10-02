import { pool } from "../config/db.js";

export const getBrandsByCategory = async (category_id: number): Promise<string[]> => {
    try {
        const result = await pool.query<{ brand: string }>(
            `SELECT DISTINCT brand FROM products WHERE category_id = $1 ORDER BY brand`,
            [category_id]
        );
        return result.rows.map((row) => row.brand);
    } catch (error) {
        console.error("getBrandsByCategory failed:", error);
        throw new Error("Не удалось получить список брендов");
    }
};

export const getModelsByBrand = async (category_id: number, brand: string): Promise<string[]> => {
    try {
        const result = await pool.query<{ model: string }>(
            `SELECT DISTINCT model FROM products WHERE category_id = $1 AND brand = $2 ORDER BY model`,
            [category_id, brand]
        );
        return result.rows.map((row) => row.model);
    } catch (error) {
        console.error("getModelsByBrand failed:", error);
        throw new Error("Не удалось получить список моделей");
    }
};

export const getProductByBrandModel = async (
    category_id: number,
    brand: string,
    model: string
) => {
    try {
        const result = await pool.query(
            `SELECT * FROM products WHERE category_id = $1 AND brand = $2 AND model = $3 LIMIT 1`,
            [category_id, brand, model]
        );
        return result.rows[0] ?? null;
    } catch (error) {
        console.error("getProductByBrandModel failed:", error);
        throw new Error("Не удалось найти товар");
    }
};