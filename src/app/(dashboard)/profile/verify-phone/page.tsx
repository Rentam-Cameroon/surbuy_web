"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerifyPhonePage() {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1: Send OTP, 2: Enter OTP
    const [otp, setOtp] = useState("")

    const handleSendOTP = () => {
        setStep(2)
    }

    const handleVerify = () => {
        // Simulate verification success
        router.push("/profile")
    }

    return (
        <div className="pb-12 pt-6 min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 space-y-8">
                <header className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Phone Verification</h1>
                        <p className="text-muted-foreground text-sm">Secure your account with 2FA</p>
                    </div>
                </header>

                <div className="bg-primary/5 rounded-3xl p-8 flex flex-col items-center text-center space-y-4 border border-primary/10">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <Phone className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">
                        {step === 1 ? "Verify your number" : "Enter Verification Code"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {step === 1
                            ? "We'll send a 6-digit code to your phone number +237 670 000 000"
                            : "Sent to +237 670 000 000"}
                    </p>
                </div>

                {step === 1 ? (
                    <div className="space-y-6">
                        <Button onClick={handleSendOTP} className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg">
                            Get Reset Code
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            Standard SMS rates may apply
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2 text-center">
                            <Label htmlFor="otp" className="sr-only">Verification Code</Label>
                            <Input
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="0 0 0 0 0 0"
                                className="text-center text-2xl h-16 tracking-[1em] font-bold rounded-2xl border-2 focus-visible:ring-primary"
                                maxLength={6}
                            />
                        </div>
                        <Button onClick={handleVerify} className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            Verify & Continue
                        </Button>
                        <button
                            className="w-full text-center text-sm font-semibold text-primary hover:underline"
                            onClick={() => setStep(1)}
                        >
                            Resend Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
