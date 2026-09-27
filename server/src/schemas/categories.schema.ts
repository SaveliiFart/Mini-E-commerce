import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, "Название не может быть пустым").max(255),
});

export const updateCategorySchema = createCategorySchema;

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;