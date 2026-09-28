import type { Request, Response } from "express";
import * as userService from "../services/users.service.js";

export const getUsers = async(req: Request, res: Response) => {
    try{
        const users = await userService.getUsers()
        res.status(200).json(users)
    } catch (error){
        console.error("getUsers controller failed:", error);
        res.status(500).json({ message: "Не удалось взять пользователей из БД" });
    }
}

export const getUser = async(req: Request, res: Response) => {
    try{
        const id = Number(req.params.id)

        if (isNaN(id)) {
            res.status(400).json({ message: "Некорректный id" });
            return;
        }

        const user = await userService.getUser(id)

        if(!user) {
            res.status(404).json({message: "Пользователя не найдено"})
            return
        }
        res.status(200).json(user)
    } catch(error) {
        console.error("getUser controller failed:", error);
        res.status(500).json({ message: "Не удалось взять пользователя из БД" });
    }
}

export const getUserByTelegramId = async(req:Request, res:Response) => {
    try{
        const telegram_id = req.params.telegram_id

        if (typeof telegram_id !== "string") {
            res.status(400).json({ message: "Некорректный telegram_id" });
            return;
        }

        const user = await userService.getUserByTelegramId(telegram_id)

        if(!user){
            res.status(404).json({ message: "Пользователь с таким telegram_id не найден" });
            return
        }

        res.status(200).json(user)
    } catch(error) {
        console.error("getUserByTelegramId controller failed:", error);
        res.status(500).json({ message: "Не удалось взять пользователя по тг из БД" });
    }
}

export const findOrCreateUser = async(req:Request, res: Response) => {
    try{
        const {telegram_id, name, phone, role} = req.body

        const createdUser =  await userService.findOrCreateUser(telegram_id,name,phone,role)

        res.status(200).json(createdUser)
    } catch(error) {
        console.error("findOrCreateUser controller failed:", error);
        res.status(500).json({ message: "Не удалось создать или найти пользователя в тг из БД" });
    }
}

export const updateUser = async(req:Request,res:Response) => {
    try{
        const id = Number(req.params.id)
        const {name, phone} = req.body

        const updatedUser = await userService.updateUser(id,name,phone)

        if (!updatedUser) {
            res.status(404).json({ message: "Пользователь не найден" });
            return;
        }
        res.status(200).json(updatedUser)
    } catch(error) {
        console.error("updateUser controller failed:", error);
        res.status(500).json({ message: "Не удалось обновить пользователя из БД" });
    }
}