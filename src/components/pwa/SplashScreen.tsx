"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-4"
            >
                <div className="relative w-48 h-48">
                    <Image
                        src="/surbuy-icon.png"
                        alt="Surbuy"
                        fill
                        className="object-contain logo-light"
                        priority
                    />
                    <Image
                        src="/surbuy-icon-dark.png"
                        alt="Surbuy"
                        fill
                        className="object-contain logo-dark"
                        priority
                    />
                </div>
            </motion.div>
        </div>
    )
}
