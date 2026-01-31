"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AuthRequiredStateProps {
    title?: string
    description?: string
    buttonLabel?: string
}

export default function AuthRequiredState({
    title = "Login Required",
    description = "You need to login to access this screen.",
    buttonLabel = "Login",
}: AuthRequiredStateProps) {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-6 pb-32">
            <div className="max-w-sm w-full text-center space-y-4">
                <div className="text-lg font-semibold">{title}</div>
                <p className="text-sm text-muted-foreground">{description}</p>
                <Button
                    onClick={() => router.push("/register")}
                    className="rounded-full px-6"
                >
                    {buttonLabel}
                </Button>
            </div>
        </div>
    )
}
