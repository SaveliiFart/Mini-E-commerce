import { pool } from "../config/db.js";
import type { Category } from "../types/category.types.js";

export const getCategories = async(): Promise<Category[]> => {
    try{
        const result = await pool.query(`SELECT * FROM categories`)
        return result.rows
    } catch(error){
        console.error("getCategories failed:", error);
        throw new Error("Не удалось получить список категорий");
    }
}

export const getActiveCategories = async(): Promise<Category[]> => {
    try{
        const result = await pool.query(`SELECT * FROM categories WHERE is_active = true`)
        return result.rows
    } catch(error) {
        console.error("getActiveCategories failed:", error);
        throw new Error("Не удалось получить список активных категорий");
    }
}

export const getCategory = async(id:number): Promise<Category | null> => {
    try{
        const result = await pool.query(`SELECT * FROM categories WHERE id = $1`, [id])

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0]

    } catch(error) {
        console.error("getCategory failed:", error);
        throw new Error("Не удалось получить категорию");
    }
}

export const createCategory = async(name: string): Promise<Category> => {
    try {
        const result = await pool.query(`INSERT INTO categories (name) VALUES ($1) RETURNING *`, [name])

        return result.rows[0]
    } catch(error) {
        console.error("createCategory failed:", error);
        throw new Error("Не удалось создать категорию");
    }
}

export const updateCategory = async(id:number,name: string): Promise<Category | null> => {
    try{
        const result = await pool.query(`UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`, [name, id])

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0]
    } catch(error) {
        console.error("updateCategory failed:", error);
        throw new Error("Не удалось обновить категорию");
    }
}

export const deleteCategory = async(id:number): Promise<Category | null> => {
    try{
        const result = await pool.query(`UPDATE categories SET is_active = false WHERE id = $1 RETURNING *`, [id])

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0]
    } catch (error) {
        console.error("deleteCategory failed:", error);
        throw new Error("Не удалось удалить категорию");
    }
}