"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRegistrationStore } from "@/store/useRegistrationStore"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowLeft, Mail, AlertCircle } from "lucide-react"
import { authService } from "@/lib/authService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"

export default function StepEmailVerification() {
    const { email, emailOtp, setEmail, setEmailOtp, setStep, setEmailVerified } = useRegistrationStore()
    const [codeSent, setCodeSent] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [countdown])

    const handleSendCode = async () => {
        if (!email || !email.includes('@')) {
            setError("Please enter a valid email address.")
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            await authService.dynamicTask({ email, step: 'send_otp' })
            setCodeSent(true)
            setCountdown(60)
        } catch (err: any) {
            setError(err.message || 'Failed to send code')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async () => {
        if (!emailOtp || emailOtp.length < 6) {
            setError("Please enter the 6-digit verification code.")
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            await authService.dynamicTask({
                email,
                otp: emailOtp,
                step: 'verify_otp'
            })
            setEmailVerified(true)
            setStep(5)
        } catch (err: any) {
            setError(err.message || 'Invalid code')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2 text-center">
                <div className="flex justify-start mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep(3)}
                        className="p-0 h-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                    {codeSent ? "OTP Verification" : "Email Verification"}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {codeSent
                        ? "Check your inbox (and spam folder) for the code."
                        : "Verify your email to receive important account updates."}
                </p>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-xl flex items-center gap-2 text-left">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {!codeSent ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="flex gap-2 relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="example@gmail.com"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (error) setError(null)
                                }}
                                className="pl-10 h-12 rounded-xl"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex gap-3 justify-center pt-4">
                            <Button variant="outline" className="w-32 h-12 rounded-xl font-bold" onClick={() => setStep(5)} disabled={isLoading}>
                                Skip
                            </Button>
                            <Button className="w-32 h-12 rounded-xl font-bold" onClick={handleSendCode} disabled={isLoading}>
                                {isLoading ? <CupertinoActivityIndicator size={20} color="white" /> : "Send Code"}
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-center">
                            <Input
                                placeholder="000000"
                                className="w-48 text-center text-2xl tracking-[0.5em] h-14 font-bold"
                                maxLength={6}
                                value={emailOtp}
                                onChange={(e) => {
                                    setEmailOtp(e.target.value)
                                    if (error) setError(null)
                                }}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button className="min-w-[200px] h-12 rounded-xl font-bold" size="lg" onClick={handleVerify} disabled={isLoading}>
                                {isLoading ? <CupertinoActivityIndicator size={20} color="white" /> : "Verify & Finish"}
                            </Button>
                        </div>

                        <div className="text-center text-sm">
                            {countdown > 0 ? (
                                <span className="text-muted-foreground">Resend code in {countdown}s</span>
                            ) : (
                                <button onClick={handleSendCode} className="text-primary hover:underline font-medium" disabled={isLoading}>
                                    Resend Code
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => { setCodeSent(false); setError(null); }}
                            className="w-full text-xs text-muted-foreground hover:underline"
                            disabled={isLoading}
                        >
                            Wrong email? Change
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
