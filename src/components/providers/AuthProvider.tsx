"use client"

import { useEffect, ReactNode } from "react"
import { useAuthStore } from "@/store/useAuthStore"

export function AuthProvider({ children }: { children: ReactNode }) {
    const init = useAuthStore((state) => state.init)

    useEffect(() => {
        init()
    }, [init])

    return <>{children}</>
}
