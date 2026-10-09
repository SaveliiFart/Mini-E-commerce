export const Category = () => {
    return (
        <div className="mx-auto max-w-6xl px-4 py-4">
            <p className="text-white text-2xl font-bold mb-4">Категорії</p>
            <div className="grid grid-cols-2 md:grid-cols-4 text-white gap-6">
                <div className="
                    flex 
                    flex-col 
                    items-center 
                    justify-center 
                    bg-[#161616] 
                    border 
                    border-[#262626]
                    rounded-2xl
                    px-2
                    py-6
                ">
                    <p className="bg-linear-to-r from-pink-500 to-orange-400 px-2 py-2 rounded-2xl text-4xl mb-2">👟</p>
                    <p className="text-lg font-bold">Кросівки</p>
                </div>
                <div className="
                    flex 
                    flex-col 
                    items-center 
                    justify-center 
                    bg-[#161616] 
                    border 
                    border-[#262626]
                    rounded-2xl
                    px-2
                    py-6
                ">
                    <p className="bg-linear-to-r from-pink-500 to-orange-400 px-2 py-2 rounded-2xl text-4xl mb-2">🧥</p>
                    <p className="text-lg font-bold">Куртки</p>
                </div>
                <div className="
                    flex 
                    flex-col 
                    items-center 
                    justify-center 
                    bg-[#161616] 
                    border 
                    border-[#262626]
                    rounded-2xl
                    px-2
                    py-6
                ">
                    <p className="bg-linear-to-r from-pink-500 to-orange-400 px-2 py-2 rounded-2xl text-4xl mb-2">👕</p>
                    <p className="text-lg font-bold">Футболки</p>
                </div>
                <div className="
                    flex 
                    flex-col 
                    items-center 
                    justify-center 
                    bg-[#161616] 
                    border 
                    border-[#262626]
                    rounded-2xl
                    px-2
                    py-6
                ">
                    <p className="bg-linear-to-r from-pink-500 to-orange-400 px-2 py-2 rounded-2xl text-4xl mb-2">👖</p>
                    <p className="text-lg font-bold">Штани</p>
                </div>
            </div>
        </div>
    )
}