import { Router } from "express";
import { validateBody } from "../middleware/validate.middleware.js";
import { findOrCreateUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { findOrCreateUser, getUser, getUserByTelegramId, getUsers, updateUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/telegram/:telegram_id", getUserByTelegramId);
router.get("/:id", getUser);
router.post("/", validateBody(findOrCreateUserSchema), findOrCreateUser);
router.put("/:id", validateBody(updateUserSchema), updateUser);

export default router;