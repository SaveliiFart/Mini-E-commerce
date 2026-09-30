import { z } from "zod";

export const createVariantSchema = z.object({
    product_id: z.number().int().positive(),
    size: z.string().min(1, "Размер не может быть пустым").max(50),
    color: z.string().min(1, "Цвет не может быть пустым").max(50),
    sku: z.string().min(1, "Артикул не может быть пустым").max(64),
    price: z.number().positive("Цена должна быть больше 0"),
    stock: z.number().int().nonnegative("Остаток не может быть отрицательным"),
});

export const updateVariantSchema = createVariantSchema.omit({ product_id: true });

export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;