"use client"

import { Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import CategoryBar from "@/components/marketplace/CategoryBar"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import ProductSection from "@/components/marketplace/ProductSection"
import { MOCK_LISTINGS } from "@/lib/mockData"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { authService } from "@/lib/authService"

export default function Dashboard() {
    const router = useRouter()
    const [isCheckingKyc, setIsCheckingKyc] = useState(false)

    const handleSellClick = async () => {
        if (isCheckingKyc) return
        setIsCheckingKyc(true)
        try {
            const data = await authService.getUserKYCStatus()
            const isApproved = data.kyc_status === "approved" && (data.kyc_tier ?? 0) >= 1
            router.push(isApproved ? "/sell" : "/kyc")
        } catch (err) {
            router.push("/kyc")
        } finally {
            setIsCheckingKyc(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-28 md:pb-8">
            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
                <div className="container mx-auto py-3 space-y-4">
                    <div className="flex items-center px-4 justify-between h-10 relative">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img src="/icon.svg" alt="Surbuy Logo" className="h-8 w-8" />
                            <span className="text-xl font-bold tracking-widest text-primary font-mono italic">
                                SURBUY
                            </span>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleSellClick}
                                size="sm"
                                className="rounded-full h-9 px-5 font-bold shadow-lg shadow-primary/20 gap-1.5 active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Sell
                            </Button>
                            <Link href="/notifications">
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Categories */}
                    <CategoryBar />
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 space-y-10">
                <ProductSection
                    title="Newly Added"
                    listings={MOCK_LISTINGS.slice(0, 4)}
                    href="/view-all?title=Newly%20Added&type=new"
                />
                <ProductSection
                    title="Popular"
                    listings={MOCK_LISTINGS.slice(2, 6)}
                    href="/view-all?title=Popular"
                />
                <ProductSection
                    title="Recommended for you"
                    listings={MOCK_LISTINGS.slice(1, 5)}
                    href="/view-all?title=Recommended"
                />
            </main>

            {/* Floating Navbar */}
            <FloatingNavbar />
        </div>
    )
}
