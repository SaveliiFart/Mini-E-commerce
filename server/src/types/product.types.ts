export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    stock: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}