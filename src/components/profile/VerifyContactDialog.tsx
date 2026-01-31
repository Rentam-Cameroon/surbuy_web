"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/lib/authService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { Mail, Phone, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"

interface VerifyContactDialogProps {
    isOpen: boolean
    onClose: () => void
    mode: 'phone' | 'email'
    value: string
    onSuccess: () => void
}

export default function VerifyContactDialog({
    isOpen,
    onClose,
    mode,
    value,
    onSuccess
}: VerifyContactDialogProps) {
    const { } = useAuthStore()
    const [step, setStep] = useState<'send' | 'verify'>('send')
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [countdown, setCountdown] = useState(0)

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen) {
            setStep('send')
            setOtp("")
            setError(null)
            setCountdown(0)
        }
    }, [isOpen])

    // Timer for countdown
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [countdown])

    const handleSendCode = async () => {
        setIsLoading(true)
        setError(null)
        try {
            if (mode === 'phone') {
                // Ensure proper formatting if needed
                await authService.dynamicTask({ phone: `+237${value.replace(/\s/g, '').replace(/^\+237/, '')}`, step: 'send_otp' })
            } else {
                await authService.dynamicTask({ email: value, step: 'send_otp' })
            }
            setStep('verify')
            setCountdown(60)
        } catch (err: any) {
            setError(err.message || "Failed to send verification code")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyCode = async () => {
        if (otp.length < 6) {
            setError("Please enter the 6-digit code")
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            if (mode === 'phone') {
                await authService.dynamicTask({
                    phone: `+237${value.replace(/\s/g, '').replace(/^\+237/, '')}`,
                    otp,
                    step: 'verify_otp'
                })
            } else {
                await authService.dynamicTask({
                    email: value,
                    otp,
                    step: 'verify_otp'
                })
            }
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message || "Invalid verification code")
        } finally {
            setIsLoading(false)
        }
    }

    const Icon = mode === 'phone' ? Phone : Mail
    const title = mode === 'phone' ? "Verify Phone Number" : "Verify Email Address"
    const description = step === 'send'
        ? `We will send a verification code to ${value}`
        : `Enter the code sent to ${value}`

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-3xl">
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {step === 'send' ? (
                        <div className="space-y-4">
                            <div className="bg-muted/30 p-4 rounded-xl text-center font-medium">
                                {value}
                            </div>
                            <Button onClick={handleSendCode} className="w-full h-12 rounded-xl text-lg font-bold" disabled={isLoading}>
                                {isLoading ? <CupertinoActivityIndicator size={20} color="white" /> : "Send Code"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <Input
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value)
                                        setError(null)
                                    }}
                                    placeholder="000000"
                                    className="text-center text-2xl h-14 tracking-[0.5em] font-bold w-48"
                                    maxLength={6}
                                    disabled={isLoading}
                                />
                            </div>

                            <Button onClick={handleVerifyCode} className="w-full h-12 rounded-xl text-lg font-bold" disabled={isLoading}>
                                {isLoading ? <CupertinoActivityIndicator size={20} color="white" /> : "Verify Code"}
                            </Button>

                            <div className="text-center text-sm">
                                {countdown > 0 ? (
                                    <span className="text-muted-foreground">Resend code in {countdown}s</span>
                                ) : (
                                    <button onClick={handleSendCode} className="text-primary hover:underline font-medium" disabled={isLoading}>
                                        Resend Code
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
