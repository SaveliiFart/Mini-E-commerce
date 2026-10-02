import type { Conversation } from "@grammyjs/conversations";
import type { MyContext } from "../bot.js";
import * as categoryService from "../../services/categories.service.js";

type MyConversation = Conversation<MyContext, MyContext>;

export const createCategory = async (conversation: MyConversation, ctx: MyContext) => {
    await ctx.reply("Введите название новой категории:");

    const nameCtx = await conversation.waitFor("message:text");
    const name = nameCtx.message.text;
    
    const created = await conversation.external(() => categoryService.createCategory(name));

    await ctx.reply(`Категория «${created.name}» успешно создана (id: ${created.id})`);
};