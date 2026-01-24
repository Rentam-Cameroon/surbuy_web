"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, ShieldCheck, ShoppingBag, Store } from "lucide-react"

const slides = [
    {
        icon: ShoppingBag,
        title: "Welcome to Surbuy",
        description: "Cameroon's premium marketplace. Experience a new way to buy and sell with confidence.",
        color: "text-primary"
    },
    {
        icon: ShieldCheck,
        title: "100% Anti-Scam Protection",
        description: "Your money is safe with us. We hold payments in escrow and only release them when you are satisfied with the product.",
        color: "text-green-500"
    },
    {
        icon: Store,
        title: "Sell Your Items",
        description: "Do you own a shop or just have unused items? You are in the right place to reach thousands of buyers instantly.",
        color: "text-blue-500"
    }
]

export default function OnboardingPage() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const router = useRouter()

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1)
        }
    }

    const handleBack = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1)
        }
    }

    const completeOnboarding = () => {
        localStorage.setItem("hasSeenOnboarding", "true")
        router.push("/register")
    }

    return (
        <div className="min-h-screen bg-background flex flex-col justify-between p-6 overflow-hidden relative">
            <div className="flex justify-end pt-4">
                {currentSlide < slides.length - 1 && (
                    <Button variant="ghost" onClick={completeOnboarding} className="text-muted-foreground">
                        Skip
                    </Button>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-6 max-w-xs"
                    >
                        {/* Animated Icon */}
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className={`p-6 rounded-3xl bg-card border shadow-xl ${slides[currentSlide].color}`}
                        >
                            {slides[currentSlide].icon && (() => {
                                const Icon = slides[currentSlide].icon;
                                return <Icon className="w-20 h-20" />;
                            })()}
                        </motion.div>

                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight">{slides[currentSlide].title}</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">{slides[currentSlide].description}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="space-y-8">
                {/* Pagination Dots */}
                <div className="flex justify-center gap-2">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`}
                        />
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    {currentSlide > 0 && (
                        <Button variant="outline" size="lg" className="flex-1" onClick={handleBack}>
                            Back
                        </Button>
                    )}

                    {currentSlide < slides.length - 1 ? (
                        <Button size="lg" className={`flex-1 ${currentSlide === 0 ? "w-full" : ""}`} onClick={handleNext}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button size="lg" className="flex-1" onClick={completeOnboarding}>
                            Get Started
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
