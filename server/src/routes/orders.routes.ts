import { Router } from "express";
import { validateBody } from "../middleware/validate.middleware.js";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/order.schema.js";
import { createOrder, getOrder, getOrders, updateOrderStatus } from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrder);
router.post("/", validateBody(createOrderSchema), createOrder);
router.patch("/:id/status", validateBody(updateOrderStatusSchema), updateOrderStatus);

export default router;