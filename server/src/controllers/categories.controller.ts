import type { Request, Response } from "express";
import * as categoriesService from "../services/categories.service.js"

export const getCategories = async (req: Request,res: Response) => {
    try{
        const categories = await categoriesService.getCategories()
        res.status(200).json(categories)
    } catch (error){
        console.error("getCategories controller failed:", error);
        res.status(500).json({ message: "Не удалось взять категории из БД" });
    }
};

export const getActiveCategories = async (req: Request, res: Response) => {
    try{
        const activeCategories = await categoriesService.getActiveCategories()
        res.status(200).json(activeCategories)
    } catch(error) {
        console.error("getActiveCategories controller failed:", error);
        res.status(500).json({ message: "Не удалось взять активные категории из БД" });
    }
}

export const getCategory = async(req:Request, res: Response) => {
    try{
        const id = Number(req.params.id)

        if (isNaN(id)) {
            res.status(400).json({ message: "Некорректный id" });
            return;
        }

        const category = await categoriesService.getCategory(id)

        if(!category) {
            res.status(404).json({message: "Категорию не найдена"})
            return
        }

        res.status(200).json(category)
    } catch(error) {
        console.error("getCategory controller failed:", error);
        res.status(500).json({ message: "Не удалось взять категорию из БД" });
    }
}

export const createCategory = async(req: Request, res: Response) => {
    try {
        const {name} = req.body

        const createdCategory = await categoriesService.createCategory(name)
        res.status(201).json(createdCategory)
    } catch(error) {
        console.error("createCategory controller failed:", error);
        res.status(500).json({ message: "Не удалось создать категорию из БД" });
    }
}

export const updateCategory = async(req: Request, res: Response) => {
    try{
        const id = Number(req.params.id)
        const {name} = req.body

        const updatedCategory = await categoriesService.updateCategory(id, name)

        if(!updatedCategory) {
            res.status(404).json({message: "Категорию не найдено"})
            return
        }

        res.status(200).json(updatedCategory)
    } catch(error) {
        console.error("updateCategory controller failed:", error);
        res.status(500).json({ message: "Не удалось обновить категорию из БД" });
    }
}

export const deleteCategory = async(req: Request, res: Response) => {
    try{
        const id = Number(req.params.id)

        const deletedCategory = await categoriesService.deleteCategory(id)

        if(!deletedCategory) {
            res.status(404).json({message: "Категорию не найдено"})
            return
        }

        res.status(200).json(deletedCategory)
    } catch(error) {
        console.error("deleteCategory controller failed:", error);
        res.status(500).json({ message: "Не удалось удалить категорию из БД" });
    }
}