import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Название не может быть пустым").max(255),
    description: z.string().nullable(),
    price: z.number().positive("Цена должна быть больше 0"),
    image_url: z.string().url("Некорректный URL картинки").nullable(),
    stock: z.number().int().nonnegative("Остаток не может быть отрицательным"),
});

export const updateProductSchema = createProductSchema;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;