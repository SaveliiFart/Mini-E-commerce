
import { useState } from "react";
import type { CartItemProps } from "../../types/cart.types";

export const CartItem = ({
    image,
    name,
    color,
    size,
    price,
}: CartItemProps) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <article className="flex items-center gap-4 sm:gap-7
            border-b border-white/15 py-5">

            <div className="h-24 w-24 shrink-0 overflow-hidden
                rounded-2xl bg-[#171717] sm:h-36 sm:w-36">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center
                        justify-center text-sm text-white/30">
                        Фото
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1 self-stretch
                flex flex-col justify-between sm:justify-start">

                <div>
                    <h3 className="truncate text-base font-bold
                        sm:text-2xl">
                        {name}
                    </h3>

                    <p className="text-sm text-white/60 sm:text-xl">
                        {color}, {size} розмір
                    </p>
                </div>

                <div className="mt-3 flex h-10 w-fit items-center
                    gap-4 rounded-xl border border-white/15 px-3">
                    <button
                        onClick={() =>
                            setQuantity((q) => Math.max(1, q - 1))
                        }
                        aria-label="Зменшити кількість"
                        className="text-xl"
                    >
                        −
                    </button>

                    <span className="min-w-3 text-center">
                        {quantity}
                    </span>

                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Збільшити кількість"
                        className="text-xl"
                    >
                        +
                    </button>
                </div>
            </div>

            <p className="shrink-0 self-center text-base
                font-bold sm:text-3xl">
                {(price * quantity).toLocaleString("uk-UA")} ₴
            </p>
        </article>
    );
};