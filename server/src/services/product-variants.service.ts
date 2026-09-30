import { pool } from "../config/db.js";
import type { ProductVariant } from "../types/productVariant.types.js";

type VariantRow = Omit<ProductVariant, "price"> & { price: string };

const mapRow = (row: VariantRow): ProductVariant => ({
    ...row,
    price: Number(row.price)
})

export const getVariants = async(product_id:number): Promise<ProductVariant[]> => {
    try{
        const result = await pool.query<VariantRow>(`SELECT * FROM product_variants WHERE product_id = $1`, [product_id])
        return result.rows.map(mapRow)
    } catch(error) {
        console.error("getVariants failed:", error);
        throw new Error("Не удалось получить характеристики товаров");
    }
}

export const getVariant = async(id:number): Promise<ProductVariant | null> => {
    try{
        const result = await pool.query<VariantRow>(`SELECT * FROM product_variants WHERE id = $1`, [id])

        if(result.rows.length === 0) {
            return null
        }

        return mapRow(result.rows[0])
    } catch(error) {
        console.error("getVariant failed:", error);
        throw new Error("Не удалось получить характеристику товара");
    }
}

export const createVariant = async(
    product_id: number,
    size: string,
    color: string,
    sku: string,
    price: number,
    stock: number
): Promise<ProductVariant> => {
    try{
        const result = await pool.query<VariantRow>(`
            INSERT INTO product_variants(product_id,size,color,sku,price,stock) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
        `, [product_id,size,color,sku,price,stock])

        return mapRow(result.rows[0])
    } catch(error) {
        console.error("createVariant failed:", error);
        throw new Error("Не удалось создать характеристику товару");
    }
}

export const updateVariant = async(
    id:number,
    size: string,
    color: string,
    sku: string,
    price: number,
    stock: number
): Promise<ProductVariant | null> => {
    try{
        const result = await pool.query<VariantRow>(`
            UPDATE product_variants SET size = $1, color = $2, sku = $3, price = $4, stock = $5 WHERE id = $6 RETURNING *
        `, [size,color,sku,price,stock,id])

        if(result.rows.length === 0) {
            return null
        }

        return mapRow(result.rows[0])
    } catch(error) {
        console.error("updateVariant failed:", error);
        throw new Error("Не удалось обновить характеристику товару");
    }
}

export const deleteVariant = async(id:number): Promise<ProductVariant | null> => {
    try{
        const result = await pool.query<VariantRow>(`UPDATE product_variants SET is_active = false WHERE id = $1 RETURNING *`, [id])

        if(result.rows.length === 0) {
            return null
        }

        return mapRow(result.rows[0])
    } catch(error) {
        console.error("deleteVariant failed:", error);
        throw new Error("Не удалось удалить характеристику товару");
    }
}