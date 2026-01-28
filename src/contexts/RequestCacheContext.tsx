"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

interface RequestCache {
    requests: any[]
    timestamp: number
}

interface RequestCacheContextType {
    getRequests: () => any[] | null
    setRequests: (requests: any[]) => void
    invalidateCache: () => void
    isCacheValid: () => boolean
}

const RequestCacheContext = createContext<RequestCacheContextType | undefined>(undefined)

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function RequestCacheProvider({ children }: { children: React.ReactNode }) {
    const [cache, setCache] = useState<RequestCache | null>(null)

    const getRequests = useCallback(() => {
        if (!cache) return null
        const isValid = Date.now() - cache.timestamp < CACHE_DURATION
        return isValid ? cache.requests : null
    }, [cache])

    const setRequests = useCallback((requests: any[]) => {
        setCache({
            requests,
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
        <RequestCacheContext.Provider value={{ getRequests, setRequests, invalidateCache, isCacheValid }}>
            {children}
        </RequestCacheContext.Provider>
    )
}

export function useRequestCache() {
    const context = useContext(RequestCacheContext)
    if (!context) {
        throw new Error('useRequestCache must be used within RequestCacheProvider')
    }
    return context
}
