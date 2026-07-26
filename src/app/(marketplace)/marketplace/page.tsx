"use client"

import { Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import CategoryBar from "@/components/marketplace/CategoryBar"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import ProductFeed from "@/components/marketplace/ProductFeed"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { authService } from "@/lib/authService"
import { useAuthStore } from "@/store/useAuthStore"
import { getUserIdFromCookie } from "@/lib/auth-utils"
import Image from "next/image"
import { useI18n } from "@/contexts/I18nContext"

export default function Dashboard() {
    const router = useRouter()
    const { user } = useAuthStore()
    const userId = user?.id || getUserIdFromCookie()
    const [isCheckingKyc, setIsCheckingKyc] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const { t } = useI18n()

    const handleSellClick = async () => {
        if (!user) {
            router.push("/register")
            return
        }

        if (isCheckingKyc) return
        setIsCheckingKyc(true)
        try {
            const data = await authService.getUserKYCStatus()
            const isApproved = data.kyc_status === "approved" && (data.kyc_tier ?? 0) >= 1
            router.push(isApproved ? "/sell" : "/kyc")
        } catch {
            router.push("/kyc")
        } finally {
            setIsCheckingKyc(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-8">
            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
                <div className="container mx-auto py-3 space-y-4">
                    <div className="flex items-center px-4 justify-between h-12 gap-4">
                        {/* Logo */}
                        <div className="flex items-center gap-2 shrink-0">
                            <Image src="/surbuy-logo.png" alt="Surbuy Logo" width={110} height={28} className="logo-light w-28 h-auto" priority />
                            <Image src="/surbuy-logo-dark.png" alt="Surbuy Logo" width={110} height={28} className="logo-dark w-28 h-auto" priority />
                        </div>

                        {/* Search Bar (Desktop) */}
                        <div className="hidden md:flex flex-1 max-w-md mx-auto">
                            <div
                                onClick={() => router.push('/search')}
                                className="w-full flex items-center gap-2 bg-muted/50 hover:bg-muted transition-colors rounded-full px-4 h-10 cursor-pointer text-muted-foreground"
                            >
                                <Plus className="w-4 h-4 opacity-0" /> {/* Spacer */}
                                <span className="text-sm font-medium flex-1 text-center">{t("Search marketplace...")}</span>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Mobile Search Icon */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden rounded-full h-9 w-9 text-foreground"
                                onClick={() => router.push('/search')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </Button>

                            <Link href="/notifications">
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                                </Button>
                            </Link>

                            <Button
                                onClick={handleSellClick}
                                size="sm"
                                className="rounded-full h-9 px-4 font-bold shadow-lg shadow-primary/20 gap-1.5 active:scale-95 transition-all ml-1"
                            >
                                <Plus className="w-4 h-4" />
                                {t("Sell")}
                            </Button>
                        </div>
                    </div>

                    {/* Categories */}
                    <CategoryBar selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tight">
                        {selectedCategory === 'all' ? t("Today's Picks") : t("Results")}
                    </h2>
                </div>

                <ProductFeed category={selectedCategory} userId={userId} />
            </main>

            {/* Floating Navbar */}
            <FloatingNavbar />
        </div>
    )
}
