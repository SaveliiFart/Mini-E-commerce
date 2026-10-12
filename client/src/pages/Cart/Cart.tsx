import { Header } from "../../components/Header/Header"
import { Footer } from "../../components/Footer/Footer"
import { CartItem } from "../../components/CartItem/CartItem"

export const Basket = () => {
    return(
        <div>
            <Header/>
            <main className="text-white px-4 py-4 mx-auto max-w-6xl">
                <div className="flex flex-col mb-10">
                    <span className="text-3xl font-extrabold mb-2">Кошик</span>
                    <span className="text-sm tracking-wider text-neutral-400">2 товари</span>
                </div>

                <div>
                    <CartItem name="Nike 24.7" color="Чорний" size={42} price={8990}/>
                    <CartItem name="Jordan Brooklyn Graphic" color="Чорний" size="L" price={8990}/>
                </div>

                <div className="bg-[#161616] rounded-xl mt-4 px-6 py-3 border border-[#262626]">
                    <div className="border-b border-white/15">
                        <div className="flex items-center justify-between px-4 py-2 text-sm tracking-wider text-neutral-400">
                            <span>Товари(2)</span>
                            <span>13 380 ₴</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2 text-sm tracking-wider text-neutral-400">
                            <span>Доставка</span>
                            <span>За тарифами НП</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 text-white font-bold">
                        <span>Разом</span>
                        <span>13 380 ₴</span>
                    </div>
                    <button
                        className="w-full h-14 mt-5 mb-5 font-bold text-black bg-linear-to-r from-pink-500 via-red-400 to-orange-400 rounded-xl cursor-pointer"
                    >Оформити замовлення</button>
                </div>
            </main>
            <Footer/>
        </div>
    )
}