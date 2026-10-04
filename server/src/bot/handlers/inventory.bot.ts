import { InlineKeyboard } from "grammy";
import type { MyContext } from "../bot.js";
import * as productService from "../../services/productInventory.service.js"
import * as categoryService from "../../services/categories.service.js"
import * as variantService from "../../services/product-variants.service.js"

export const getCategory = async(ctx: MyContext) => {
    const categoryList = await categoryService.getCategories()

    if(categoryList.length === 0) {
        await ctx.reply("Категорий нет.")
        return;
    }

    const keyboard = new InlineKeyboard();
    for (const category of categoryList) {
        keyboard.text(category.name, `category:${category.id}`).row();
    }

    await ctx.reply("Выберите категорию:", { reply_markup: keyboard });
}

export const handleCategorySelect = async(ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;
    const categoryId = Number(match[1]);

    const brands = await productService.getBrandsByCategory(categoryId)

    if(brands.length === 0) {
        await ctx.editMessageText("В этой категории пока нет товаров.");
        return;
    }

    const keyboard = new InlineKeyboard() 
    for(const brand of brands) {
        keyboard.text(brand, `brand:${categoryId}:${encodeURIComponent(brand)}`).row();
    }

    await ctx.editMessageText(`Выберите бренд:`, {reply_markup: keyboard})
}

export const handleBrandSelect = async(ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray
    const category_id = Number(match[1]);
    const brand = decodeURIComponent(match[2])

    const models = await productService.getModelsByBrand(category_id,brand)

    if(models.length === 0) {
        await ctx.editMessageText(`У бренда ${brand} пока нет моделей в этой категории.`);
        return;
    }

    const keyboard = new InlineKeyboard();

    for( const model of models ) {
        keyboard.text(model, `model:${category_id}:${encodeURIComponent(brand)}:${encodeURIComponent(model)}`).row();
    }

    await ctx.editMessageText(`${brand} — выберите модель:`, { reply_markup: keyboard });
}

export const handleModelSelect = async (ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;
    const categoryId = Number(match[1]);
    const brand = decodeURIComponent(match[2]);
    const model = decodeURIComponent(match[3]);

    const product = await productService.getProductByBrandModel(categoryId, brand, model);

    if (!product) {
        await ctx.editMessageText("Товар не найден.");
        return;
    }

    const variants = await variantService.getVariants(product.id);

    if (variants.length === 0) {
        await ctx.editMessageText(`${brand} ${model} — вариантов пока нет.`);
        return;
    }

    const variantsText = variants
        .map((v) => `  • ${v.color}, размер ${v.size}: ${v.stock} шт. (${v.price} ₽)`)
        .join("\n");

    const keyboard = new InlineKeyboard();
    for (const v of variants) {
        keyboard
            .text(`✏️ ${v.color}/${v.size}`, `edit-variant:${v.id}`)
            .text("🗑", `delete-variant:${v.id}`)
            .row();
    }

    await ctx.editMessageText(`${brand} ${model}\n\n${variantsText}`, {reply_markup: keyboard});
};

export const handleDeleteVariant = async (ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;
    const variantId = Number(match[1]);

    const variant = await variantService.getVariant(variantId);

    if (!variant) {
        await ctx.answerCallbackQuery({ text: "Вариант не найден", show_alert: true });
        return;
    }

    await ctx.answerCallbackQuery();

    const confirmKeyboard = new InlineKeyboard()
        .text("✅ Да, удалить", `confirm-delete-variant:${variantId}`)
        .text("❌ Отмена", `cancel-delete-variant:${variantId}`);

    await ctx.editMessageText(
        `Удалить вариант ${variant.color} / ${variant.size} (остаток ${variant.stock} шт.)?`,
        { reply_markup: confirmKeyboard }
    );
};

export const handleConfirmDeleteVariant = async (ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;
    const variantId = Number(match[1]);

    const deleted = await variantService.deleteVariant(variantId);

    if (!deleted) {
        await ctx.answerCallbackQuery({ text: "Вариант не найден", show_alert: true });
        return;
    }

    await ctx.answerCallbackQuery("Вариант удалён");
    await ctx.editMessageText(`🗑 Вариант удалён: ${deleted.color} / ${deleted.size}`);
};

export const handleCancelDeleteVariant = async (ctx: MyContext) => {
    await ctx.answerCallbackQuery("Отменено");
    await ctx.editMessageText("Удаление отменено. Чтобы вернуться к списку — набери /products ещё раз.");
};