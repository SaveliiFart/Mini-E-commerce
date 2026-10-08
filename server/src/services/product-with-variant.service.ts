// Добавь эту функцию в products.service.ts
import { pool } from "../config/db.js";

export interface CreateProductWithVariantInput {
    category_id: number;
    brand: string;
    model: string;
    description: string | null;
    image_url: string | null;
    color: string;
    size: string;
    sku: string;
    price: number;
    stock: number;
}

export interface CreatedProductWithVariant {
    product_id: number;
    variant_id: number;
}

export const createProductWithVariant = async (
    input: CreateProductWithVariantInput
): Promise<CreatedProductWithVariant> => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");


        const existingProduct = await client.query<{ id: number }>(
            `SELECT id FROM products WHERE brand = $1 AND model = $2 LIMIT 1`,[input.brand, input.model]);

        let productId: number;

        if (existingProduct.rows.length > 0) {
            productId = existingProduct.rows[0].id;
        } else {
            const productResult = await client.query<{ id: number }>(`INSERT INTO products (category_id,brand,model,description,image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [input.category_id,input.brand,input.model,input.description,input.image_url,]
            );

            productId = productResult.rows[0].id;
        }

        const variantResult = await client.query<{ id: number }>(
`INSERT INTO product_variants (product_id, size, color, sku, price, stock)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id`,
            [productId, input.size, input.color, input.sku, input.price, input.stock]
        );

        await client.query("COMMIT");

        return { product_id: productId, variant_id: variantResult.rows[0].id };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("createProductWithVariant failed:", error);
        throw error;
    } finally {
        client.release();
    }
};