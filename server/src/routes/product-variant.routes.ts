import { Router } from "express";
import { validateBody } from "../middleware/validate.middleware.js";
import { createVariant, deleteVariant, getVariant, getVariants, updateVariant } from "../controllers/product-variant.controller.js";
import { createVariantSchema, updateVariantSchema } from "../schemas/product-variant.schema.js";


const router = Router();

router.get("/product/:product_id", getVariants);
router.get("/:id", getVariant);
router.post("/", validateBody(createVariantSchema), createVariant)
router.delete("/:id", deleteVariant)
router.put("/:id", validateBody(updateVariantSchema), updateVariant)

export default router;