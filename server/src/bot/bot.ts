import { Bot, Context, InlineKeyboard  } from "grammy";
import {
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

import {
    getOrders,
    handleStatusUpdate,
} from "./handlers/orders.bot.js";

import {
    browseCategoriesInteractive,
    handleCategorySelect,
    handleBrandSelect,
    handleModelSelect,
    handleDeleteVariant,
    handleConfirmDeleteVariant,
    handleCancelDeleteVariant,
    handleDeleteProduct,
    handleConfirmDeleteProduct,
    handleCancelDeleteProduct,
    listCategoriesAsText,
} from "./handlers/inventory.bot.js";


// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface BotContext extends Context {
    admin?: User;
}

export type MyContext = ConversationFlavor<BotContext>;


// ─────────────────────────────────────────────
// Bot
// ─────────────────────────────────────────────

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error("BOT_TOKEN не задан в .env");
}

export const bot = new Bot<MyContext>(token);


// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

bot.use(isAdmin);
bot.use(conversations());


// ─────────────────────────────────────────────
// Conversations
// ─────────────────────────────────────────────

bot.use(createConversation(createCategory));
bot.use(createConversation(createProduct));
bot.use(createConversation(createVariant));
bot.use(createConversation(editVariant));


// ─────────────────────────────────────────────
// Keyboards
// ─────────────────────────────────────────────

const mainMenuKeyboard = () =>
    new InlineKeyboard()
        .text("📦 Товары", "admin:products")
        .text("🛒 Заказы", "admin:orders")
        .row()
        .text("📂 Категории", "admin:categories");


const productsMenuKeyboard = () =>
    new InlineKeyboard()
        .text("➕ Создать товар", "product:create")
        .row()
        .text("➕ Добавить вариант", "variant:create")
        .row()
        .text("📋 Список товаров", "product:list")
        .row()
        .text("⬅️ Назад", "admin:menu");


const categoriesMenuKeyboard = () =>
    new InlineKeyboard()
        .text("➕ Создать категорию", "category:create")
        .row()
        .text("📋 Список категорий", "category:list")
        .row()
        .text("⬅️ Назад", "admin:menu");


// ─────────────────────────────────────────────
// Main menu
// ─────────────────────────────────────────────

const showMainMenu = async (ctx: MyContext) => {
    await ctx.reply(
        `Привет, ${ctx.admin?.name}! 👋\n\n` +
        `Добро пожаловать в админ-панель магазина.\n\n` +
        `Выберите нужный раздел:`,
        {
            reply_markup: mainMenuKeyboard(),
        }
    );
};


// ─────────────────────────────────────────────
// /start
// ─────────────────────────────────────────────

bot.command("start", async (ctx) => {
    await showMainMenu(ctx);
});


// ─────────────────────────────────────────────
// Main menu callbacks
// ─────────────────────────────────────────────

bot.callbackQuery("admin:menu", async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.editMessageText(
        `Привет, ${ctx.admin?.name}! 👋\n\n` +
        `Админ-панель магазина.\n\n` +
        `Выберите нужный раздел:`,
        {
            reply_markup: mainMenuKeyboard(),
        }
    );
});


// ─────────────────────────────────────────────
// Products menu
// ─────────────────────────────────────────────

bot.callbackQuery("admin:products", async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.editMessageText(
        "📦 Управление товарами\n\nВыберите действие:",
        {
            reply_markup: productsMenuKeyboard(),
        }
    );
});


// Create product
bot.callbackQuery("product:create", async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.conversation.enter("createProduct");
});


// Create variant
bot.callbackQuery("variant:create", async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.conversation.enter("createVariant");
});


// Product list
bot.callbackQuery("product:list", async (ctx) => {
    await ctx.answerCallbackQuery();

    await browseCategoriesInteractive(ctx);
});

// ─────────────────────────────────────────────
// Categories menu
// ─────────────────────────────────────────────

bot.callbackQuery("admin:categories", async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.editMessageText(
        "📂 Управление категориями\n\nВыберите действие:",
        {
            reply_markup: categoriesMenuKeyboard(),
        }
    );
});


// Create category
bot.callbackQuery("category:create", async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.conversation.enter("createCategory");
});


// Category list
bot.callbackQuery("category:list", async (ctx) => {
    await ctx.answerCallbackQuery();

    await listCategoriesAsText(ctx);
});


// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────

bot.callbackQuery("admin:orders", async (ctx) => {
    await ctx.answerCallbackQuery();

    await getOrders(ctx);
});


// ─────────────────────────────────────────────
// Legacy commands
// Можно оставить для удобства /cancel
// ─────────────────────────────────────────────

bot.command("orders", getOrders);

bot.command("products", browseCategoriesInteractive);

bot.command("createCategory", async (ctx) => {
    await ctx.conversation.enter("createCategory");
});

bot.command("createProduct", async (ctx) => {
    await ctx.conversation.enter("createProduct");
});

bot.command("createVariant", async (ctx) => {
    await ctx.conversation.enter("createVariant");
});


// Cancel current conversation
bot.command("cancel", async (ctx) => {
    await ctx.conversation.exitAll();

    await ctx.reply(
        "❌ Текущий диалог отменён.",
        {
            reply_markup: mainMenuKeyboard(),
        }
    );
});


// ─────────────────────────────────────────────
// Orders callbacks
// ─────────────────────────────────────────────

bot.callbackQuery(
    /^status:(\d+):(\w+)$/,
    handleStatusUpdate
);


// ─────────────────────────────────────────────
// Inventory callbacks
// ─────────────────────────────────────────────

bot.callbackQuery(
    /^category:(\d+)$/,
    handleCategorySelect
);

bot.callbackQuery(
    /^brand:(\d+):(.+)$/,
    handleBrandSelect
);

bot.callbackQuery(
    /^model:(\d+):([^:]+):(.+)$/,
    handleModelSelect
);


// ─────────────────────────────────────────────
// Delete variant
// ─────────────────────────────────────────────

bot.callbackQuery(
    /^delete-variant:(\d+)$/,
    handleDeleteVariant
);

bot.callbackQuery(
    /^confirm-delete-variant:(\d+)$/,
    handleConfirmDeleteVariant
);

bot.callbackQuery(
    /^cancel-delete-variant:(\d+)$/,
    handleCancelDeleteVariant
);


// ─────────────────────────────────────────────
// Delete product
// ─────────────────────────────────────────────

bot.callbackQuery(
    /^delete-product:(\d+)$/,
    handleDeleteProduct
);

bot.callbackQuery(
    /^confirm-delete-product:(\d+)$/,
    handleConfirmDeleteProduct
);

bot.callbackQuery(
    /^cancel-delete-product:(\d+)$/,
    handleCancelDeleteProduct
);


// ─────────────────────────────────────────────
// Edit variant
// ─────────────────────────────────────────────

bot.callbackQuery(
    /^edit-variant:(\d+)$/,
    async (ctx) => {
        const variantId = Number(ctx.match[1]);

        await ctx.answerCallbackQuery();

        await ctx.conversation.enter(
            "editVariant",
            variantId
        );
    }
);


// ─────────────────────────────────────────────
// Error handling
// ─────────────────────────────────────────────

bot.catch((err) => {
    console.error("Bot error:", err);
});


// ─────────────────────────────────────────────
// Start bot
// ─────────────────────────────────────────────

export const startBot = () => {
    bot.start();

    console.log("Telegram bot started (long polling)");
};
