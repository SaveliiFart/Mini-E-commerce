import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

export const OrderConfirmation = () => {
    return (
        <div className="min-h-screen">
            <Header/>
            <main className="flex flex-col items-center justify-center mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ">
                <div className="flex items-center justify-center text-white text-4xl font-bold bg-linear-to-r from-pink-500 to-orange-400 rounded-full w-20 h-20">✓</div>
                <div className="flex flex-col items-center justify-center text-white mt-4">
                    <span className="text-2xl font-bold mb-2">Дякуємо за замовлення!</span>
                    <span className="text-center text-sm text-neutral-400">Замовлення №142 · Ми зв'яжемося з вами в Telegram або зателефонуємо для підтвердження</span>
                </div>
                <button type="button" className="cursor-pointer mt-8 text-center text-black text-lg font-bold bg-linear-to-r from-pink-500 to-orange-400 px-3 py-1 rounded-3xl">На головну</button>
            </main>
            <Footer/>
        </div>
    )
}