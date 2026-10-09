export const Hero = () => {
    return (
        <section className="relative overflow-hidden">
            <div
                aria-hidden
                className="pointer-events-none absolute top-[-40%] right-[-10%] size-115 rounded-full bg-linear-to-r from-[#ff3e8e] to-[#ff7a3d] opacity-18 blur-[120px]"
            />
            <div className="relative px-6 py-10 md:px-12 md:py-14">
                <div className="mb-6 inline-flex flex-wrap items-center gap-x-2 rounded-full border border-neutral-800 px-4 py-1.5 text-xs">
                    <span className="bg-linear-to-r from-pink-500 to-orange-400 bg-clip-text font-bold text-transparent">
                        ТІЛЬКИ ОРИГІНАЛ
                    </span>
                    <span className="text-neutral-400">· Шоурум м. Харків</span>
                </div>

                <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-50 md:text-6xl">
                    Оригінальний одяг та взуття — твій друг у світі брендів
                </h1>

                <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-400">
                    Nike, Jordan та інші — перевірені постачальники, 8000+ задоволених
                    клієнтів. В наявності та під замовлення.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button className="rounded-full bg-linear-to-r from-pink-500 to-orange-400 px-7 py-3.5 text-sm font-bold text-black transition hover:brightness-110 cursor-pointer">
                        Переглянути каталог
                    </button>
                    <a
                        href="https://t.me/sportwear_dealer"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-neutral-800 px-7 py-3.5 text-sm text-neutral-50 transition hover:bg-neutral-900"
                        cursor-pointer
                    >
                        Наш Telegram
                    </a>
                </div>
            </div>
        </section>
    );
}