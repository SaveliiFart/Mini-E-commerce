export type Filters = {
    categories: string[]
    brands: string[]
    sizes: string[]
    colors: string[]
    priceFrom: string
    priceTo: string
    inStock: boolean
}

export type ListKey = "categories" | "brands" | "sizes" | "colors"

export const emptyFilters: Filters = {
    categories: [],
    brands: [],
    sizes: [],
    colors: [],
    priceFrom: "",
    priceTo: "",
    inStock: false,
}