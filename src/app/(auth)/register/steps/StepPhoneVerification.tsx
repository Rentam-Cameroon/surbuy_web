"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRegistrationStore } from "@/store/useRegistrationStore"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { authService } from "@/lib/authService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { AlertCircle } from "lucide-react"

export default function StepPhoneVerification() {
    const {
        phone,
        phoneOtp,
        setPhone,
        setPhoneOtp,
        setStep,
        setRegistrationInfo,
        setPhoneVerified
    } = useRegistrationStore()

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
        // Validation: 9 digits, starts with 6
        const isValid = /^6[0-9]{8}$/.test(phone)
        if (!isValid) {
            setError("Please enter a valid Cameroon phone number (9 digits, starts with 6).")
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            const formattedPhone = `+237${phone}`
            // Step 1: Check user status via super-worker
            const userStatus = await authService.checkUser(formattedPhone)
            setRegistrationInfo(userStatus.exists, userStatus.reg_status)

            if (userStatus.exists && userStatus.reg_status === 'complete') {
                // If user is complete, skip OTP and go to password
                setPhoneVerified(true)
                setStep(5)
                return
            }

            // Step 2: Otherwise, send OTP via dynamic-task
            await authService.dynamicTask({ phone: formattedPhone, step: 'send_otp' })
            setCodeSent(true)
            setCountdown(60)
        } catch (err: any) {
            setError(err.message || 'Failed to send code')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async () => {
        if (!phoneOtp || phoneOtp.length < 6) {
            setError("Please enter the 6-digit verification code.")
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            const formattedPhone = `+237${phone}`
            await authService.dynamicTask({
                phone: formattedPhone,
                otp: phoneOtp,
                step: 'verify_otp'
            })
            setPhoneVerified(true)
            setStep(2)
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
                <h1 className="text-2xl font-bold tracking-tight">
                    {codeSent ? "OTP Verification" : "Secure Account"}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {codeSent
                        ? "Enter the code sent to your phone."
                        : "Add your phone so we can secure your account with a one-time code."}
                </p>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {!codeSent ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="flex gap-2">
                            <div className="flex items-center justify-center rounded-md border border-input bg-background px-3 font-mono text-sm text-muted-foreground">
                                +237
                            </div>
                            <Input
                                placeholder="6 xx xx xx xx"
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value)
                                    if (error) setError(null)
                                }}
                                className="text-lg tracking-widest h-12"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button className="min-w-[150px] h-12 rounded-xl" size="lg" onClick={handleSendCode} disabled={isLoading}>
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
                                value={phoneOtp}
                                onChange={(e) => {
                                    setPhoneOtp(e.target.value)
                                    if (error) setError(null)
                                }}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button className="min-w-[200px] h-12 rounded-xl" size="lg" onClick={handleVerify} disabled={isLoading}>
                                {isLoading ? <CupertinoActivityIndicator size={20} color="white" /> : "Verify & Continue"}
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
                            Wrong number? Change
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
