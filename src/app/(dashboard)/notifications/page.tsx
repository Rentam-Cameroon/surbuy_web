"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Settings,
    Bell,
    MessageSquare,
    BadgeCheck,
    Clock,
    MoreHorizontal,
    ShoppingBag,
    Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import Link from "next/link"

export default function NotificationsPage() {
    const router = useRouter()
    const [notifications] = useState([
        {
            id: 1,
            type: "message",
            title: "New Message",
            description: "Sarah Kang sent you a message about the iPhone 15 Pro Max.",
            time: "2 mins ago",
            isRead: false,
            icon: MessageSquare,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-500/10"
        },
        {
            id: 2,
            type: "system",
            title: "Price Drop Alert",
            description: "An item in your wishlist has dropped in price!",
            time: "1 hour ago",
            isRead: false,
            icon: ShoppingBag,
            iconColor: "text-orange-500",
            iconBg: "bg-orange-500/10"
        },
        {
            id: 3,
            type: "verification",
            title: "Account Verified",
            description: "Congratulations! Your email address has been successfully verified.",
            time: "5 hours ago",
            isRead: true,
            icon: BadgeCheck,
            iconColor: "text-green-500",
            iconBg: "bg-green-500/10"
        },
        {
            id: 4,
            type: "promotion",
            title: "Weekend Deals",
            description: "Check out the top trending items this weekend in Douala.",
            time: "1 day ago",
            isRead: true,
            icon: Star,
            iconColor: "text-purple-500",
            iconBg: "bg-purple-500/10"
        }
    ])

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
                    </div>
                    <Link href="/profile/notifications">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Settings className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-3">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <Card
                            key={notif.id}
                            className={cn(
                                "border-border/40 shadow-none transition-all active:scale-[0.98]",
                                !notif.isRead ? "bg-muted/30 border-primary/10" : "bg-transparent"
                            )}
                        >
                            <CardContent className="p-4 flex gap-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                                    notif.iconBg
                                )}>
                                    <notif.icon className={cn("h-6 w-6", notif.iconColor)} />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className={cn(
                                            "text-[15px] truncate",
                                            !notif.isRead ? "font-bold" : "font-semibold text-muted-foreground"
                                        )}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-[11px] text-muted-foreground shrink-0">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-balance text-muted-foreground leading-relaxed">
                                        {notif.description}
                                    </p>
                                </div>
                                {!notif.isRead && (
                                    <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <Bell className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold">All caught up!</h3>
                            <p className="text-muted-foreground text-sm">No new notifications at the moment.</p>
                        </div>
                    </div>
                )}
            </main>

            <FloatingNavbar />
        </div>
    )
}
