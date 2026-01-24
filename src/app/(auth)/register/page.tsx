"use client"

import { useRegistrationStore } from "@/store/useRegistrationStore"
import { AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import StepBasicInfo from "./steps/StepBasicInfo"
import StepPhoneVerification from "./steps/StepPhoneVerification"
import StepProfile from "./steps/StepProfile"
import StepEmailVerification from "./steps/StepEmailVerification"
import StepChoice from "./steps/StepChoice"

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
                            {step === 1 && <StepBasicInfo key="step1" />}
                            {step === 2 && <StepPhoneVerification key="step2" />}
                            {step === 3 && <StepProfile key="step3" />}
                            {step === 4 && <StepEmailVerification key="step4" />}
                            {step === 5 && <StepChoice key="step5" />}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Use dots for step progress */}
                {step < 5 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all ${step >= i ? "w-4 bg-primary" : "w-2 bg-muted-foreground/30"}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
