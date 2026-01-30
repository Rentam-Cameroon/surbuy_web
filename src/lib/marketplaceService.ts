export interface ListProductsParams {
    type?: "new" | "popular" | "recommended"
    category_id?: string
    page?: number
    limit?: number
    user_id?: string | null
}

export interface SearchProductsParams {
    keyword?: string
    category?: string
    min_price?: number
    max_price?: number
    location_city?: string
    condition?: string
    sort_by?: "newest" | "oldest" | "lowest_price" | "highest_price"
    user_id?: string | null
}

export const marketplaceService = {
    async listProducts(params: ListProductsParams) {
        const response = await fetch("/api/marketplace/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "list_products",
                ...params,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to list products")
        return resData
    },

    async getProduct(productId: string) {
        const response = await fetch("/api/marketplace/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "get_product",
                product_id: productId,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to fetch product")
        return resData.product
    },

    async searchProducts(params: SearchProductsParams) {
        const response = await fetch("/api/marketplace/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "search_products",
                ...params,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to search products")
        return resData.products
    },

    async getRecentSearches(userId?: string | null) {
        if (!userId) return []
        const response = await fetch("/api/marketplace/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "get_recent_searches",
                user_id: userId,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to get recent searches")
        return resData.recent_searches || []
    },

    async getPopularSearches() {
        const response = await fetch("/api/marketplace/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "get_popular_searches",
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to get popular searches")
        return resData.popular_searches || []
    },

    async getSearchSuggestions(keyword: string) {
        const response = await fetch("/api/marketplace/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "search_suggestions",
                keyword,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to get suggestions")
        return resData.suggestions || []
    },

    async getSimilarProducts(productId: string, userId?: string | null) {
        const response = await fetch("/api/marketplace/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "similar_products",
                product_id: productId,
                user_id: userId ?? undefined,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to load similar products")
        return resData.similar_products || []
    },

    async getUserProfile(userId: string) {
        const response = await fetch("/api/marketplace/user-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to load user profile")
        return resData.user
    },

    async getSellerProducts(params: { seller_id: string; page?: number; limit?: number }) {
        const response = await fetch("/api/marketplace/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "get_seller_products",
                ...params,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to load seller products")
        return resData
    },
}
