"use client"

import { Home, Search, FilePlus, User, MessageSquare } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useI18n } from "@/contexts/I18nContext"

export default function FloatingNavbar() {
    const router = useRouter()
    const pathname = usePathname()
    const isSeller = pathname?.startsWith('/sell')
    const { t } = useI18n()

    const navItems = isSeller ? [
        { icon: Home, label: t("Home"), path: "/sell" },
        { icon: FilePlus, label: t("Request"), path: "/sell/requests" },
        { icon: MessageSquare, label: t("Messages"), path: "/sell/messages" },
        { icon: User, label: t("Profile"), path: "/sell/profile" },
    ] : [
        { icon: Home, label: t("Home"), path: "/marketplace" },
        { icon: FilePlus, label: t("Request"), path: "/request" },
        { icon: Search, label: t("Search"), path: "/search" },
        { icon: MessageSquare, label: t("Messages"), path: "/messages" },
        { icon: User, label: t("Profile"), path: "/profile" },
    ]

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className="flex items-center gap-1 bg-card/85 backdrop-blur-lg border border-border/60 shadow-2xl rounded-full p-2 px-6 pointer-events-auto ring-1 ring-border/40">
                {navItems.map((item) => {
                    const isActive = pathname === item.path
                    return (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.path)}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 group",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                            )}
                        >

                            <item.icon className={cn("h-5 w-5 mb-0.5 transition-transform duration-300 group-hover:scale-110", isActive && "scale-110")} />
                            <span className="text-[10px] font-medium leading-none">{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
