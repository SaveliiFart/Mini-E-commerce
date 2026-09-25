import type { Request, Response } from "express";
import * as productService from "../services/product.service.js";

export const getProducts = async (req: Request,res: Response) => {
    try{
        const products = await productService.getProducts();
        res.status(201).json(products)
    } catch (error){
        console.error("getProducts controller failed:", error);
        res.status(500).json({ message: "Не удалось взять товар из БД" });
    }
};

export const getActiveProducts = async (req: Request,res: Response) => {
    try{
        const activeProducts = await productService.getActiveProducts();
        res.status(201).json(activeProducts)
    } catch (error) {
        console.error("getActiveProducts controller failed:", error);
        res.status(500).json({ message: "Не удалось взять активный товар из БД" });
    }

};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, image_url, stock } = req.body;

        const createdProduct = await productService.createProduct(
            name,
            description,
            price,
            image_url,
            stock
        );

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("createProduct controller failed:", error);
        res.status(500).json({ message: "Не удалось создать товар" });
    }
};

