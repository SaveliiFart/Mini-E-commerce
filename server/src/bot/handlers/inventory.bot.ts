import { InlineKeyboard } from "grammy";
import type { MyContext } from "../bot.js";

import * as productInventoryService from "../../services/productInventory.service.js";
import * as productService from "../../services/product.service.js";
import * as categoryService from "../../services/category.service.js";
import * as variantService from "../../services/product-variant.service.js";


// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export const listCategoriesAsText = async (ctx: MyContext) => {
    const categoriesList = await categoryService.getCategories();

    if (categoriesList.length === 0) {
        await ctx.reply("Категорий нет.");
        return;
    }

    const keyboard = new InlineKeyboard()

    keyboard.text("⬅️ Назад", "admin:menu")

    await ctx.reply(
        `📂 Список категорий:\n\n` +
        categoriesList.map((c) => `• ${c.name}`).join("\n")
    , {reply_markup: keyboard});
};


// ─────────────────────────────────────────────
// Category list
// ─────────────────────────────────────────────

export const browseCategoriesInteractive = async (ctx: MyContext) => {
    const categoryList = await categoryService.getCategories();

    if (categoryList.length === 0) {
        await ctx.reply("Категорий нет.");
        return;
    }

    const keyboard = new InlineKeyboard();

    for (const category of categoryList) {
        keyboard
            .text(category.name, `category:${category.id}`)
            .row();
    }

    keyboard.text("⬅️ Назад", "admin:menu");

    await ctx.reply(
        "📂 Выберите категорию:",
        {
            reply_markup: keyboard,
        }
    );
};


// ─────────────────────────────────────────────
// Category → Brands
// ─────────────────────────────────────────────

export const handleCategorySelect = async (ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;
    const categoryId = Number(match[1]);

    const brands =
        await productInventoryService.getBrandsByCategory(categoryId);

    if (brands.length === 0) {
        await ctx.answerCallbackQuery();

        await ctx.editMessageText(
            "В этой категории пока нет товаров.",
            {
                reply_markup: new InlineKeyboard()
                    .text("⬅️ Назад", "product:list"),
            }
        );

        return;
    }

    const keyboard = new InlineKeyboard();

    for (const brand of brands) {
        keyboard
            .text(
                brand,
                `brand:${categoryId}:${encodeURIComponent(brand)}`
            )
            .row();
    }

    keyboard.text("⬅️ Назад", "product:list");

    await ctx.answerCallbackQuery();

    await ctx.editMessageText(
        "🏷 Выберите бренд:",
        {
            reply_markup: keyboard,
        }
    );
};


// ─────────────────────────────────────────────
// Brand → Models
// ─────────────────────────────────────────────

export const handleBrandSelect = async (ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;

    const categoryId = Number(match[1]);
    const brand = decodeURIComponent(match[2]);

    const models =
        await productInventoryService.getModelsByBrand(
            categoryId,
            brand
        );

    if (models.length === 0) {
        await ctx.answerCallbackQuery();

        await ctx.editMessageText(
            `У бренда ${brand} пока нет моделей в этой категории.`,
            {
                reply_markup: new InlineKeyboard()
                    .text(
                        "⬅️ Назад",
                        `category:${categoryId}`
                    ),
            }
        );

        return;
    }

    const keyboard = new InlineKeyboard();

    for (const opt of models) {
        keyboard
            .text(
                opt.model,
                `model:${categoryId}:${encodeURIComponent(brand)}:${encodeURIComponent(opt.model)}`
            )
            .text(
                "🗑",
                `delete-product:${opt.id}`
            )
            .row();
    }

    keyboard.text(
        "⬅️ Назад",
        `category:${categoryId}`
    );

    await ctx.answerCallbackQuery();

    await ctx.editMessageText(
        `${brand} — выберите модель:`,
        {
            reply_markup: keyboard,
        }
    );
};


// ─────────────────────────────────────────────
// Model → Variants
// ─────────────────────────────────────────────

export const handleModelSelect = async (ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;

    const categoryId = Number(match[1]);
    const brand = decodeURIComponent(match[2]);
    const model = decodeURIComponent(match[3]);

    const product =
        await productInventoryService.getProductByBrandModel(
            categoryId,
            brand,
            model
        );

    if (!product) {
        await ctx.answerCallbackQuery({
            text: "Товар не найден",
            show_alert: true,
        });

        return;
    }

    const variants =
        await variantService.getVariants(product.id);

    const keyboard = new InlineKeyboard();

    if (variants.length > 0) {
        for (const v of variants) {
            keyboard
                .text(
                    `✏️ ${v.color}/${v.size}`,
                    `edit-variant:${v.id}`
                )
                .text(
                    "🗑",
                    `delete-variant:${v.id}`
                )
                .row();
        }
    }

    keyboard.text(
        "⬅️ Назад",
        `brand:${categoryId}:${encodeURIComponent(brand)}`
    );

    await ctx.answerCallbackQuery();

    if (variants.length === 0) {
        await ctx.editMessageText(
            `${brand} ${model}\n\n` +
            `Вариантов пока нет.`,
            {
                reply_markup: keyboard,
            }
        );

        return;
    }

    const variantsText = variants
        .map(
            (v) =>
                `• ${v.color}, размер ${v.size}: ` +
                `${v.stock} шт. (${v.price} ₽)`
        )
        .join("\n");

    await ctx.editMessageText(
        `${brand} ${model}\n\n${variantsText}`,
        {
            reply_markup: keyboard,
        }
    );
};


