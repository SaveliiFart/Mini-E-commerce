import { pool } from "../config/db.js";
import type { User } from "../types/user.types.js";

export const getUsers = async(): Promise<User[]> => {
    try{
        const result = await pool.query<User>(`SELECT * FROM users`)
        return result.rows
    } catch(error) {
        console.error("getUsers failed:", error);
        throw new Error("Не удалось получить список пользователей");
    }
}

export const getUser = async(id: number): Promise<User | null> => {
    try{
        const result = await pool.query<User>(`SELECT * FROM users WHERE id = $1`, [id])

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0]
    } catch(error) {
        console.error("getUser failed:", error);
        throw new Error("Не удалось получить пользователя");
    }
}

export const getUserByTelegramId = async(telegram_id:string): Promise<User | null> => {
        try{
        const result = await pool.query<User>(`SELECT * FROM users WHERE telegram_id = $1`, [telegram_id])

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0]
    } catch(error) {
        console.error("getUserByTelegramId failed:", error);
        throw new Error("Не удалось получить пользователя по телеграму");
    }
}


export const findOrCreateUser = async(telegram_id: string, name: string, phone:string | null, role:"customer" | "admin" = "customer"): Promise<User | null> => {
    try{
        const existing = await pool.query<User>(`SELECT * FROM users WHERE telegram_id = $1`, [telegram_id])

        if (existing.rows.length > 0) {
            return existing.rows[0];
        }

        const created = await pool.query<User>(
            `INSERT INTO users (telegram_id, name, phone, role) VALUES ($1, $2, $3, $4) RETURNING *`,
            [telegram_id, name, phone, role]
        );

        return created.rows[0];
    } catch(error) {
        console.error("findOrCreateUser failed:", error);
        throw new Error("Не удалось создать или найти пользователя");
    }
}

export const updateUser = async(id: number, name: string, phone: string | null):Promise<User | null> => {
    try{
        const result = await pool.query<User>(`UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING *`,[name, phone,id])

        if(result.rows.length === 0) {
            return null
        }

        return result.rows[0]
    } catch(error) {
        console.error("updateUser failed:", error);
        throw new Error("Не удалось обновить пользователя");
    }
}