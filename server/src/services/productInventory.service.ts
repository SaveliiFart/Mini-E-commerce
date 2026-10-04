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
export interface CreateVariantInput {
    category_id:number; 
    brand:string; 
    model:string;
    color: string;
    size: string;
    sku: string;
    price: number;
    stock: number;
}

export const createVariantByBrandModel = async(input: CreateVariantInput) => {
    const client = await pool.connect();
    try{
        await client.query("BEGIN");

        const products = await client.query(` SELECT * FROM products WHERE category_id = $1 AND brand = $2 AND model = $3`, [input.category_id,input.brand,input.model])

        if (products.rows.length === 0) {
            throw new Error(`Товар ${input.brand} ${input.model} не найден`);
        }

        const product_id = products.rows[0].id

        const result = await client.query(`
            INSERT INTO product_variants(product_id,size, color,sku,price,stock) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
        `, [product_id,input.size,input.color,input.sku,input.price,input.stock])

        await client.query("COMMIT");
        return result.rows[0]
    } catch(error) {
        await client.query("ROLLBACK");
        console.error("createVariantByBrandModel failed:", error);
        throw error;
    } finally {
        client.release();
    }
}