import type { ProductCardProps } from "../../types/productCard.types"
const formatPrice = (value: number) => `${value.toLocaleString("uk-UA")} ₴`

export const ProductCard = ({ id, brand, model, price, oldPrice, imageUrl }: ProductCardProps) => (
    <a
        href={`/product/${id}`}
        className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition hover:border-neutral-700"
    >
        <div className="aspect-square bg-[radial-gradient(120%_90%_at_30%_20%,#262626,#151515_60%)]">
            {imageUrl ? (
                <img src={imageUrl} alt={`${brand} ${model}`} className="size-full object-cover" />
            ) : (
                <div className="flex size-full items-center justify-center text-xs tracking-wide text-neutral-600">
                    фото
                </div>
            )}
        </div>

        <div className="px-3.5 pt-3 pb-4">
            <div className="text-[10px] tracking-wider text-neutral-400 uppercase">{brand}</div>
            <div className="mt-1 mb-2 text-[13px] font-semibold text-neutral-50">{model}</div>
            <div className="text-sm font-extrabold text-neutral-50">
                {formatPrice(price)}
                {oldPrice && (
                    <span className="ml-1.5 text-xs font-medium text-neutral-400 line-through">
                        {formatPrice(oldPrice)}
                    </span>
                )}
            </div>
        </div>
    </a>
)