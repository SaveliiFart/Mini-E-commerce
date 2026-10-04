import { Bot, Context } from "grammy";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
} from "@grammyjs/conversations";
import type { User } from "../types/user.types.js";
import { isAdmin } from "./middleware/isAdmin.middleware.js";
import { createCategory } from "./handlers/createCategory.js";
import { createProduct } from "./handlers/createProduct.js";
import { createVariant } from "./handlers/createVariant.js";
import { editVariant } from "./handlers/editVariant.js";

export interface BotContext extends Context {
    admin?: User;
}
export type MyContext = ConversationFlavor<BotContext>;

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error("BOT_TOKEN не задан в .env");
}

export const bot = new Bot<MyContext>(token);

bot.use(isAdmin);
bot.use(conversations());
bot.use(createConversation(createCategory));
bot.use(createConversation(createProduct));
bot.use(createConversation(createVariant));
bot.use(createConversation(editVariant));

import { getOrders, handleStatusUpdate } from "./handlers/orders.bot.js";
import {getCategory,handleCategorySelect,handleBrandSelect,handleModelSelect, handleDeleteVariant, handleConfirmDeleteVariant, handleCancelDeleteVariant,} from "./handlers/inventory.bot.js";


bot.command("start", async (ctx) => {
    await ctx.reply(
        `Привет, ${ctx.admin?.name}! Это админ-панель магазина.\n\n` +
        `Доступные команды:\n` +
        `/orders — новые заказы\n` +
        `/products — список товаров`
    );
});

bot.command("orders", getOrders);
bot.command("products", getCategory)
bot.command("createCategory", async (ctx) => {
    await ctx.conversation.enter("createCategory");
});
bot.command("createProduct", async (ctx) => {
    await ctx.conversation.enter("createProduct");
});
bot.command("createVariant", async (ctx) => {
    await ctx.conversation.enter("createVariant");
});

bot.command("cancel", async (ctx) => {
    await ctx.conversation.exitAll();
    await ctx.reply("Диалог отменён.");
});

bot.callbackQuery(/^status:(\d+):(\w+)$/, handleStatusUpdate);
bot.callbackQuery(/^category:(\d+)$/, handleCategorySelect);
bot.callbackQuery(/^brand:(\d+):(.+)$/, handleBrandSelect);
bot.callbackQuery(/^model:(\d+):([^:]+):(.+)$/, handleModelSelect);
bot.callbackQuery(/^delete-variant:(\d+)$/, handleDeleteVariant);
bot.callbackQuery(/^confirm-delete-variant:(\d+)$/, handleConfirmDeleteVariant);
bot.callbackQuery(/^cancel-delete-variant:(\d+)$/, handleCancelDeleteVariant);

bot.callbackQuery(/^edit-variant:(\d+)$/, async (ctx) => {
    const variantId = Number(ctx.match[1]);
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter("editVariant", variantId);
});

bot.catch((err) => {
    console.error("Bot error:", err);
});

export const startBot = () => {
    bot.start();
    console.log("Telegram bot started (long polling)");
};