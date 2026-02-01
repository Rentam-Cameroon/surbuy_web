"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    ShoppingBag,
    FileText,
    PlusCircle,
    Bell,
    TrendingUp,
    Package,
    X
} from "lucide-react"
import Link from "next/link"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useI18n } from "@/contexts/I18nContext"

export default function SellDashboard() {
    const [showBanner, setShowBanner] = useState(true)
    const { t } = useI18n()

    const cards = [
        {
            title: t("My Products"),
            subtitle: t("Manage listings"),
            icon: Package,
            color: "bg-blue-500/10",
            iconColor: "text-blue-600",
            href: "/sell/my-products"
        },
        {
            title: t("Requests"),
            subtitle: t("Buyer needs"),
            icon: FileText,
            color: "bg-orange-500/10",
            iconColor: "text-orange-600",
            href: "/sell/requests"
        },
        {
            title: t("Add Product"),
            subtitle: t("Post new item"),
            icon: PlusCircle,
            color: "bg-primary/10",
            iconColor: "text-primary",
            href: "/sell/create"
        },
        {
            title: t("Analytics"),
            subtitle: t("View performance"),
            icon: TrendingUp,
            color: "bg-green-500/10",
            iconColor: "text-green-600",
            href: "/sell/analytics"
        }
    ]

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 px-4 py-3 h-14 flex items-center">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Image src="/surbuy-logo.png" alt="Surbuy Logo" width={110} height={28} className="logo-light w-24 h-auto" priority />
                        <Image src="/surbuy-logo-dark.png" alt="Surbuy Logo" width={110} height={28} className="logo-dark w-24 h-auto" priority />
                        <span className="text-sm font-bold tracking-widest text-primary font-mono italic mt-1">
                            SELL
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/marketplace">
                            <Button size="sm" className="rounded-full h-9 px-5 font-bold shadow-lg shadow-primary/20 gap-1.5 active:scale-95 transition-all">
                                <ShoppingBag className="h-4 w-4" />
                                Marketplace
                            </Button>
                        </Link>
                        <Link href="/notifications">
                            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-screen-md mx-auto p-6 space-y-8">
                {/* Encouragement Banner */}
                {showBanner && (
                    <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 relative overflow-hidden group">
                        <button
                            onClick={() => setShowBanner(false)}
                            className="absolute top-4 right-4 z-20 p-1 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <div className="relative z-10 space-y-2">
                            <h2 className="text-xl font-bold tracking-tight">{t("Ready to earn?")}</h2>
                            <p className="text-sm text-balance text-muted-foreground leading-relaxed max-w-[200px]">
                                {t("List your first item today and reach thousands of buyers.")}
                            </p>
                            <Link href="/sell/safety">
                                <Button variant="outline" className="mt-4 rounded-xl font-bold border-primary text-primary hover:bg-primary/5">
                                    {t("Read our guideline")}
                                </Button>
                            </Link>
                        </div>
                        <ShoppingBag className="absolute -bottom-6 -right-6 w-32 h-32 text-primary opacity-5 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    </div >
                )}

                {/* Sell Dashboard Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cards.map((card, idx) => (
                        <Link key={idx} href={card.href} className="block">
                            <Card className={cn(
                                "border-none shadow-none hover:opacity-80 transition-all active:scale-[0.98] h-full",
                                card.color
                            )}>
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center bg-white/50 backdrop-blur-sm", card.iconColor)}>
                                        <card.icon className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-sm leading-tight text-foreground">{card.title}</h3>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{card.subtitle}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>

            <FloatingNavbar />
        </div>
    )
}
