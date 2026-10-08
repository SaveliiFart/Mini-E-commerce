import { Header } from "../../components/Header/Header"
import { Hero } from "../../components/Hero/Hero"
import { Stats } from "../../components/Hero/Stats"
import { Category } from "../../components/Category/Category"
import { ProductCard } from "../../components/ProductCard/ProductCard"
import { Footer } from "../../components/Footer/Footer"

export const Home = () => {
    return (
        <>
            <Header/>
            <main>
                <Hero/>
                <Stats/>
                <Category/>
                <div className="bg-neutral-950 px-4 py-2">
                    <div className="flex flex-row items-center justify-between px-2 text-white">
                        <p className="font-bold text-2xl">Нові надходження</p>
                        <p className="text-sm opacity-60">Усі товари →</p>
                    </div>
                    <ProductCard/>
                </div>
            </main>
            <Footer/>
        </>
    )
}