import { getTokenFromCookie } from "./auth-utils"

export interface ProductData {
    title: string
    description: string
    category_id: string
    condition: string
    price: string | number
    location_city: string
    neighborhood?: string
    serial_number?: string
    has_receipt: boolean
    images?: Array<{ base64: string; ext: string }>
}

export const productService = {
    async createProduct(data: ProductData) {
        const token = getTokenFromCookie()
        const response = await fetch('/api/sell/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'create_product',
                token,
                ...data
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to create product')
        return resData
    },

    async listMyProducts() {
        const token = getTokenFromCookie()
        const response = await fetch('/api/sell/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'list_my_products',
                token
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to list products')
        return resData.products
    },

    async searchMyProducts(keyword: string) {
        const token = getTokenFromCookie()
        const response = await fetch('/api/sell/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'search_my_products',
                token,
                keyword
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to search products')
        return resData.products
    },

    async listCategories() {
        const response = await fetch('/api/sell/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'list_categories'
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to list categories')
        return resData.categories
    },

    async editProduct(productId: string, data: ProductData) {
        const token = getTokenFromCookie()
        const response = await fetch('/api/sell/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'edit_product',
                token,
                product_id: productId,
                ...data
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to edit product')
        return resData
    },

    async updateProductStatus(productId: string, status: 'sold' | 'deleted') {
        const token = getTokenFromCookie()
        const response = await fetch('/api/sell/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'update_product_status',
                token,
                product_id: productId,
                status
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to update product status')
        return resData
    },

    async getProduct(productId: string) {
        const token = getTokenFromCookie()
        const response = await fetch('/api/sell/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'get_product',
                token,
                product_id: productId
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to get product')
        return resData.product
    }
}
