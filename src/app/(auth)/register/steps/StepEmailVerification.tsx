import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRegistrationStore } from "@/store/useRegistrationStore"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Mail } from "lucide-react"

export default function StepEmailVerification() {
    const { email, emailOtp, setEmail, setEmailOtp, setStep } = useRegistrationStore()
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
        setStep(5)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Email Verification</h1>
                <p className="text-muted-foreground">
                    {codeSent ? "Check your inbox for the code." : "Add a recovery email."}
                </p>
            </div>

            <div className="space-y-4">
                {!codeSent ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="flex gap-2 relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="example@gmail.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" className="w-32" onClick={() => setStep(5)}>
                                Skip
                            </Button>
                            <Button className="w-32" onClick={handleSendCode}>
                                Send Code
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
                                placeholder="0000"
                                className="w-32 text-center text-2xl tracking-[0.5em]"
                                maxLength={4}
                                value={emailOtp}
                                onChange={(e) => setEmailOtp(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button className="min-w-[200px]" size="lg" onClick={handleVerify}>
                                Verify & Finish
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
                            Wrong email? Change
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
