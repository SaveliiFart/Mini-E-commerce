import { Header } from "../../components/Header/Header"
import { Footer } from "../../components/Footer/Footer"
import { ProductGallery } from "../../components/ProductGallery/ProductGallery"
import { useState } from "react"

const sizes = [
    { value: "40", inStock: true },
    { value: "41", inStock: true },
    { value: "42", inStock: true },
    { value: "43", inStock: false },
]

const colors = [
    { value: "Чорний", inStock: true },
    { value: "Білий", inStock: true },
    { value: "Бежевий", inStock: false },
]

export const Product = () => {
    const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0].value)
    const [selectedColor, setSelectedColor] = useState<string | null>(colors[0].value)

    return (
        <>
            <Header />
            <main className="lg:grid lg:grid-cols-2 lg:gap-10 px-4 py-6">
                <ProductGallery alt="Nike 24.7" />
                <div className="py-8 lg:py-0">
                    <div className="border-b border-neutral-800">
                        <div className="text-[14px] tracking-wider text-neutral-400 uppercase pb-2">Nike</div>
                        <div className="mt-1 mb-1 text-lg font-extrabold text-neutral-50">24/7</div>
                        <div className="text-lg mb-4 font-extrabold text-neutral-50">
                            8990 ₴
                        </div>
                        <div className="flex flex-col text-white">
                            <span className="text-[14px] mb-2 tracking-wider text-neutral-400 uppercase">КОЛІР</span>
                            <div className="flex flex-row gap-2 items-center justify-start">
                                {colors.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        disabled={!color.inStock}
                                        aria-pressed={selectedColor === color.value}
                                        onClick={() => setSelectedColor(color.value)}
                                        className={`px-4 py-2 rounded-xl cursor-pointer ${!color.inStock 
                                            ? "border border-[#323232] text-[#525252] line-through cursor-not-allowed"
                                            : selectedColor === color.value
                                                ? "bg-linear-to-r from-pink-500 via-red-400 to-orange-400 font-bold text-black cursor-pointer"
                                                : "border border-[#262626] transition hover:border-neutral-700 cursor-pointer"
                                        }`}
                                    >
                                        {color.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col text-white mt-3 mb-3">
                            <span className="text-[14px] mb-2 tracking-wider text-neutral-400 uppercase">
                                РОЗМІР
                            </span>
                            <div className="flex flex-row gap-2 items-center justify-start">
                                {sizes.map((size) => (
                                    <button
                                        key={size.value}
                                        type="button"
                                        disabled={!size.inStock}
                                        aria-pressed={selectedSize === size.value}
                                        onClick={() => setSelectedSize(size.value)}
                                        className={`px-3 py-2 rounded-xl ${!size.inStock
                                                ? "border border-[#323232] text-[#525252] line-through cursor-not-allowed"
                                                : selectedSize === size.value
                                                    ? "bg-linear-to-r from-pink-500 via-red-400 to-orange-400 font-bold text-black cursor-pointer"
                                                    : "border border-[#262626] transition hover:border-neutral-700 cursor-pointer"
                                            }`}
                                    >
                                        {size.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <span className="text-green-500 ">
                            ✓ В наявності — 5 шт.
                        </span>
                        <button className="w-full h-14 mt-5 mb-5 font-bold bg-linear-to-r from-pink-500 via-red-400 to-orange-400 rounded-xl cursor-pointer">
                            Додати в кошик
                        </button>
                    </div>
                    <div className="mt-4">
                        <span className="text-[14px] mb-2 tracking-wider text-neutral-400">
                            Бренд заявляє, що в цих кросівках хочеться ходити 24/7. Створені для максимального комфорту, поєднують сучасний мінімалістичний дизайн із м'якою амортизацією.
                        </span>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}