"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button" // Assuming this exists
import { MessageCircle, ShieldAlert, Send, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { chatService } from "@/lib/chatService"
import { useRouter } from "next/navigation"

interface ChatActionProps {
    sellerName: string
    productId: string
    existingConversationId?: string | null
    disabled?: boolean
}

export default function ChatAction({ sellerName, productId, existingConversationId, disabled = false }: ChatActionProps) {
    const router = useRouter()
    const [status, setStatus] = useState<"initial" | "safety_check" | "ready">("initial")
    const [messageText, setMessageText] = useState("")
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [isSending, setIsSending] = useState(false)
    const [existingConversation, setExistingConversation] = useState(false)

    const suggestedMessages = [
        "Is this still available, how much?",
        "Is the price negotiable?"
    ]

    useEffect(() => {
        if (existingConversationId) {
            setConversationId(existingConversationId)
            setStatus("ready")
            setExistingConversation(true)
        }
    }, [existingConversationId])

    const handleCancel = () => {
        setStatus("initial")
    }

    const handleConfirm = async () => {
        if (!messageText.trim()) return
        try {
            setIsSending(true)
            let convoId = conversationId
            if (!convoId) {
                const convo = await chatService.startConversation({ product_id: productId })
                convoId = convo.id
                setConversationId(convo.id)
            }
            await chatService.sendMessage({
                conversation_id: convoId!,
                message_text: messageText.trim()
            })
            setStatus("ready")
            setExistingConversation(false)
        } catch (err) {
            console.error("Failed to send message:", err)
        } finally {
            setIsSending(false)
        }
    }

    const goToConversation = () => {
        if (!conversationId) return
        router.push(`/messages/${conversationId}`)
    }

    return (
        <div className="space-y-4">
            {status === "initial" && (
                <div className="space-y-4">
                    <div className="space-y-3">
                        <Input
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="rounded-xl h-11 bg-muted/40 border-border/40"
                            disabled={disabled}
                        />
                        <div className="flex flex-wrap gap-2">
                            {suggestedMessages.map((msg) => (
                                <button
                                    key={msg}
                                    onClick={() => !disabled && setMessageText(msg)}
                                    className="text-sm px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors text-secondary-foreground border border-border"
                                    disabled={disabled}
                                >
                                    {msg}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button
                        onClick={() => setStatus("safety_check")}
                        className="w-full h-11 text-base gap-2 shadow-lg hover:shadow-xl transition-all"
                        disabled={!messageText.trim() || isSending || disabled}
                    >
                        <Send className="w-4 h-4" />
                        Send Seller a Message
                    </Button>
                </div>
            )}

            {status === "ready" && (
                <div className="space-y-2">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {existingConversation ? `Continue conversation with ${sellerName}!` : `Message sent to ${sellerName}!`}
                    </div>
                    <Button
                        onClick={goToConversation}
                        className="w-full h-11 text-base gap-2 bg-primary hover:bg-primary/90"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Go to Conversation
                    </Button>
                </div>
            )}

            {/* Safety Dialog */}
            <AnimatePresence>
                {status === "safety_check" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCancel}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md bg-background rounded-xl shadow-2xl overflow-hidden border border-border"
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full text-red-600 dark:text-red-400">
                                        <ShieldAlert className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold">Safety Warning</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Please read this carefully to avoid scams.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-2 text-foreground/80">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li><strong>Never</strong> send money before seeing the item.</li>
                                        <li>Meet in public places (malls, police stations).</li>
                                        <li>Check the item thoroughly before paying.</li>
                                        <li>Report suspicious behavior immediately.</li>
                                    </ul>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleConfirm}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                        disabled={isSending}
                                    >
                                        Read & Understood
                                    </Button>
                                </div>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
