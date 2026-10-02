import { InlineKeyboard } from "grammy";
import type { Conversation } from "@grammyjs/conversations";
import type { MyContext } from "../bot.js";
import * as categoryService from "../../services/categories.service.js";
import { createProductWithVariant } from "../../services/Createproductwithvariant.service.js";

type MyConversation = Conversation<MyContext, MyContext>;

// Текст, который обязателен — повторяет вопрос, пока не придёт непустой ответ
const waitForRequiredText = async (
    conversation: MyConversation,
    ctx: MyContext,
    prompt: string
): Promise<string> => {
    while (true) {
        await ctx.reply(prompt);
        const next = await conversation.waitFor("message:text");
        const text = next.message.text.trim();

        if (text.length > 0) {
            return text;
        }

        await ctx.reply("Значение не может быть пустым, попробуй ещё раз.");
    }
};

// Текст, который можно пропустить, прислав "-"
const waitForOptionalText = async (
    conversation: MyConversation,
    ctx: MyContext,
    prompt: string
): Promise<string | null> => {
    await ctx.reply(`${prompt} (или "-", чтобы пропустить)`);
    const next = await conversation.waitFor("message:text");
    const text = next.message.text.trim();

    return text === "-" ? null : text;
};

// Число с проверкой — повторяет вопрос, пока не придёт валидное значение
const waitForNumber = async (
    conversation: MyConversation,
    ctx: MyContext,
    prompt: string,
    options: { min?: number; integer?: boolean } = {}
): Promise<number> => {
    while (true) {
        await ctx.reply(prompt);
        const next = await conversation.waitFor("message:text");
        const value = Number(next.message.text);

        const isValid =
            !isNaN(value) &&
            (options.min === undefined || value >= options.min) &&
            (!options.integer || Number.isInteger(value));

        if (isValid) {
            return value;
        }

        await ctx.reply("Некорректное значение, попробуй ещё раз.");
    }
};

export const createProduct = async (conversation: MyConversation, ctx: MyContext) => {
    const categories = await conversation.external(() => categoryService.getCategories());

    if (categories.length === 0) {
        await ctx.reply("Сначала нужно создать хотя бы одну категорию (/createCategory).");
        return;
    }

    const keyboard = new InlineKeyboard();
    for (const category of categories) {
        keyboard.text(category.name, `category:${category.id}`).row();
    }

    await ctx.reply("Выберите категорию:", { reply_markup: keyboard });

    const categoryCtx = await conversation.waitForCallbackQuery(/^category:(\d+)$/);
    await categoryCtx.answerCallbackQuery();
    const category_id = Number(categoryCtx.match[1]);

    const brand = await waitForRequiredText(conversation, ctx, "Введите бренд:");
    const model = await waitForRequiredText(conversation, ctx, "Введите модель:");
    const description = await waitForOptionalText(conversation, ctx, "Введите описание:");
    const image_url = await waitForOptionalText(conversation, ctx, "Введите ссылку на картинку:");
    const color = await waitForRequiredText(conversation, ctx, "Введите цвет:");
    const size = await waitForRequiredText(conversation, ctx, "Введите размер:");
    const sku = await waitForRequiredText(conversation, ctx, "Введите артикул (SKU):");
    const price = await waitForNumber(conversation, ctx, "Введите цену:", { min: 0.01 });
    const stock = await waitForNumber(conversation, ctx, "Введите остаток на складе:", { min: 0, integer: true });

    const created = await conversation.external(() =>
        createProductWithVariant({
            category_id, brand, model, description, image_url,
            color, size, sku, price, stock,
        })
    );

    await ctx.reply(
        `✅ Товар создан!\n${brand} ${model}, вариант: ${color} / ${size}\n` +
        `Товар #${created.product_id}, вариант #${created.variant_id}`
    );
};