// ─────────────────────────────────────────────
// Back → Products
// ─────────────────────────────────────────────

export const handleBackToProducts = async (ctx: MyContext) => {
    await ctx.answerCallbackQuery();

    await browseCategoriesInteractive(ctx);
};


// ─────────────────────────────────────────────
// Delete variant
// ─────────────────────────────────────────────

export const handleDeleteVariant = async (ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;
    const variantId = Number(match[1]);

    const variant =
        await variantService.getVariant(variantId);

    if (!variant) {
        await ctx.answerCallbackQuery({
            text: "Вариант не найден",
            show_alert: true,
        });

        return;
    }

    await ctx.answerCallbackQuery();

    const confirmKeyboard = new InlineKeyboard()
        .text(
            "✅ Да, удалить",
            `confirm-delete-variant:${variantId}`
        )
        .row()
        .text(
            "❌ Отмена",
            `cancel-delete-variant:${variantId}`
        );

    await ctx.editMessageText(
        `⚠️ Удалить вариант?\n\n` +
        `Цвет: ${variant.color}\n` +
        `Размер: ${variant.size}\n` +
        `Остаток: ${variant.stock} шт.\n` +
        `SKU: ${variant.sku}`,
        {
            reply_markup: confirmKeyboard,
        }
    );
};


// ─────────────────────────────────────────────
// Confirm delete variant
// ─────────────────────────────────────────────

export const handleConfirmDeleteVariant = async (
    ctx: MyContext
) => {
    const match = ctx.match as RegExpMatchArray;
    const variantId = Number(match[1]);

    const deleted =
        await variantService.deleteVariant(variantId);

    if (!deleted) {
        await ctx.answerCallbackQuery({
            text: "Вариант не найден",
            show_alert: true,
        });

        return;
    }

    await ctx.answerCallbackQuery("Вариант удалён");

    await ctx.editMessageText(
        `🗑 Вариант удалён\n\n` +
        `${deleted.color} / ${deleted.size}`,
        {
            reply_markup: new InlineKeyboard()
                .text(
                    "⬅️ Назад к товарам",
                    "product:list"
                ),
        }
    );
};


// ─────────────────────────────────────────────
// Cancel delete variant
// ─────────────────────────────────────────────

export const handleCancelDeleteVariant = async (
    ctx: MyContext
) => {
    await ctx.answerCallbackQuery("Удаление отменено");

    await ctx.editMessageText(
        "❌ Удаление отменено.",
        {
            reply_markup: new InlineKeyboard()
                .text(
                    "⬅️ К товарам",
                    "product:list"
                ),
        }
    );
};


// ─────────────────────────────────────────────
// Delete product
// ─────────────────────────────────────────────

export const handleDeleteProduct = async (ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;
    const productId = Number(match[1]);

    const product =
        await productService.getProduct(productId);

    if (!product) {
        await ctx.answerCallbackQuery({
            text: "Товар не найден",
            show_alert: true,
        });

        return;
    }

    await ctx.answerCallbackQuery();

    const confirmKeyboard = new InlineKeyboard()
        .text(
            "✅ Да, удалить",
            `confirm-delete-product:${productId}`
        )
        .row()
        .text(
            "❌ Отмена",
            `cancel-delete-product:${productId}`
        );

    await ctx.editMessageText(
        `⚠️ Удалить товар?\n\n` +
        `${product.brand} ${product.model}\n\n` +
        `Все его варианты также могут быть удалены.`,
        {
            reply_markup: confirmKeyboard,
        }
    );
};


// ─────────────────────────────────────────────
// Confirm delete product
// ─────────────────────────────────────────────

export const handleConfirmDeleteProduct = async (
    ctx: MyContext
) => {
    const match = ctx.match as RegExpMatchArray;
    const productId = Number(match[1]);

    const deleted =
        await productService.deleteProduct(productId);

    if (!deleted) {
        await ctx.answerCallbackQuery({
            text: "Товар не найден",
            show_alert: true,
        });

        return;
    }

    await ctx.answerCallbackQuery("Товар удалён");

    await ctx.editMessageText(
        `🗑 Товар удалён\n\n` +
        `${deleted.brand} ${deleted.model}`,
        {
            reply_markup: new InlineKeyboard()
                .text(
                    "⬅️ Назад к товарам",
                    "product:list"
                ),
        }
    );
};


// ─────────────────────────────────────────────
// Cancel delete product
// ─────────────────────────────────────────────

export const handleCancelDeleteProduct = async (
    ctx: MyContext
) => {
    await ctx.answerCallbackQuery("Удаление отменено");

    await ctx.editMessageText(
        "❌ Удаление отменено.",
        {
            reply_markup: new InlineKeyboard()
                .text(
                    "⬅️ К товарам",
                    "product:list"
                ),
        }
    );
};