"use client"

import { Home, Search, FilePlus, User } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function FloatingNavbar() {
    const router = useRouter()
    const pathname = usePathname()

    const navItems = [
        { icon: Home, label: "Home", path: "/dashboard" },
        { icon: FilePlus, label: "Request", path: "/request" },
        { icon: Search, label: "Search", path: "/search" },
        { icon: User, label: "Profile", path: "/profile" },
    ]

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-full p-2 px-6 pointer-events-auto ring-1 ring-black/5 dark:bg-zinc-900/80 dark:border-zinc-800">
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
