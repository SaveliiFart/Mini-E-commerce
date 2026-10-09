import type { ReactNode } from "react"
import type { Filters, ListKey } from "../../types/filter.types"

const categories = [
    { name: "Кросівки", count: 24 },
    { name: "Куртки", count: 18 },
    { name: "Футболки", count: 31 },
    { name: "Штани", count: 12 },
]
const brands = [
    { name: "Nike", count: 21 },
    { name: "Jordan", count: 9 },
    { name: "New Balance", count: 6 },
    { name: "Adidas", count: 12 },
]
const sizes = ["40", "41", "42", "43", "44", "S", "M", "L", "XL"]
const colors = [
    { name: "Чорний", hex: "#111111" },
    { name: "Білий", hex: "#f5f5f3" },
    { name: "Сірий", hex: "#8a8a8a" },
    { name: "Бежевий", hex: "#d9c8a9" },
    { name: "Синій", hex: "#2b4a8b" },
]

const Group = ({ title, children }: { title?: string; children: ReactNode }) => (
    <div className="border-b border-neutral-800 py-4 first:pt-0">
        {title && (
            <p className="mb-2.5 text-[11px] font-medium tracking-wider text-neutral-400 uppercase">
                {title}
            </p>
        )}
        {children}
    </div>
)

const CheckRow = ({
    label,
    count,
    checked,
    onChange,
}: {
    label: string
    count?: number
    checked: boolean
    onChange: () => void
}) => (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-neutral-50">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="size-4 shrink-0 rounded border border-neutral-600 transition peer-checked:border-transparent peer-checked:bg-linear-to-r peer-checked:from-[#ff3e8e] peer-checked:to-[#ff7a3d] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white" />
        <span>{label}</span>
        {count !== undefined && (
            <span className="ml-auto text-xs text-neutral-400">{count}</span>
        )}
    </label>
)

type Props = {
    filters: Filters
    onToggle: (key: ListKey, value: string) => void
    onChange: (patch: Partial<Filters>) => void
}

export const Filter = ({ filters, onToggle, onChange }: Props) => {
    const digitsOnly = (value: string) => value.replace(/\D/g, "")

    return (
        <div>
            <Group title="Категорія">
                {categories.map((c) => (
                    <CheckRow
                        key={c.name}
                        label={c.name}
                        count={c.count}
                        checked={filters.categories.includes(c.name)}
                        onChange={() => onToggle("categories", c.name)}
                    />
                ))}
            </Group>

            <Group title="Бренд">
                {brands.map((b) => (
                    <CheckRow
                        key={b.name}
                        label={b.name}
                        count={b.count}
                        checked={filters.brands.includes(b.name)}
                        onChange={() => onToggle("brands", b.name)}
                    />
                ))}
            </Group>

            <Group title="Розмір">
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                        const active = filters.sizes.includes(size)
                        return (
                            <button
                                key={size}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onToggle("sizes", size)}
                                className={`cursor-pointer rounded-[10px] border px-3 py-1.75 text-xs transition ${
                                    active
                                        ? "border-transparent bg-linear-to-r from-[#ff3e8e] to-[#ff7a3d] font-bold text-black"
                                        : "border-neutral-800 text-neutral-50 hover:border-neutral-600"
                                }`}
                            >
                                {size}
                            </button>
                        )
                    })}
                </div>
            </Group>

            <Group title="Колір">
                <div className="flex flex-wrap gap-2.5">
                    {colors.map((color) => {
                        const active = filters.colors.includes(color.name)
                        return (
                            <button
                                key={color.name}
                                type="button"
                                aria-label={color.name}
                                aria-pressed={active}
                                onClick={() => onToggle("colors", color.name)}
                                style={{ backgroundColor: color.hex }}
                                className={`size-7 cursor-pointer rounded-full border-2 border-neutral-800 transition ${
                                    active ? "outline-2 outline-offset-2 outline-[#ff7a3d]" : ""
                                }`}
                            />
                        )
                    })}
                </div>
            </Group>

            <Group title="Ціна, ₴">
                <div className="flex gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="від 1 000"
                        value={filters.priceFrom}
                        onChange={(e) => onChange({ priceFrom: digitsOnly(e.target.value) })}
                        className="w-full min-w-0 rounded-[10px] border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-[13px] text-white placeholder:text-neutral-500"
                    />
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="до 10 000"
                        value={filters.priceTo}
                        onChange={(e) => onChange({ priceTo: digitsOnly(e.target.value) })}
                        className="w-full min-w-0 rounded-[10px] border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-[13px] text-white placeholder:text-neutral-500"
                    />
                </div>
            </Group>

            <Group>
                <CheckRow
                    label="Тільки в наявності"
                    checked={filters.inStock}
                    onChange={() => onChange({ inStock: !filters.inStock })}
                />
            </Group>
        </div>
    )
}