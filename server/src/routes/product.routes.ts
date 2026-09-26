import { Router } from "express";
import { validateBody } from "../middleware/validate.middleware.js";
import { getProducts, getActiveProducts, createProduct, updateProduct, deleteProduct, getProduct } from "../controllers/product.controller.js";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema.js";

const router = Router();

router.get("/", getProducts);
router.get("/active", getActiveProducts);
router.post("/", validateBody(createProductSchema), createProduct);
router.put("/:id", validateBody(updateProductSchema), updateProduct)
router.delete("/:id", deleteProduct)
router.get("/:id", getProduct)

export default router;