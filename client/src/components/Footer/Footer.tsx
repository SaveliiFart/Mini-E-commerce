export const Footer = () => {
    return(
        <div className="border-t border-t-[#262626] flex flex-row items-center justify-between text-white px-1 py-6 md:px-4 md:py-6">
            <p className="text-sm font-medium opacity-60">© 2026 sportwear_dealer · Харків</p>
            <a
                href="https://t.me/sportwear_dealer"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium opacity-60"
                cursor-pointer
            >
                t.me/sportwear_dealer
            </a>
        </div>
    )
}