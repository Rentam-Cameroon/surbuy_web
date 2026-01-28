"use client"

import { useRegistrationStore } from "@/store/useRegistrationStore"
import { AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import StepPhoneVerification from "./steps/StepPhoneVerification"
import StepBasicInfo from "./steps/StepBasicInfo"
import StepProfile from "./steps/StepProfile"
import StepEmailVerification from "./steps/StepEmailVerification"
import StepPassword from "./steps/StepPassword"
import StepChoice from "./steps/StepChoice"
import Link from "next/link"

export default function RegisterPage() {
    const { step } = useRegistrationStore()

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-4">
                {/* Branding Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary tracking-widest">SURBUY</h2>
                </div>

                <Card className="border-none shadow-none bg-background">
                    <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && <StepPhoneVerification key="step1" />}
                            {step === 2 && <StepBasicInfo key="step2" />}
                            {step === 3 && <StepProfile key="step3" />}
                            {step === 4 && <StepEmailVerification key="step4" />}
                            {step === 5 && <StepPassword key="step5" />}
                            {step === 6 && <StepChoice key="step6" />}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Use dots for step progress */}
                {step < 6 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all ${step >= i ? "w-4 bg-primary" : "w-2 bg-muted-foreground/30"}`}
                            />
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <Link
                        href="/marketplace"
                        className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                        Skip for now
                    </Link>
                </div>
            </div>
        </main>
    )
}
