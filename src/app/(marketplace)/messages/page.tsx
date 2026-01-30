"use client"

import { useEffect, useMemo, useState } from "react"
import { Search as SearchIcon, MessageSquare, ChevronRight, SlidersHorizontal, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { marketplaceService } from "@/lib/marketplaceService"
import { useAuthStore } from "@/store/useAuthStore"
import { chatService } from "@/lib/chatService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"

export default function MessagesListPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [conversations, setConversations] = useState<any[]>([])
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadConversations = async () => {
            try {
                if (!user?.id) {
                    setConversations([])
                    setIsLoading(false)
                    return
                }
                const list = await chatService.listMyConversations("marketplace-messages")

                const enriched = await Promise.all(
                    list.map(async (conv: any) => {
                        let context: any = { type: "product", title: "Item", id: conv.product_id || null }
                        if (conv.product_id) {
                            const product = await marketplaceService.getProduct(conv.product_id)
                            context = { type: "product", title: product.title, price: product.price, id: product.id }
                        } else if (conv.request_id) {
                            context = { type: "request", title: "Request" }
                        }

                        const last = conv.last_message
                            ? {
                                created_at: new Date(conv.last_message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                is_read: conv.last_message.is_read,
                                sender_id: conv.last_message.sender_id,
                                text: conv.last_message.message_text
                            }
                            : {
                                created_at: "",
                                is_read: true,
                                sender_id: "",
                                text: "No messages yet"
                            }

                        return {
                            id: conv.id,
                            other_user: {
                                name: conv.other_user?.full_name || "User",
                                avatar: conv.other_user?.profile_image_url || "",
                                isOnline: false
                            },
                            context,
                            last_message: last
                        }
                    })
                )

                setConversations(enriched)
            } catch (err) {
                console.error("Failed to load conversations:", err)
                setConversations([])
            } finally {
                setIsLoading(false)
            }
        }

        loadConversations()
    }, [user?.id])

    const filteredConversations = useMemo(() => {
        const normalized = (value: string) => value.toLowerCase()
        return conversations
            .slice()
            .sort((a, b) => {
                const aDate = a.last_message?.created_at || a.created_at || ""
                const bDate = b.last_message?.created_at || b.created_at || ""
                return new Date(bDate).getTime() - new Date(aDate).getTime()
            })
            .filter((conv) =>
                normalized(conv.other_user.name).includes(normalized(searchQuery)) ||
                normalized(conv.context.title).includes(normalized(searchQuery))
            )
    }, [conversations, searchQuery])

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
                </div>

                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <SearchIcon className="h-4 w-4" />
                    </div>
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-muted/50 border-none rounded-full pl-10 h-10 transition-all font-medium"
                    />
                </div>
            </header>

            <main className="max-w-screen-md mx-auto">
                <div className="divide-y divide-border/40">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <CupertinoActivityIndicator size={32} />
                        </div>
                    ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => (
                            <Link
                                href={`/messages/${conv.id}`}
                                key={conv.id}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group relative"
                            >
                                <div className="relative shrink-0">
                                    <Avatar className="h-14 w-14 border-2 border-background shadow-sm ring-1 ring-border/50">
                                        <AvatarImage src={conv.other_user.avatar} />
                                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                            {conv.other_user.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {conv.other_user.isOnline && (
                                        <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className="font-bold text-[15px] truncate">{conv.other_user.name}</h3>
                                        <span className="text-[11px] text-muted-foreground font-medium">{conv.last_message.created_at}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-bold uppercase tracking-tight py-0 border-primary/20 bg-primary/5 text-primary">
                                            {conv.context.type}
                                        </Badge>
                                        <span className="text-[11px] text-muted-foreground truncate font-medium">
                                            {conv.context.title}
                                        </span>
                                    </div>

                                    <p className={cn(
                                        "text-sm truncate",
                                        conv.last_message.is_read ? "text-muted-foreground" : "text-foreground font-bold"
                                    )}>
                                        {conv.last_message.sender_id === user?.id && "You: "}
                                        {conv.last_message.text}
                                    </p>
                                </div>

                                {!conv.last_message.is_read && (
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                        <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm shadow-primary/40" />
                                    </div>
                                )}
                                <ChevronRight className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </Link>
                        ))
                    ) : (
                        <div className="py-20 text-center px-6">
                            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold">No messages yet</h3>
                            <p className="text-muted-foreground text-sm">When you start a conversation, it will appear here.</p>
                        </div>
                    )}
                </div>
            </main>

            <FloatingNavbar />
        </div>
    )
}
