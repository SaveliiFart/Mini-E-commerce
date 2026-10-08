import { Router } from "express";
import { validateBody } from "../middleware/validate.middleware.js";
import { getCategories, getActiveCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { createCategorySchema, updateCategorySchema } from "../schemas/categories.schema.js";

const router = Router();

router.get("/", getCategories);
router.get("/active", getActiveCategories);
router.post("/", validateBody(createCategorySchema), createCategory);
router.put("/:id", validateBody(updateCategorySchema), updateCategory)
router.delete("/:id", deleteCategory)
router.get("/:id", getCategory)

export default router;