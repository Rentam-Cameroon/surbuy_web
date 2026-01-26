"use client"

import { useKYCStore } from "@/store/useKYCStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { ShieldCheck, UserCheck, FileText, CheckCircle, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DocumentUpload from "./steps/DocumentUpload"
import LiveSelfie from "./steps/LiveSelfie"
import TaxDocument from "./steps/TaxDocument"

export default function KYCPage() {
    const { tier, setTier, idFront, idBack, selfieFile, taxFile } = useKYCStore()
    const [currentStep, setCurrentStep] = useState(1) // 1: ID, 2: Selfie, 3: Tax, 4: Success
    const router = useRouter()

    const handleNext = () => {
        if (currentStep === 1) {
            setCurrentStep(2)
        } else if (currentStep === 2) {
            setCurrentStep(3)
        } else if (currentStep === 3) {
            // Tax document is optional/handled in the component
            setCurrentStep(4)
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <DocumentUpload />
            case 2:
                return <LiveSelfie />
            case 3:
                return <TaxDocument onComplete={() => setCurrentStep(4)} />
            case 4:
                return (
                    <div className="text-center space-y-6 py-8">
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-green-100 p-4 rounded-full"
                            >
                                <CheckCircle className="h-16 w-16 text-green-600" />
                            </motion.div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Verification Submitted</h2>
                            <p className="text-muted-foreground">Your verification is being processed. You'll be redirected to the sell dashboard shortly.</p>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    useEffect(() => {
        if (currentStep === 4) {
            const timer = setTimeout(() => {
                router.push("/sell")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [currentStep, router])

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="rounded-full"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-bold text-primary">Seller Verification</h1>
                    </div>
                    {currentStep < 4 && (
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Step {currentStep} of 3
                        </div>
                    )}
                </div>

                <Card className="glass shadow-xl overflow-hidden">
                    <CardContent className="p-0 min-h-[450px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <div key={currentStep} className="p-6 md:p-10">
                                {renderCurrentStep()}
                            </div>
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {currentStep > 1 && currentStep < 3 && (
                    <div className="flex justify-between">
                        <Button variant="outline" className="rounded-xl px-8" onClick={() => setCurrentStep(currentStep - 1)}>
                            Back
                        </Button>
                        <Button className="rounded-xl px-8 font-bold" onClick={handleNext}>
                            Continue
                        </Button>
                    </div>
                )}
                {currentStep === 1 && (
                    <div className="flex justify-end">
                        <Button className="rounded-xl px-8 font-bold" onClick={handleNext}>
                            Continue
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
