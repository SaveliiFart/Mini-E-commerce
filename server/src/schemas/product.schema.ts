import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Название не может быть пустым").max(255),
    description: z.string().nullable(),
    image_url: z.string().url("Некорректный URL картинки").nullable(),
    category_id: z.number().int().nullable(),
});

export const updateProductSchema = createProductSchema;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;