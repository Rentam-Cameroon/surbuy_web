"use client"

import { useEffect } from "react"

export default function RegisterServiceWorker() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return

        const register = async () => {
            try {
                await navigator.serviceWorker.register("/sw.js")
            } catch {
                // Ignore registration errors to avoid breaking app load
            }
        }

        if (document.readyState === "complete") {
            register()
        } else {
            window.addEventListener("load", register, { once: true })
            return () => window.removeEventListener("load", register)
        }
    }, [])

    return null
}
