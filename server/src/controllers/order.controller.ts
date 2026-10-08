import type { Request, Response } from "express";
import * as orderService from "../services/order.service.js";
import { notifyAdminsNewOrder } from "../bot/notifications.js";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const created = await orderService.createOrder(req.body);
        res.status(201).json(created);
        notifyAdminsNewOrder(created).catch((error) => {
            console.error("notifyAdminsNewOrder failed:", error);
        });
    } catch (error) {
        console.error("createOrder controller failed:", error);
        if (error instanceof orderService.OrderValidationError) {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Не удалось создать заказ" });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await orderService.getOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error("getOrders controller failed:", error);
        res.status(500).json({ message: "Не удалось получить список заказов" });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: "Некорректный id" });
            return;
        }

        const result = await orderService.getOrder(id);

        if (!result) {
            res.status(404).json({ message: "Заказ не найден" });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("getOrder controller failed:", error);
        res.status(500).json({ message: "Не удалось получить заказ" });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: "Некорректный id" });
            return;
        }

        const { status } = req.body;

        const updatedOrder = await orderService.updateOrderStatus(id, status);

        if (!updatedOrder) {
            res.status(404).json({ message: "Заказ не найден" });
            return;
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("updateOrderStatus controller failed:", error);
        res.status(500).json({ message: "Не удалось обновить статус заказа" });
    }
};