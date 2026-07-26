"use client"

import React, { createContext, useCallback, useContext, useState, useRef } from "react"

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
    const cacheRef = useRef<Record<string, CacheEntry>>({})
    const [, setVersion] = useState(0)

    const getEntry = useCallback((key: string) => {
        return cacheRef.current[key] || null
    }, [])

    const setEntry = useCallback((key: string, data: any) => {
        cacheRef.current[key] = { data, timestamp: Date.now() }
        setVersion(v => v + 1)
    }, [])

    const invalidate = useCallback((key?: string) => {
        if (!key) {
            cacheRef.current = {}
        } else {
            delete cacheRef.current[key]
        }
        setVersion(v => v + 1)
    }, [])

    const invalidatePrefix = useCallback((prefix: string) => {
        Object.keys(cacheRef.current).forEach((key) => {
            if (key.startsWith(prefix)) delete cacheRef.current[key]
        })
        setVersion(v => v + 1)
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
