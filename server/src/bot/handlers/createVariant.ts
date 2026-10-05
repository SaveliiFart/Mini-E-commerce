import { InlineKeyboard } from "grammy";
import type { Conversation } from "@grammyjs/conversations";
import type { MyContext } from "../bot.js";
import * as productService from "../../services/productInventory.service.js"
import * as categoryService from "../../services/categories.service.js";


type MyConversation = Conversation<MyContext, MyContext>;

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

export const createVariant = async(conversation: MyConversation, ctx: MyContext) => {
    const categories = await conversation.external(() => categoryService.getCategories());

    if (categories.length === 0) {
        await ctx.reply("Сначала нужно создать хотя бы одну категорию (/createCategory).");
        return;
    }

    const keyboard = new InlineKeyboard()
    for (const category of categories) {
        keyboard.text(category.name, `category:${category.id}`).row();
    }

    await ctx.reply("Выберите категорию:", { reply_markup: keyboard });


    const categoryCtx = await conversation.waitForCallbackQuery(/^category:(\d+)$/);
    await categoryCtx.answerCallbackQuery();
    const category_id = Number(categoryCtx.match[1]);

    const brands = await conversation.external(() => productService.getBrandsByCategory(category_id))

    if(brands.length === 0) {
        await ctx.reply("В этой категории пока нет товаров — сначала создай товар через /createProduct.");
        return;
    }
    
    const brandKeyboard = new InlineKeyboard()
    for(const brand of brands){
        brandKeyboard.text(brand, `brand:${category_id}:${encodeURIComponent(brand)}`).row();
    }

    await ctx.reply("Выберите бренд:", { reply_markup: brandKeyboard });

    const brandCtx = await conversation.waitForCallbackQuery(/^brand:(\d+):(.+)$/)
    await brandCtx.answerCallbackQuery()
    const brand = decodeURIComponent(brandCtx.match[2]);

    const models = await conversation.external(() => productService.getModelsByBrand(category_id,brand))

    if(models.length === 0) {
        await ctx.reply(`У бренда ${brand} пока нет моделей в этой категории.`);
        return;
    }

    const modelsKeyboard = new InlineKeyboard()
    for(const opt of models){
        modelsKeyboard.text(opt.model, `model:${category_id}:${encodeURIComponent(brand)}:${encodeURIComponent(opt.model)}`).row();
    }

    await ctx.reply("Выберите модель:", { reply_markup: modelsKeyboard });


    const modelCtx = await conversation.waitForCallbackQuery(/^model:(\d+):([^:]+):(.+)$/)
    await modelCtx.answerCallbackQuery()
    const model = decodeURIComponent(modelCtx.match[3]);


    const color = await waitForRequiredText(conversation, ctx, "Введите цвет:");
    const size = await waitForRequiredText(conversation, ctx, "Введите размер:");
    const sku = await waitForRequiredText(conversation, ctx, "Введите артикул (SKU):");
    const price = await waitForNumber(conversation, ctx, "Введите цену:", { min: 0.01 });
    const stock = await waitForNumber(conversation, ctx, "Введите остаток на складе:", { min: 0, integer: true });

    await conversation.external(() =>
        productService.createVariantByBrandModel({
            category_id, brand, model, color, size, sku, price, stock,
        })
    );

    await ctx.reply(
        `Новый вариант создан!\n${brand} ${model}, вариант: ${color} / ${size}\n`
    )
}