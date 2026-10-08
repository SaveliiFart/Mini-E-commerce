export const ProductCard = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-white py-4">
            <div className="rounded-2xl border border-[#262626]">
                <div className="aspect-square bg-[radial-gradient(120%_90%_at_30%_20%,#262626,#151515_60%)]">
                    <div className="flex size-full items-center justify-center text-xs tracking-wide text-neutral-600">
                        фото товару
                    </div>
                </div>
                <div className="bg-[#161616] px-3 py-2 md:px-4 md:py-4">
                    <p className="opacity-60">NIKE</p>
                    <p className="font-bold text-sm">24.7</p>
                    <p className="font-bold text-sm py-2">8990 ₴</p>
                </div>
            </div>
            <div className="rounded-2xl border border-[#262626]">
                <div className="aspect-square bg-[radial-gradient(120%_90%_at_30%_20%,#262626,#151515_60%)]">
                    <div className="flex size-full items-center justify-center text-xs tracking-wide text-neutral-600">
                        фото товару
                    </div>
                </div>
                <div className="bg-[#161616] px-3 py-2 md:px-4 md:py-4">
                    <p className="opacity-60">JORDAN</p>
                    <p className="font-bold text-sm">Brooklyn Graphic</p>
                    <p className="font-bold text-sm py-2">4390 ₴</p>
                </div>
            </div>
            <div className="rounded-2xl border border-[#262626]">
                <div className="aspect-square bg-[radial-gradient(120%_90%_at_30%_20%,#262626,#151515_60%)]">
                    <div className="flex size-full items-center justify-center text-xs tracking-wide text-neutral-600">
                        фото товару
                    </div>
                </div>
                <div className="bg-[#161616] px-3 py-4 md:px-4 md:py-4">
                    <p className="opacity-60">NIKE</p>
                    <p className="font-bold text-sm">Air Max</p>
                    <p className="font-bold text-sm py-2">7490 ₴</p>
                </div>
            </div>
        </div>
    )
}