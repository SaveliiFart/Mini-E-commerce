export type OrderStatus =  "pending" | "confirmed" | "processing" | "shipped" | "delivered" |"cancelled"

export interface Order {
    id: number;
    user_id: number | null;
    status : OrderStatus;
    total_price: number;
    delivery_address: string;
    phone: string;
    telegram_username: string | null;
    comment: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
}

export interface OrderWithItems {
    order: Order;
    items: OrderItem[];
}