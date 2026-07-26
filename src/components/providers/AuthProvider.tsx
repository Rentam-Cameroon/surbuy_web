"use client"

import { useEffect, ReactNode } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { pushService } from "@/lib/pushService"

export function AuthProvider({ children }: { children: ReactNode }) {
    const { init, isAuthenticated } = useAuthStore()

    useEffect(() => {
        init()
    }, [init])

    useEffect(() => {
        if (isAuthenticated) {
            pushService.registerDevice()
        }
    }, [isAuthenticated])

    return <>{children}</>
}
