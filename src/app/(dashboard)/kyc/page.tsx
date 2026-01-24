"use client"

import { useKYCStore } from "@/store/useKYCStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { ShieldCheck, UserCheck, FileText, CheckCircle } from "lucide-react"
import { useState } from "react"
import DocumentUpload from "./steps/DocumentUpload"
import LiveSelfie from "./steps/LiveSelfie"
import TaxDocument from "./steps/TaxDocument"

export default function KYCPage() {
    const { tier, setTier, reset } = useKYCStore()
    const [currentStep, setCurrentStep] = useState(0) // 0: Tier Select, 1: ID, 2: Selfie, 3: Tax (if Tier 2), 4: Success, 5: Failed

    const steps = [
        { id: 'tier', title: 'Tier Selection' },
        { id: 'id', title: 'Identity' },
        { id: 'selfie', title: 'Liveness' },
        ...(tier === 2 ? [{ id: 'tax', title: 'Address' }] : []),
        { id: 'review', title: 'Review' }
    ]

    const handleNext = () => {
        if (currentStep === 0) {
            // Tier selected via buttons
            setCurrentStep(1)
        } else {
            if (tier === 1 && currentStep === 2) {
                // End of Tier 1
                setCurrentStep(4)
            } else if (tier === 2 && currentStep === 3) {
                // End of Tier 2
                setCurrentStep(4)
            } else {
                setCurrentStep(prev => prev + 1)
            }
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold">Verify your Identity</h2>
                            <p className="text-muted-foreground">Unlock selling features by verifying your account.</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="cursor-pointer hover:border-primary transition-all border-2 border-transparent" onClick={() => { setTier(1); setCurrentStep(1); }}>
                                <CardContent className="p-6 flex flex-col items-center gap-4">
                                    <UserCheck className="h-12 w-12 text-yellow-500" />
                                    <div className="text-center">
                                        <h3 className="font-bold text-lg">Yellow Badge (Tier 1)</h3>
                                        <p className="text-sm text-muted-foreground">For casual sellers</p>
                                    </div>
                                    <ul className="text-sm space-y-1 text-left list-disc list-inside text-muted-foreground">
                                        <li>Upload ID</li>
                                        <li>Liveness Check</li>
                                        <li>Limit: 500,000 XAF/mo</li>
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card className="cursor-pointer hover:border-green-500 transition-all border-2 border-transparent" onClick={() => { setTier(2); setCurrentStep(1); }}>
                                <CardContent className="p-6 flex flex-col items-center gap-4">
                                    <ShieldCheck className="h-12 w-12 text-green-500" />
                                    <div className="text-center">
                                        <h3 className="font-bold text-lg">Green Badge (Tier 2)</h3>
                                        <p className="text-sm text-muted-foreground">For pro sellers</p>
                                    </div>
                                    <ul className="text-sm space-y-1 text-left list-disc list-inside text-muted-foreground">
                                        <li>All Tier 1 requirements</li>
                                        <li>Utility Bill / Tax Doc</li>
                                        <li>No selling limits</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )
            case 1:
                return <DocumentUpload />
            case 2:
                return <LiveSelfie />
            case 3:
                return <TaxDocument />
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
                            <p className="text-muted-foreground">Our team will review your documents shortly.</p>
                        </div>
                        <Button onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</Button>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex justify-between items-center px-2">
                    <h1 className="text-xl font-bold text-primary">KYC Center</h1>
                    {currentStep > 0 && currentStep < 4 && (
                        <div className="text-sm text-muted-foreground">
                            Step {currentStep} of {tier === 1 ? 2 : 3}
                        </div>
                    )}
                </div>

                <Card className="glass shadow-xl">
                    <CardContent className="p-6 md:p-10 min-h-[400px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {renderCurrentStep()}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {currentStep > 0 && currentStep < 4 && (
                    <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>
                            Back
                        </Button>
                        <Button onClick={handleNext}>
                            Continue
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
