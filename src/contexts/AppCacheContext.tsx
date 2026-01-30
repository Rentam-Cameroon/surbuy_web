"use client"

import React, { createContext, useCallback, useContext, useState } from "react"

interface CacheEntry {
    data: any
    timestamp: number
}

interface AppCacheContextType {
    getEntry: (key: string) => CacheEntry | null
    setEntry: (key: string, data: any) => void
    invalidate: (key?: string) => void
    invalidatePrefix: (prefix: string) => void
}

const AppCacheContext = createContext<AppCacheContextType | undefined>(undefined)

export function AppCacheProvider({ children }: { children: React.ReactNode }) {
    const [cache, setCache] = useState<Record<string, CacheEntry>>({})

    const getEntry = useCallback(
        (key: string) => {
            return cache[key] || null
        },
        [cache]
    )

    const setEntry = useCallback((key: string, data: any) => {
        setCache((prev) => ({
            ...prev,
            [key]: { data, timestamp: Date.now() },
        }))
    }, [])

    const invalidate = useCallback((key?: string) => {
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

    const invalidatePrefix = useCallback((prefix: string) => {
        setCache((prev) => {
            const next = { ...prev }
            Object.keys(next).forEach((key) => {
                if (key.startsWith(prefix)) delete next[key]
            })
            return next
        })
    }, [])

    return (
        <AppCacheContext.Provider value={{ getEntry, setEntry, invalidate, invalidatePrefix }}>
            {children}
        </AppCacheContext.Provider>
    )
}

export function useAppCache() {
    const context = useContext(AppCacheContext)
    if (!context) {
        throw new Error("useAppCache must be used within AppCacheProvider")
    }
    return context
}
