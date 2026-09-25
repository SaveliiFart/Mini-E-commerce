import { Router } from "express";
import { getProducts, getActiveProducts, createProduct } from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/active", getActiveProducts);
router.post("/", createProduct);

export default router;