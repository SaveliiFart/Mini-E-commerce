import { Header } from "../../components/Header/Header"
import { Hero } from "../../components/Hero/Hero"
import { Stats } from "../../components/Hero/Stats"
import { Category } from "../../components/Category/Category"
import { ProductCard } from "../../components/ProductCard/ProductCard"
import { Footer } from "../../components/Footer/Footer"

const products = [
    { id: 1, brand: "Nike", model: "24.7", price: 8990 },
    { id: 2, brand: "Jordan", model: "Brooklyn", price: 4390 },
    { id: 3, brand: "New Balance", model: "9060", price: 7290 },
]

export const Home = () => {
    return (
        <>
            <Header/>
            <main>
                <Hero/>
                <Stats/>
                <Category/>
                <div className="bg-neutral-950 px-4 py-2 mx-auto max-w-6xl">
                    <div className="flex flex-row items-center justify-between px-2 text-white">
                        <p className="font-bold text-2xl">Нові надходження</p>
                        <button className="text-sm opacity-60 cursor-pointer text-neutral-400 transform hover:text-white">Усі товари →</button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4.5 py-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    )
}