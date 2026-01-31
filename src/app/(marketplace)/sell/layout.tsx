"use client"

import KYCOverlay from "@/components/marketplace/KYCOverlay"
import { useAuthStore } from "@/store/useAuthStore"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import AuthRequiredState from "@/components/common/AuthRequiredState"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"

export default function SellLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, isLoading } = useAuthStore()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CupertinoActivityIndicator size={28} />
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <>
                <AuthRequiredState
                    title="Login Required"
                    description="You need to login to access the sell section."
                />
                <FloatingNavbar />
            </>
        )
    }

    return (
        <>
            <KYCOverlay />
            {children}
        </>
    )
}
