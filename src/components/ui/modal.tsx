"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
    if (typeof document === "undefined") return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-background w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl pointer-events-auto border border-border/40"
                        >
                            <div className="p-6 md:p-8 space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                                    {description && (
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {description}
                                        </p>
                                    )}
                                </div>
                                <div className="pt-2">
                                    {children}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
