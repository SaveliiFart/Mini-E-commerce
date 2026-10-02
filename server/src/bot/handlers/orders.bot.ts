import { InlineKeyboard } from "grammy";
import type { MyContext } from "../bot.js";
import * as ordersService from "../../services/orders.service.js";
import type { OrderStatus } from "../../types/order.types.js";

const formatOrderText = async (orderId: number): Promise<string> => {
    const result = await ordersService.getOrder(orderId);
    if (!result) return `Заказ #${orderId} не найден`;

    const items = await ordersService.getOrderItemsDetailed(orderId);
    const itemsText = items
        .map((item) => (
            `  • ${item.product_name} (${item.size}, ${item.color}) × ${item.quantity} = ${item.price * item.quantity} ₽`
        ))
        .join("\n");

    return (
        `Заказ #${result.order.id}\n` +
        `Статус: ${result.order.status}\n` +
        `Товары:\n${itemsText}\n` +
        `Итого: ${result.order.total_price} ₽\n` +
        `Телефон: ${result.order.phone}\n` +
        `Адрес: ${result.order.delivery_address}`
    );
};

const statusKeyboard = (orderId: number) => (
    new InlineKeyboard()
        .text("✅ Подтвердить", `status:${orderId}:confirmed`)
        .text("📦 В обработке", `status:${orderId}:processing`)
        .row()
        .text("🚚 Отправлен", `status:${orderId}:shipped`)
        .text("✔️ Доставлен", `status:${orderId}:delivered`)
        .row()
        .text("❌ Отменить", `status:${orderId}:cancelled`)
);

export const getOrders = async (ctx: MyContext) => {
    const orderList = await ordersService.getOrders();

    if (orderList.length === 0) {
        await ctx.reply("Заказов пока нет.");
        return;
    }

    for (const order of orderList) {
        const text = await formatOrderText(order.id);
        await ctx.reply(text, { reply_markup: statusKeyboard(order.id) });
    }
};

const VALID_STATUSES: OrderStatus[] = [
    "pending", "confirmed", "processing", "shipped", "delivered", "cancelled",
];

export const handleStatusUpdate = async (ctx: MyContext) => {
    const match = ctx.match as RegExpMatchArray;
    const orderId = Number(match[1]);
    const status = match[2];

    if (!VALID_STATUSES.includes(status as OrderStatus)) {
        await ctx.answerCallbackQuery("Некорректный статус");
        return;
    }

    const updated = await ordersService.updateOrderStatus(orderId, status as OrderStatus);

    if (!updated) {
        await ctx.answerCallbackQuery({ text: "Заказ не найден", show_alert: true });
        return;
    }

    await ctx.answerCallbackQuery(`Статус обновлён: ${status}`);

    const text = await formatOrderText(orderId);
    await ctx.editMessageText(text, { reply_markup: statusKeyboard(orderId) });
};