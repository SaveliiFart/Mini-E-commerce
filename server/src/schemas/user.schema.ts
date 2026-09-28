import { z } from "zod";

export const findOrCreateUserSchema = z.object({
    telegram_id: z.string().min(1, "telegram_id обязателен"),
    name: z.string().min(1, "Имя не может быть пустым").max(255),
    phone: z.string().nullable().optional(),
    role: z.enum(["customer", "admin"]).optional(), // если не прислали — сервис подставит "customer" по умолчанию
});

export const updateUserSchema = z.object({
    telegram_id: z.string().min(1, "telegram_id обязателен"),
    name: z.string().min(1, "Имя не может быть пустым").max(255),
    phone: z.string().nullable(),
});

export type FindOrCreateUserInput = z.infer<typeof findOrCreateUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;