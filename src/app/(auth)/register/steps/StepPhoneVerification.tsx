import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRegistrationStore } from "@/store/useRegistrationStore"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

import { ArrowLeft } from "lucide-react"

export default function StepPhoneVerification() {
    const { phone, phoneOtp, setPhone, setPhoneOtp, setStep } = useRegistrationStore()
    const [codeSent, setCodeSent] = useState(false)
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [countdown])

    const handleSendCode = () => {
        // Validation removed as requested
        // Simulate API call
        setCodeSent(true)
        setCountdown(60)
    }

    const handleVerify = () => {
        // Validation removed as requested
        setStep(2)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Secure Account</h1>
                <p className="text-muted-foreground text-sm">
                    {codeSent
                        ? "Enter the code sent to your phone."
                        : "Add your phone so we can secure your account with a one-time code."}
                </p>
            </div>

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
                                placeholder="6 12 34 56 78"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="text-lg tracking-widest"
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button className="min-w-[150px]" size="lg" onClick={handleSendCode}>
                                Send Code
                            </Button>
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                            Protecting your account starts here.
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-center">
                            <Input
                                placeholder="0000"
                                className="w-32 text-center text-2xl tracking-[0.5em]"
                                maxLength={4}
                                value={phoneOtp}
                                onChange={(e) => setPhoneOtp(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button className="min-w-[200px]" size="lg" onClick={handleVerify}>
                                Verify & Continue
                            </Button>
                        </div>

                        <div className="text-center text-sm">
                            {countdown > 0 ? (
                                <span className="text-muted-foreground">Resend code in {countdown}s</span>
                            ) : (
                                <button onClick={handleSendCode} className="text-primary hover:underline font-medium">
                                    Resend Code
                                </button>
                            )}
                        </div>
                        <button onClick={() => setCodeSent(false)} className="w-full text-xs text-muted-foreground hover:underline">
                            Wrong number? Change
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
