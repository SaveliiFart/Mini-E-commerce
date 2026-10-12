
import { useState } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

interface OrderItem {
    id: number;
    name: string;
    details: string;
    price: number;
    quantity: number;
}

const initialItems: OrderItem[] = [
    {
        id: 1,
        name: "Nike 24.7",
        details: "42, чорний",
        price: 8990,
        quantity: 1,
    },
    {
        id: 2,
        name: "Jordan Brooklyn",
        details: "L",
        price: 4390,
        quantity: 1,
    },
];

const formatPrice = (price: number) =>
    `${price.toLocaleString("uk-UA")} ₴`;

export const Checkout = () => {
    const [items] = useState(initialItems);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [telegram, setTelegram] = useState("");
    const [comment, setComment] = useState("");

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log({
            address,
            phone,
            telegram,
            comment,
            items,
            total,
        });
    };

    const inputClass =
        "w-full rounded-2xl border border-white/10 bg-[#171717] " +
        "px-5 py-4 text-base text-white outline-none " +
        "placeholder:text-white/50 transition-colors " +
        "focus:border-pink-500 sm:py-5 sm:text-lg";

    const labelClass =
        "mb-2 block text-sm text-white/60 sm:text-base";

    return (
        <div>
            <Header />
            <main className="px-4 py-8 text-white sm:px-6 sm:py-12 lg:px-8 mx-auto max-w-6xl">
                <div className="mx-auto max-w-[1600px]">
                    <header className="mb-8 sm:mb-10">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Оформлення замовлення
                        </h1>

                        <p className="mt-2 text-base text-white/60 sm:text-xl">
                            Реєстрація не потрібна — просто заповни контакти
                        </p>
                    </header>

                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)] lg:gap-14">
                        <form
                            onSubmit={handleSubmit}
                            className="flex min-w-0 flex-col gap-6 sm:gap-7"
                        >
                            <div>
                                <label htmlFor="address" className={labelClass}>
                                    Адреса доставки (відділення НП)
                                </label>

                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    autoComplete="street-address"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="м. Харків, відділення №12"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className={labelClass}>
                                    Телефон
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+380 XX XXX XX XX"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="telegram" className={labelClass}>
                                    Telegram (необов'язково)
                                </label>

                                <input
                                    id="telegram"
                                    name="telegram"
                                    type="text"
                                    autoComplete="off"
                                    value={telegram}
                                    onChange={(e) => setTelegram(e.target.value)}
                                    placeholder="@username"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="comment" className={labelClass}>
                                    Коментар до замовлення
                                </label>

                                <textarea
                                    id="comment"
                                    name="comment"
                                    rows={2}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Зателефонувати перед доставкою"
                                    className={`${inputClass} min-h-24 resize-y`}
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-1 w-full rounded-2xl bg-linear-to-r from-pink-500 to-orange-400 px-4 py-5 text-base font-bold text-black transition-opacity hover:opacity-90 active:scale-[0.99] sm:mt-4 sm:text-xl"
                            >
                                Підтвердити замовлення — {formatPrice(total)}
                            </button>
                        </form>

                        <aside className="rounded-3xl border border-white/10 bg-[#171717] p-5 sm:p-7 lg:sticky lg:top-8">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-4 text-sm sm:text-lg"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-white/65">
                                                {item.name} ({item.details})
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="mt-1 text-sm text-white/40">
                                                    Кількість: {item.quantity}
                                                </p>
                                            )}
                                        </div>

                                        <span className="shrink-0 text-right text-white/65">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="my-4 border-t border-white/10" />

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-xl font-bold sm:text-2xl">
                                    Разом
                                </span>

                                <span className="text-xl font-bold sm:text-2xl">
                                    {formatPrice(total)}
                                </span>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};