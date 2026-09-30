export interface ProductVariant {
    id: number,
    product_id: number,
    size: string;
    color: string,
    sku: string,
    price: number,
    stock: number,
    is_active: boolean,
}