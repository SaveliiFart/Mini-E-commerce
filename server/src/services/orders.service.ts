import { pool } from "../config/db.js";
import type { Order, OrderItem,OrderWithItems, OrderStatus, OrderItemDetailed } from "../types/order.types.js";
import type { CreateOrderInput } from "../schemas/order.schema.js";

type OrderRow = Omit<Order, "total_price"> & {total_price: string};
type OrderItemRow = Omit<OrderItem, "price"> & {price: string};
type OrderItemDetailedRow = Omit<OrderItemDetailed, "price"> & { price: string };

const mapOrderRow = (row: OrderRow): Order => ({
    ...row,
    total_price: Number(row.total_price),
})

const mapOrderItemRow = (row: OrderItemRow): OrderItem => ({
    ...row,
    price: Number(row.price),
});

export const getOrderItemsDetailed = async (order_id: number): Promise<OrderItemDetailed[]> => {
    try {
        const result = await pool.query<OrderItemDetailedRow>(
            `   
                SELECT oi.quantity, oi.price, pv.size, pv.color, p.name AS product_name
                FROM order_items oi
                JOIN product_variants pv ON oi.variant_id = pv.id
                JOIN products p ON pv.product_id = p.id
                WHERE oi.order_id = $1`,
            [order_id]
        );

        return result.rows.map((row) => ({ ...row, price: Number(row.price) }));
    } catch (error) {
        console.error("getOrderItemsDetailed failed:", error);
        throw new Error("Не удалось получить состав заказа");
    }
};

export class OrderValidationError extends Error {}

export const createOrder = async(input: CreateOrderInput): Promise<OrderWithItems> => {
    const client = await pool.connect()
    try {
        await client.query("BEGIN");

        let totalPrice = 0
        const itemsWithPrice: { variant_id: number; quantity: number; price: number }[] = [];

        for(const item of input.items) {
            const productResult = await client.query<{ price: string; stock: number }>(
                `SELECT price, stock FROM product_variants WHERE id = $1 AND is_active = true FOR UPDATE`,
                [item.variant_id]
            );

            if (productResult.rows.length === 0) {
                throw new OrderValidationError(`Товар с id ${item.variant_id} не найден или недоступен`);
            }

            const product = productResult.rows[0]
            const price = Number(product.price)

            if(product.stock < item.quantity) {
                throw new OrderValidationError(`Недостаточно товара id ${item.variant_id} на складе (доступно: ${product.stock})`)
            }

            totalPrice += price * item.quantity
            itemsWithPrice.push({variant_id: item.variant_id, quantity: item.quantity, price: price})
        }

        const orderResult = await client.query<OrderRow>(`
            INSERT INTO orders (user_id, status, total_price, delivery_address, phone, telegram_username, comment)
            VALUES (NULL, 'pending', $1, $2, $3, $4, $5)
            RETURNING *
        `, [totalPrice, input.delivery_address, input.phone, input.telegram_username, input.comment])

        const order = orderResult.rows[0]
        const createdItems: OrderItemRow[] = [];

        for(const item of itemsWithPrice) {
            const itemsResult = await client.query<OrderItemRow>(`
                INSERT INTO order_items (order_id, variant_id, quantity, price)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [order.id, item.variant_id, item.quantity, item.price]);
            createdItems.push(itemsResult.rows[0])
            await client.query(
                `UPDATE product_variants SET stock = stock - $1 WHERE id = $2`,
                [item.quantity, item.variant_id]
            );
        }

        await client.query("COMMIT");

        return {
            order: mapOrderRow(order),
            items: createdItems.map(mapOrderItemRow),
        }
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export const getOrders = async(): Promise<OrderRow[]> => {
    const client = await pool.connect()
    try{
        const result = await client.query<OrderRow>(`SELECT * FROM orders ORDER BY created_at DESC`)
        return result.rows
    } catch(error) {
        console.error("getOrders failed:", error);
        throw new Error("Не удалось получить список заказов");
    }
}

export const getOrder = async(id: number): Promise<OrderWithItems | null> => {
    const client = await pool.connect()
    try{
        const orderResult = await client.query<OrderRow>(`SELECT * FROM orders WHERE id = $1`,[id])

        if (orderResult.rows.length === 0) {
            return null;
        }

        const itemResult = await client.query<OrderItemRow>(`SELECT * FROM order_items WHERE order_id = $1`, [id])

        return {
            order: mapOrderRow(orderResult.rows[0]),
            items: itemResult.rows.map(mapOrderItemRow),
        }
    } catch (error) {
        console.error("getOrders failed:", error);
        throw new Error("Не удалось получить заказ");
    }
}

export const updateOrderStatus = async (
    id: number,
    status: OrderStatus
): Promise<Order | null> => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const currentResult = await client.query<OrderRow>(
            `SELECT * FROM orders WHERE id = $1 FOR UPDATE`,
            [id]
        );

        if (currentResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        const currentOrder = currentResult.rows[0];

        if (status === "cancelled" && currentOrder.status !== "cancelled") {
            const itemsResult = await client.query<{ product_id: number; quantity: number }>(
                `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
                [id]
            );
            for (const item of itemsResult.rows) {
                await client.query(
                    `UPDATE products SET stock = stock + $1 WHERE id = $2`,
                    [item.quantity, item.product_id]
                );
            }
        }

        const updatedResult = await client.query<OrderRow>(
            `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, id]
        );

        await client.query("COMMIT");

        return mapOrderRow(updatedResult.rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("updateOrderStatus failed:", error);
        throw new Error("Не удалось обновить статус заказа");
    } finally {
        client.release();
    }
};