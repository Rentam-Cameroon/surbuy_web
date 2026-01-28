"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import KYCOverlay from "@/components/marketplace/KYCOverlay"
import { useAuthStore } from "@/store/useAuthStore"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"

export default function SellLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { isAuthenticated, isLoading } = useAuthStore()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/register")
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CupertinoActivityIndicator size={28} />
            </div>
        )
    }

    return (
        <>
            <KYCOverlay />
            {children}
        </>
    )
}
