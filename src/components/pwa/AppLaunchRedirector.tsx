"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function AppLaunchRedirector() {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
        if (hasSeenOnboarding !== "true") return

        const launchedOnce = localStorage.getItem("hasLaunchedOnceAfterOnboarding")
        if (launchedOnce !== "true") {
            localStorage.setItem("hasLaunchedOnceAfterOnboarding", "true")
            return
        }
        if (pathname === "/") {
            router.replace("/marketplace")
        }
    }, [pathname, router])

    return null
}
