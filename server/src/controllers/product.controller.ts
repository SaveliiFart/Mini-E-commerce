import type { Request, Response } from "express";
import * as productService from "../services/product.service.js";

export const getProducts = async (req: Request,res: Response) => {
    try{
        const products = await productService.getProducts();
        res.status(200).json(products)
    } catch (error){
        console.error("getProducts controller failed:", error);
        res.status(500).json({ message: "Не удалось взять товар из БД" });
    }
};

export const getActiveProducts = async (req: Request,res: Response) => {
    try{
        const activeProducts = await productService.getActiveProducts();
        res.status(200).json(activeProducts)
    } catch (error) {
        console.error("getActiveProducts controller failed:", error);
        res.status(500).json({ message: "Не удалось взять активный товар из БД" });
    }

};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { model, brand, description, image_url, category_id } = req.body;

        const createdProduct = await productService.createProduct(
            model,
            brand,
            description,
            image_url,
            category_id
        );

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("createProduct controller failed:", error);
        res.status(500).json({ message: "Не удалось создать товар" });
    }
};

export const updateProduct = async(req: Request, res: Response) => {
    try{
        const id = Number(req.params.id)
        const {model,brand, description, image_url, category_id } = req.body;

        const updatedProduct = await productService.updateProduct(
            id, model,brand, description, image_url, category_id
        )

        if (!updatedProduct) {
            res.status(404).json({ message: "Товар не найден" });
            return;
        }

        res.status(200).json(updatedProduct)
    } catch(error) {
        console.error("updatedProduct controller failed:", error);
        res.status(500).json({ message: "Не удалось обновить товар" });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const deletedProduct = await productService.deleteProduct(id);

        if (!deletedProduct) {
            res.status(404).json({ message: "Товар не найден" });
            return;
        }

        res.status(200).json(deletedProduct);
    } catch (error) {
        console.error("deleteProduct controller failed:", error);
        res.status(500).json({ message: "Не удалось удалить товар" });
    }
};

export const getProduct = async(req: Request, res: Response) => {
    try{
        const id = Number(req.params.id)

        if (isNaN(id)) {
            res.status(400).json({ message: "Некорректный id" });
            return;
        }

        const product = await productService.getProduct(id);

        if (!product) {
            res.status(404).json({ message: "Товар не найден" });
            return;
        }

        res.status(200).json(product)
    } catch(error) {
        console.error("getProduct controller failed:", error);
        res.status(500).json({ message: "Не удалось получить информацию о товаре" });
    }
}