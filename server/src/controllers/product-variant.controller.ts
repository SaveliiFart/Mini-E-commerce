import type { Request, Response } from "express";
import * as variantService from "../services/product-variant.service.js";

export const getVariants = async(req:Request, res:Response) => {
    try{
        const product_id = Number(req.params.product_id);

        if (isNaN(product_id)) {
            res.status(400).json({ message: "Некорректный product_id" });
            return;
        }

        const productVariants = await variantService.getVariants(product_id)
        res.status(201).json(productVariants)
    } catch(error) {
        console.error("getVariants controller failed:", error);
        res.status(500).json({ message: "Не удалось взять характеристику товаров из БД" });
    }
}

export const getVariant = async(req:Request, res:Response) => {
    try{
        const id = Number(req.params.id)

        if (isNaN(id)) {
            res.status(400).json({ message: "Некорректный id" });
            return;
        }

        const variant = await variantService.getVariant(id)

        if (!variant) {
            res.status(404).json({ message: "Вариант не найден" });
            return;
        }
        res.status(201).json(variant)
    } catch(error) {
        console.error("getVariant controller failed:", error);
        res.status(500).json({ message: "Не удалось взять характеристику товара из БД" });
    }
}

export const createVariant = async(req:Request, res:Response) => {
    try{
        const {product_id, size, color, sku, price, stock} = req.body

        const createdVariant = await variantService.createVariant(product_id,size,color,sku,price,stock)
        res.status(200).json(createdVariant)
    } catch(error) {
        console.error("createVariant controller failed:", error);
        res.status(500).json({ message: "Не удалось создать характеристику товару из БД" });
    }
}

export const updateVariant = async(req:Request, res:Response) => {
    try{
        const id = Number(req.params.id);
        const { size, color, sku, price, stock} = req.body

        if (isNaN(id)) {
            res.status(400).json({ message: "Некорректный id" });
            return;
        }

        const updatedVariant = await variantService.updateVariant(id,size,color,sku,price,stock)

        if (!updatedVariant) {
            res.status(404).json({ message: "Вариант не найден" });
            return;
        }
        res.status(201).json(updatedVariant)
    } catch(error) {
        console.error("updateVariant controller failed:", error);
        res.status(500).json({ message: "Не удалось обновить характеристику товару из БД" });
    }
}

export const deleteVariant = async(req:Request, res:Response) => {
    try{
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: "Некорректный id" });
            return;
        }
        const deletedVariant = await variantService.deleteVariant(id)

        if (!deletedVariant) {
            res.status(404).json({ message: "Вариант не найден" });
            return;
        }

        res.status(201).json(deletedVariant)
    } catch(error) {
        console.error("deleteVariant controller failed:", error);
        res.status(500).json({ message: "Не удалось удалить характеристику товару из БД" });
    }
}