import { z } from "zod";

export const createOrderItemSchema = z.object({
    variant_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
    delivery_address: z.string().min(1, "Адрес доставки обязателен"),
    phone: z.string().min(1, "Телефон обязателен"),
    telegram_username: z.string().nullable().optional(),
    comment: z.string().nullable().optional(),
    items: z.array(createOrderItemSchema).min(1, "В заказе должен быть хотя бы один товар"),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;