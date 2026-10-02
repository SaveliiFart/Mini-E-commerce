import type { NextFunction } from "grammy";
import type { MyContext } from "../bot.js";
import * as userService from "../../services/users.service.js";

export const isAdmin = async (ctx: MyContext, next: NextFunction) => {
    if (!ctx.from) {
        return;
    }

    const telegram_id = String(ctx.from.id);
    const user = await userService.getUserByTelegramId(telegram_id);

    if (!user || user.role !== "admin") {
        return;
    }

    ctx.admin = user;
    await next();
};