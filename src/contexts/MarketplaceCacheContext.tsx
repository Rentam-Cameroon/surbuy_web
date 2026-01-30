"use client"

import React, { createContext, useCallback, useContext, useState } from "react"

interface CacheEntry {
    data: any
    timestamp: number
}

interface MarketplaceCacheContextType {
    getCache: (key: string) => any | null
    setCache: (key: string, data: any) => void
    invalidateCache: (key?: string) => void
    isCacheValid: (key: string) => boolean
}

const MarketplaceCacheContext = createContext<MarketplaceCacheContextType | undefined>(undefined)

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function MarketplaceCacheProvider({ children }: { children: React.ReactNode }) {
    const [cache, setCache] = useState<Record<string, CacheEntry>>({})

    const getCache = useCallback(
        (key: string) => {
            const entry = cache[key]
            if (!entry) return null
            const isValid = Date.now() - entry.timestamp < CACHE_DURATION
            return isValid ? entry.data : null
        },
        [cache]
    )

    const setCacheEntry = useCallback((key: string, data: any) => {
        setCache((prev) => ({
            ...prev,
            [key]: { data, timestamp: Date.now() },
        }))
    }, [])

    const invalidateCache = useCallback((key?: string) => {
        if (!key) {
            setCache({})
            return
        }
        setCache((prev) => {
            const next = { ...prev }
            delete next[key]
            return next
        })
    }, [])

    const isCacheValid = useCallback(
        (key: string) => {
            const entry = cache[key]
            if (!entry) return false
            return Date.now() - entry.timestamp < CACHE_DURATION
        },
        [cache]
    )

    return (
        <MarketplaceCacheContext.Provider
            value={{
                getCache,
                setCache: setCacheEntry,
                invalidateCache,
                isCacheValid,
            }}
        >
            {children}
        </MarketplaceCacheContext.Provider>
    )
}

export function useMarketplaceCache() {
    const context = useContext(MarketplaceCacheContext)
    if (!context) {
        throw new Error("useMarketplaceCache must be used within MarketplaceCacheProvider")
    }
    return context
}
