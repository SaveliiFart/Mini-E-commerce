import { useRef, useState, type KeyboardEvent } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
    images?: string[]
    alt: string
}

const PLACEHOLDER_COUNT = 4
const placeholderBg = "bg-[radial-gradient(120%_90%_at_30%_20%,#262626,#151515_60%)]"

export const ProductGallery = ({ images = [], alt }: Props) => {
    const trackRef = useRef<HTMLDivElement>(null)
    const [index, setIndex] = useState(0)

    const slides: (string | null)[] =
        images.length > 0 ? images : Array.from({ length: PLACEHOLDER_COUNT }, () => null)
    const last = slides.length - 1

    const goTo = (i: number) => {
        const track = trackRef.current
        if (!track) return

        const next = Math.max(0, Math.min(i, last))
        track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" })
    }

    const onScroll = () => {
        const track = trackRef.current
        if (!track) return

        setIndex(Math.round(track.scrollLeft / track.clientWidth))
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") goTo(index - 1)
        if (e.key === "ArrowRight") goTo(index + 1)
    }

    return (
        <div className="min-w-0">
            <div className="relative">
                <div
                    ref={trackRef}
                    onScroll={onScroll}
                    onKeyDown={onKeyDown}
                    tabIndex={0}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label={`Фото: ${alt}`}
                    className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl scrollbar-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-scrollbar]:hidden"
                >
                    {slides.map((src, i) => (
                        <div
                            key={i}
                            role="group"
                            aria-label={`${i + 1} з ${slides.length}`}
                            className={`aspect-square w-full shrink-0 snap-center snap-always ${placeholderBg}`}
                        >
                            {src ? (
                                <img
                                    src={src}
                                    alt={`${alt} — фото ${i + 1}`}
                                    loading={i === 0 ? "eager" : "lazy"}
                                    draggable={false}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center text-xs tracking-wide text-neutral-600">
                                    фото {i + 1}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {slides.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => goTo(index - 1)}
                            disabled={index === 0}
                            aria-label="Попереднє фото"
                            className="absolute top-1/2 left-3 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-0 md:flex"
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(index + 1)}
                            disabled={index === last}
                            aria-label="Наступне фото"
                            className="absolute top-1/2 right-3 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-0 md:flex"
                        >
                            <ChevronRight size={22} />
                        </button>
                    </>
                )}
            </div>

            {slides.length > 1 && (
                <>
                    <div className="mt-2 flex justify-center md:hidden">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Фото ${i + 1}`}
                                aria-current={i === index}
                                className="cursor-pointer p-1.5"
                            >
                                <span
                                    className={`block h-2 rounded-full transition-all duration-300 ${
                                        i === index
                                            ? "w-6 bg-linear-to-r from-[#ff3e8e] to-[#ff7a3d]"
                                            : "w-2 bg-neutral-700"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="mt-3 hidden gap-3 md:flex">
                        {slides.map((src, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Фото ${i + 1}`}
                                aria-current={i === index}
                                className={`size-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border transition ${placeholderBg} ${
                                    i === index
                                        ? "border-[#ff7a3d]"
                                        : "border-neutral-800 opacity-60 hover:opacity-100"
                                }`}
                            >
                                {src && (
                                    <img
                                        src={src}
                                        alt=""
                                        draggable={false}
                                        className="size-full object-cover"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}