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

export interface ProductDetails {
    products_name: string;
    category_name: string;
    description: string | null;
    size: string;
    color: string,
    sku: string,
    price: number,
    stock: number,
    is_active: boolean
}