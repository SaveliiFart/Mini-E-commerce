import { useEffect, useState } from "react"
import logo from "../../assets/logo.jpg"

const links = [
    { href: "/", label: "Головна" },
    { href: "/catalog", label: "Каталог" },
    { href: "/about", label: "Про нас" },
    { href: "/contacts", label: "Контакти" },
]

const bar = "block h-1 w-7 rounded-full bg-white transition duration-300 ease-in-out"

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }
        const mq = window.matchMedia("(min-width: 640px)")
        const onChange = (e: MediaQueryListEvent) => {
            if (e.matches) setIsOpen(false)
        }

        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKeyDown)
        mq.addEventListener("change", onChange)

        return () => {
            document.body.style.overflow = ""
            window.removeEventListener("keydown", onKeyDown)
            mq.removeEventListener("change", onChange)
        }
    }, [isOpen])

    return (
        <header className="sticky top-0 z-50 bg-neutral-950 border-b border-b-[#262626]">
            <nav
                id="mobile-menu"
                className={`
                    fixed inset-0 z-10 sm:hidden
                    flex flex-col items-center justify-center gap-4
                    bg-neutral-950
                    transition-[opacity,visibility] duration-300 ease-in-out
                    ${isOpen ? "visible opacity-100" : "invisible opacity-0"}
                `}
            >
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="py-2 text-3xl font-bold text-white"
                    >
                        {link.label}
                    </a>
                ))}
            </nav>

            <div className="
                relative z-20
                flex items-center justify-between
                px-4 py-3
                sm:px-6 sm:py-4
                lg:px-8 lg:py-5
            ">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="
                        p-0.75
                        rounded-full
                        bg-linear-to-r from-pink-500 via-red-400 to-orange-400
                    ">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>

                    <p className="text-sm sm:text-base lg:text-lg font-bold text-white">
                        SPORTWEAR DEALER
                    </p>
                </div>

                <nav className="hidden sm:flex items-center gap-10 text-sm">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-neutral-400 transition hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <button className="
                        w-9 h-9
                        sm:w-10 sm:h-10
                        lg:w-11 lg:h-11
                        rounded-full
                        flex items-center justify-center text-3xl
                    ">
                        🛍️
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        className="
                            sm:hidden
                            w-9 h-9
                            flex flex-col
                            items-center justify-center
                            gap-1.5
                            cursor-pointer
                        "
                    >
                        <span className={`${bar} ${isOpen ? "translate-y-2.5 rotate-45" : ""}`} />
                        <span className={`${bar} ${isOpen ? "scale-x-0 opacity-0" : ""}`} />
                        <span className={`${bar} ${isOpen ? "-translate-y-2.5 -rotate-45" : ""}`} />
                    </button>
                </div>
            </div>
        </header>
    )
}