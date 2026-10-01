import { Bot, Context } from "grammy";
import type { User } from "../types/user.types.js";
import { isAdmin } from "./middleware/isAdmin.middleware.js";

export interface BotContext extends Context {
    admin?: User;
}

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error("BOT_TOKEN не задан в .env");
}

export const bot = new Bot<BotContext>(token);

bot.use(isAdmin);

import { getOrders, handleStatusUpdate } from "./handlers/orders.bot.js";

bot.command("start", async (ctx) => {
    await ctx.reply(
        `Привет, ${ctx.admin?.name}! Это админ-панель магазина.\n\n` +
        `Доступные команды:\n` +
        `/orders — новые заказы\n` +
        `/products — список товаров`
    );
});

bot.command("orders", getOrders);

bot.callbackQuery(/^status:(\d+):(\w+)$/, handleStatusUpdate);

bot.catch((err) => {
    console.error("Bot error:", err);
});

export const startBot = () => {
    bot.start();
    console.log("Telegram bot started (long polling)");
};