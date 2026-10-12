import { useEffect, useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Filter } from "../../components/Filter/Filter"
import type { Filters, ListKey } from "../../types/filter.types"
import { emptyFilters } from "../../types/filter.types"
import { Footer } from "../../components/Footer/Footer"
import { Header } from "../../components/Header/Header"
import { ProductCard } from "../../components/ProductCard/ProductCard"

const products = [
    { id: 1, brand: "Nike", model: "24.7", price: 8990 },
    { id: 2, brand: "Jordan", model: "Brooklyn", price: 4390 },
    { id: 3, brand: "New Balance", model: "9060", price: 7290 },
    { id: 4, brand: "Nike", model: "Air Max", price: 7490 },
    { id: 5, brand: "Adidas", model: "Superstar", price: 6990 },
    { id: 6, brand: "Adidas", model: "Predator", price: 7990 },
]

export const Products = () => {
    const [filters, setFilters] = useState<Filters>(emptyFilters)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const toggleValue = (key: ListKey, value: string) =>
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((v) => v !== value)
                : [...prev[key], value],
        }))

    const changeFilters = (patch: Partial<Filters>) =>
        setFilters((prev) => ({ ...prev, ...patch }))

    const listKeys: ListKey[] = ["categories", "brands", "sizes", "colors"]
    const chips = listKeys.flatMap((key) =>
        filters[key].map((value) => ({ key, value }))
    )

    useEffect(() => {
        if (!isFilterOpen) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsFilterOpen(false)
        }
        const mq = window.matchMedia("(min-width: 768px)")
        const onResize = (e: MediaQueryListEvent) => {
            if (e.matches) setIsFilterOpen(false)
        }

        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKeyDown)
        mq.addEventListener("change", onResize)

        return () => {
            document.body.style.overflow = ""
            window.removeEventListener("keydown", onKeyDown)
            mq.removeEventListener("change", onResize)
        }
    }, [isFilterOpen])

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <Header />

            <main className="mx-auto max-w-6xl px-5 py-8">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Каталог</h1>
                        <p className="mt-1 text-neutral-400">Усі товари — обирай за фільтрами</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsFilterOpen(true)}
                        aria-expanded={isFilterOpen}
                        aria-controls="filters-panel"
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-white hover:bg-white/5 md:hidden"
                    >
                        <SlidersHorizontal size={20} />
                        Фільтри
                    </button>
                </div>

                <div className="md:flex md:gap-8">
                    <div
                        onClick={() => setIsFilterOpen(false)}
                        className={`fixed inset-0 z-55 bg-black/60 transition-opacity duration-300 md:hidden ${
                            isFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"
                        }`}
                    />

                    <aside
                        id="filters-panel"
                        className={`
                            fixed inset-y-0 left-0 z-60 flex w-[min(86vw,340px)] flex-col overflow-y-auto
                            border-r border-neutral-800 bg-neutral-950 px-4 pt-[calc(1rem+env(safe-area-inset-top))]
                            transition-[transform,visibility] duration-300 ease-in-out
                            ${isFilterOpen ? "visible translate-x-0" : "invisible -translate-x-full"}
                            md:visible md:sticky md:top-24 md:bottom-auto md:z-auto md:max-h-[calc(100vh-7rem)]
                            md:w-57.5 md:shrink-0 md:translate-x-0 md:self-start md:border-r-0 md:px-0 md:pt-0
                        `}
                    >
                        <div className="mb-2 flex items-center justify-between md:hidden">
                            <span className="text-base font-bold">Фільтри</span>
                            <button
                                type="button"
                                onClick={() => setIsFilterOpen(false)}
                                aria-label="Закрити фільтри"
                                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-neutral-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <Filter filters={filters} onToggle={toggleValue} onChange={changeFilters} />

                        <div className="sticky bottom-0 mt-auto border-t border-neutral-800 bg-neutral-950 pt-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] md:hidden">
                            <button
                                type="button"
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full cursor-pointer rounded-xl bg-linear-to-r from-[#ff3e8e] to-[#ff7a3d] py-3.5 text-sm font-extrabold text-black"
                            >
                                Показати товари: {products.length}
                            </button>
                        </div>
                    </aside>

                    <section className="min-w-0 flex-1">
                        <p className="mb-4 text-neutral-400">Товарів: {products.length}</p>

                        {chips.length > 0 && (
                            <div className="mb-5 flex flex-wrap gap-2">
                                {chips.map(({ key, value }) => (
                                    <button
                                        key={`${key}-${value}`}
                                        type="button"
                                        onClick={() => toggleValue(key, value)}
                                        aria-label={`Прибрати фільтр ${value}`}
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-neutral-50 px-3.5 py-2 text-xs font-medium text-black"
                                    >
                                        {value}
                                        <X size={14} />
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFilters(emptyFilters)}
                                    className="cursor-pointer rounded-full border border-neutral-800 px-3.5 py-2 text-xs text-neutral-400 hover:text-white"
                                >
                                    Скинути все
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4.5 lg:grid-cols-3">
                            {products.map((product) => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}