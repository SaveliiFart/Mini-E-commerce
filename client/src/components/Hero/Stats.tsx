export const Stats = () => {
    return(
        <div className="grid grid-cols-2 bg-neutral-950 text-white md:grid-cols-4">
            <div className="border border-l-0 border-[#262626] w-full h-40 flex flex-col items-center justify-center ">
                <p className="font-bold text-xl py-6">8000+</p>
                <p className="text-sm text-white opacity-60">задоволених клієнтів</p>
            </div>
            <div className="border border-r-0 md:border-r border-[#262626] w-full h-40 flex flex-col items-center justify-center">
                <p className="font-bold text-xl py-6">1,187</p>
                <p className="text-sm text-white opacity-60">товарів в архіві</p>
            </div>
            <div className="border border-l-0 md:border-l border-[#262626] w-full h-40 flex flex-col items-center justify-center">
                <p className="font-bold text-xl py-6">100%</p>
                <p className="text-sm text-white opacity-60">оригінал</p>
            </div>
            <div className="border border-r-0 border-[#262626] w-full h-40 flex flex-col items-center justify-center">
                <p className="font-bold text-xl py-6">Харків</p>
                <p className="text-sm text-white opacity-60">шоурум offline</p>
            </div>
        </div>
    )
}