"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAppCache } from "@/contexts/AppCacheContext"

interface UseCachedDataOptions {
    ttlMs?: number
    enabled?: boolean
}

export function useCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: UseCachedDataOptions = {}
) {
    const { getEntry, setEntry } = useAppCache()
    const ttlMs = options.ttlMs ?? 5 * 60 * 1000
    const enabled = options.enabled ?? true
    const [data, setData] = useState<T | null>(() => {
        const entry = getEntry(key)
        return entry ? entry.data : null
    })
    const [isLoading, setIsLoading] = useState<boolean>(() => !getEntry(key))
    const inFlightRef = useRef(false)

    const isStale = useMemo(() => {
        const entry = getEntry(key)
        if (!entry) return true
        return Date.now() - entry.timestamp > ttlMs
    }, [getEntry, key, ttlMs])

    useEffect(() => {
        if (!enabled) return
        const entry = getEntry(key)
        if (entry) {
            setData(entry.data)
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }

        const load = async () => {
            if (inFlightRef.current) return
            inFlightRef.current = true
            try {
                const result = await fetcher()
                setEntry(key, result)
                setData(result)
            } finally {
                inFlightRef.current = false
                setIsLoading(false)
            }
        }

        if (!entry || isStale) {
            load()
        }
    }, [enabled, fetcher, getEntry, isStale, key, setEntry])

    const refresh = async () => {
        if (!enabled || inFlightRef.current) return
        inFlightRef.current = true
        try {
            const result = await fetcher()
            setEntry(key, result)
            setData(result)
        } finally {
            inFlightRef.current = false
        }
    }

    return { data, isLoading, refresh }
}
