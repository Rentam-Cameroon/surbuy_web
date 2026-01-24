"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button" // Assuming this exists
import { MessageCircle, ShieldAlert, Send, X } from "lucide-react"

interface ChatActionProps {
    sellerName: string
}

export default function ChatAction({ sellerName }: ChatActionProps) {
    const [status, setStatus] = useState<"initial" | "safety_check" | "ready">("initial")
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

    const presetMessages = [
        "Is this still available?",
        "Is the price negotiable?",
        "Can I see more photos?",
        "Where are you located?"
    ]

    const handleInitialClick = (message?: string) => {
        if (message) setSelectedPreset(message)
        setStatus("safety_check")
    }

    const handleCancel = () => {
        setStatus("initial")
        setSelectedPreset(null)
    }

    const handleConfirm = () => {
        // Here you would typically trigger the API call to send the first message
        console.log(`Sending message: ${selectedPreset || "Hi, is this available?"}`)
        setStatus("ready")
    }

    const goToConversation = () => {
        // Router push to conversation
        console.log("Navigating to conversation...")
    }

    return (
        <div className="space-y-4">
            {status === "initial" && (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {presetMessages.map((msg) => (
                            <button
                                key={msg}
                                onClick={() => handleInitialClick(msg)}
                                className="text-sm px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors text-secondary-foreground border border-border"
                            >
                                {msg}
                            </button>
                        ))}
                    </div>
                    <Button
                        onClick={() => handleInitialClick()}
                        className="w-full h-11 text-base gap-2 shadow-lg hover:shadow-xl transition-all"
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
                        Message sent to {sellerName}!
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
