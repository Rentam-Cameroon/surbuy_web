"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

interface ProductCache {
    products: any[]
    timestamp: number
}

interface ProductCacheContextType {
    getProducts: () => any[] | null
    setProducts: (products: any[]) => void
    invalidateCache: () => void
    isCacheValid: () => boolean
}

const ProductCacheContext = createContext<ProductCacheContextType | undefined>(undefined)

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function ProductCacheProvider({ children }: { children: React.ReactNode }) {
    const [cache, setCache] = useState<ProductCache | null>(null)

    const getProducts = useCallback(() => {
        if (!cache) return null
        const isValid = Date.now() - cache.timestamp < CACHE_DURATION
        return isValid ? cache.products : null
    }, [cache])

    const setProducts = useCallback((products: any[]) => {
        setCache({
            products,
            timestamp: Date.now()
        })
    }, [])

    const invalidateCache = useCallback(() => {
        setCache(null)
    }, [])

    const isCacheValid = useCallback(() => {
        if (!cache) return false
        return Date.now() - cache.timestamp < CACHE_DURATION
    }, [cache])

    return (
        <ProductCacheContext.Provider value={{ getProducts, setProducts, invalidateCache, isCacheValid }}>
            {children}
        </ProductCacheContext.Provider>
    )
}

export function useProductCache() {
    const context = useContext(ProductCacheContext)
    if (!context) {
        throw new Error('useProductCache must be used within ProductCacheProvider')
    }
    return context
}
