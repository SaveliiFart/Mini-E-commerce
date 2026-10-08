export interface Product {
    id: number;
    model: string;
    brand: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    category_id: number | null
}