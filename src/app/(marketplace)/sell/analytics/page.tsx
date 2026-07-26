"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, ShoppingBag, Star, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function AnalyticsPage() {
    const router = useRouter()

    const stats = [
        { label: "Total Earnings", value: "0 XAF", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
        { label: "Product Views", value: "0", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Sales", value: "0", icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Trust Score", value: "N/A", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
    ]

    return (
        <div className="min-h-screen bg-background pb-32">
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
                </div>
            </header>

            <main className="max-w-screen-md mx-auto p-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="border-none shadow-sm bg-muted/20">
                            <CardContent className="p-4 space-y-3">
                                <div className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-black">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="p-8 rounded-[32px] bg-muted/10 border border-dashed border-border/60 flex flex-col items-center text-center space-y-4">
                    <BarChart3 className="h-12 w-12 text-muted-foreground/30" />
                    <div className="space-y-1">
                        <h3 className="font-bold">Not enough data</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                            Publish more listings and start selling to see your growth trends here.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
