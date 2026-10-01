import { bot } from "./bot.js";
import * as userService from "../services/users.service.js";
import * as ordersService from "../services/orders.service.js";
import type { OrderWithItems } from "../types/order.types.js";

export const notifyAdminsNewOrder = async (data: OrderWithItems) => {
    const admins = await userService.getAdmins();

    if (admins.length === 0) {
        console.warn("Новый заказ создан, но админов в базе нет — некому уведомлять");
        return;
    }

    const items = await ordersService.getOrderItemsDetailed(data.order.id);
    const itemsText = items
        .map((item) => `  • ${item.product_name} (${item.size}, ${item.color}) × ${item.quantity}`)
        .join("\n");

    const text = (
        `🆕 Новый заказ #${data.order.id}\n\n` +
        `Товары:\n${itemsText}\n\n` +
        `Итого: ${data.order.total_price} ₽\n` +
        `Телефон: ${data.order.phone}\n` +
        `Адрес: ${data.order.delivery_address}` +
        (data.order.comment ? `\nКомментарий: ${data.order.comment}` : "")
    );

    for (const admin of admins) {
        try {
            await bot.api.sendMessage(admin.telegram_id, text);
        } catch (error) {
            console.error(`Не удалось уведомить админа ${admin.telegram_id}:`, error);
        }
    }
};