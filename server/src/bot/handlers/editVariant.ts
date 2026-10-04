import type { Conversation } from "@grammyjs/conversations";
import type { MyContext } from "../bot.js";
import * as variantService from "../../services/product-variants.service.js";

type MyConversation = Conversation<MyContext, MyContext>;

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

export const editVariant = async (
    conversation: MyConversation,
    ctx: MyContext,
    variantId: number
) => {
    const variant = await conversation.external(() => variantService.getVariant(variantId));

    if (!variant) {
        await ctx.reply("Вариант не найден — возможно, его уже удалили.");
        return;
    }

    const price = await waitForNumber(
        conversation, ctx,
        `${variant.color} / ${variant.size}. Текущая цена: ${variant.price} ₽. Введите новую цену:`,
        { min: 0.01 }
    );

    const stock = await waitForNumber(
        conversation, ctx,
        `Текущий остаток: ${variant.stock} шт. Введите новый остаток:`,
        { min: 0, integer: true }
    );

    const updated = await conversation.external(() =>
        variantService.updateVariant(variantId, variant.size, variant.color, variant.sku, price, stock)
    );

    if (!updated) {
        await ctx.reply("Не удалось обновить — вариант пропал во время редактирования.");
        return;
    }

    await ctx.reply(
        `✅ Обновлено: ${updated.color} / ${updated.size} — ${updated.price} ₽, остаток ${updated.stock} шт.`
    );
};