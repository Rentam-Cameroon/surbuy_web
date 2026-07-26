"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    MoreVertical,
    Image as ImageIcon,
    Send,
    ShoppingCart,
    FileText,
    CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { chatService } from "@/lib/chatService"
import { marketplaceService } from "@/lib/marketplaceService"
import { useAuthStore } from "@/store/useAuthStore"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { supabase } from "@/lib/supabase"
import AuthRequiredState from "@/components/common/AuthRequiredState"
import { useI18n } from "@/contexts/I18nContext"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"

export default function ChatDetailPage() {
    const params = useParams()
    const router = useRouter()
    const scrollRef = useRef<HTMLDivElement>(null)
    const { user, isLoading: isAuthLoading } = useAuthStore()
    const { t } = useI18n()

    const convId = params.id as string
    const [conversation, setConversation] = useState<any | null>(null)
    const [otherUser, setOtherUser] = useState<any | null>(null)
    const [context, setContext] = useState<any | null>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        const loadConversation = async () => {
            try {
                setIsLoading(true)
                const convoRes = await chatService.getConversation(convId)
                const data = convoRes?.conversation
                const other = convoRes?.other_user
                if (!data) {
                    setConversation(null)
                    return
                }

                setConversation(data)
                if (other) {
                    setOtherUser(other)
                }

                if (data.product_id) {
                    const product = await marketplaceService.getProduct(data.product_id)
                    setContext({
                        type: "product",
                        title: product.title,
                        price: product.price,
                        id: product.id
                    })
                } else if (data.request_id) {
                    const { data: request } = await supabase
                        .from("requests")
                        .select("id, title, max_budget")
                        .eq("id", data.request_id)
                        .single()
                    if (request) {
                        setContext({
                            type: "request",
                            title: request.title,
                            price: request.max_budget
                        })
                    }
                }
            } catch (err) {
                console.error("Failed to load conversation:", err)
            } finally {
                setIsLoading(false)
            }
        }

        if (convId && user?.id) {
            loadConversation()
        }
    }, [convId, user?.id])

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const data = await chatService.getMessages(convId)
                setMessages(data || [])
            } catch (err) {
                console.error("Failed to load messages:", err)
            }
        }

        if (convId && user?.id) {
            loadMessages()
        }
    }, [convId, user?.id])

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | null = null
        let isFetching = false

        const pollMessages = async () => {
            if (!convId || !user?.id || isFetching) return
            isFetching = true
            try {
                const data = await chatService.getMessages(convId)
                setMessages((prev) => {
                    const prevIds = new Set(prev.map((m) => m.id))
                    const merged = [...prev]
                    data.forEach((m: any) => {
                        if (!prevIds.has(m.id)) {
                            merged.push(m)
                        }
                    })
                    return merged
                })
            } catch (err) {
                console.error("Polling messages failed:", err)
            } finally {
                isFetching = false
            }
        }

        if (convId && user?.id) {
            intervalId = setInterval(pollMessages, 3000)
        }

        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [convId, user?.id])

    useEffect(() => {
        if (convId && user?.id) {
            chatService.markRead(convId).catch(() => { })
        }
    }, [convId, user?.id])

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CupertinoActivityIndicator size={28} />
            </div>
        )
    }

    if (!user) {
        return (
            <>
                <AuthRequiredState
                    title="Login Required"
                    description="Login to view this conversation."
                />
                <FloatingNavbar />
            </>
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-col h-screen bg-background max-w-screen-md mx-auto border-x border-border/40">
                <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 p-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full shrink-0">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <CupertinoActivityIndicator size={28} />
                </div>
            </div>
        )
    }

    if (!conversation) return <div>{t("Conversation not found")}</div>

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return
        const optimisticId = `temp-${Date.now()}`
        const optimisticMessage = {
            id: optimisticId,
            sender_id: user?.id,
            message_text: newMessage.trim(),
            created_at: new Date().toISOString(),
            is_read: false,
            is_pending: true
        }

        setMessages((prev) => [...prev, optimisticMessage])
        setNewMessage("")

        try {
            const sent = await chatService.sendMessage({
                conversation_id: convId,
                message_text: optimisticMessage.message_text
            })
            setMessages((prev) =>
                prev.map((m) => (m.id === optimisticId ? { ...sent, is_pending: false } : m))
            )
        } catch (err) {
            console.error("Failed to send message:", err)
            setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
        }
    }

    return (
        <div className="flex flex-col h-screen bg-background max-w-screen-md mx-auto border-x border-border/40">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 p-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 ring-1 ring-border/50">
                            <AvatarImage src={otherUser?.profile_image_url || ""} />
                            <AvatarFallback>
                                {(otherUser?.full_name || "U")
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h2 className="font-bold text-sm truncate">{otherUser?.full_name || "User"}</h2>
                            <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                Online
                            </span>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>

                {/* Context Sub-header */}
                <div
                    className="mt-3 bg-muted/30 rounded-2xl p-3 flex items-center justify-between border border-border/40 group hover:border-primary/20 transition-colors"
                    onClick={() => {
                        if (context?.type === "product" && context.id) {
                            router.push(`/marketplace/product/${context.id}`)
                        }
                    }}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-10 w-10 rounded-xl bg-background border border-border/40 flex items-center justify-center shrink-0">
                            {context?.type === "product" ? (
                                <ShoppingCart className="h-5 w-5 text-primary" />
                            ) : (
                                <FileText className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {t((context?.type || "product"))} {t("Inquiry")}
                            </p>
                            <h3 className="text-xs font-bold truncate">{context?.title || "Item"}</h3>
                        </div>
                    </div>
                    {context?.price && (
                        <div className="text-right shrink-0 ml-2">
                            <p className="text-sm font-black text-primary">
                                {Number(context.price).toLocaleString()} <span className="text-[10px]">XAF</span>
                            </p>
                        </div>
                    )}
                </div>
            </header>

            {/* Messages Area */}
            <main
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar scroll-smooth"
            >
                <div className="text-center py-6">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest bg-muted/40 inline-block px-3 py-1 rounded-full">
                        {t("Conversation Started")} • {new Date(conversation.created_at).toLocaleDateString()}
                    </p>
                </div>

                {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id
                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex flex-col max-w-[80%]",
                                isMe ? "ml-auto items-end" : "mr-auto items-start"
                            )}
                        >
                            <div className={cn(
                                "p-3.5 px-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                                isMe
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-muted/60 text-foreground rounded-tl-none border border-border/20"
                            )}>
                                {msg.message_text}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                <span className="text-[10px] text-muted-foreground font-medium">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                {isMe && msg.is_pending && (
                                    <span className="text-[10px] text-muted-foreground font-medium">{t("Sending...")}</span>
                                )}
                                {isMe && (
                                    <CheckCircle2 className={cn("h-3 w-3", msg.is_read ? "text-primary" : "text-muted-foreground/40")} />
                                )}
                            </div>
                        </div>
                    )
                })}
            </main>

            {/* Input Bar */}
            <footer className="p-4 bg-background border-t border-border/40 pb-8">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 bg-muted/40 border border-border/40 rounded-3xl p-1.5 pl-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all"
                >
                    <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <ImageIcon className="h-5 w-5" />
                    </button>
                    <Input
                        placeholder={t("Type a message...")}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/60 h-10 font-medium"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className="rounded-full h-10 w-10 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </footer>
        </div>
    )
}
