"use client"

import KYCOverlay from "@/components/marketplace/KYCOverlay"

export default function SellLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <KYCOverlay />
            {children}
        </>
    )
}
