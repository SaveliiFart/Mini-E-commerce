export interface User {
    id: number;
    telegram_id: string,
    name: string, 
    phone: string | null,
    role: "customer" | "admin",
    created_at: Date
}