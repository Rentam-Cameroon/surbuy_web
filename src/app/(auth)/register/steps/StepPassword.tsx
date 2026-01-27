"use client"

import { useState } from "react"
import { useRegistrationStore } from "@/store/useRegistrationStore"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { authService } from "@/lib/authService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

export default function StepPassword() {
    const login = useAuthStore((state) => state.login)
    const {
        password,
        setPassword,
        setStep,
        phone,
        fullName,
        city,
        neighborhood,
        email,
        isExistingUser,
        regStatus,
        isPhoneVerified,
        isEmailVerified,
        bio,
        profileImage
    } = useRegistrationStore()

    const router = useRouter()
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isLogin = isExistingUser && regStatus === 'complete'

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove prefix e.g. "data:image/jpeg;base64,"
                resolve(result.split(',')[1]);
            };
            reader.onerror = error => reject(error);
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const formattedPhone = `+237${phone}`

            let imageBase64 = undefined;
            let imageExt = undefined;

            if (!isLogin && profileImage) {
                imageBase64 = await fileToBase64(profileImage);
                imageExt = profileImage.name.split('.').pop();
            }

            const response = await authService.dynamicTask({
                phone: formattedPhone,
                email,
                password,
                full_name: fullName,
                location_city: city,
                neighborhood,
                bio,
                image_base64: imageBase64,
                image_ext: imageExt,
                is_phone_verified: isPhoneVerified,
                is_email_verified: isEmailVerified,
                step: 'signup' // This endpoint handles both login and signup
            })

            // On success, store session and redirect
            if (response.token && response.user) {
                login(response.token, response.user)
                router.push('/marketplace')
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        if (isLogin) {
            setStep(1) // Go back to phone entry
        } else {
            setStep(4) // Go back to email verification
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="p-0 h-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    {isLogin ? "Welcome Back" : "Set your password"}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {isLogin
                        ? "Enter your password to sign in to your account."
                        : "Almost there! Create a secure password to protect your account."}
                </p>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (error) setError(null)
                            }}
                            required
                            minLength={8}
                            className="rounded-xl h-12 pr-10"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {!isLogin && (
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    if (error) setError(null)
                                }}
                                required
                                className="rounded-xl h-12 pr-10"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                        disabled={isLoading || password.length < 8 || (!isLogin && password !== confirmPassword)}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <CupertinoActivityIndicator size={20} color="white" />
                                <span>{isLogin ? "Signing in..." : "Finalizing..."}</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>{isLogin ? "Sign In" : "Finish Registration"}</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    )
}
