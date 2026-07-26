"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useI18n } from "@/contexts/I18nContext"

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
    const { t } = useI18n()

    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-6 pb-32">
            <div className="max-w-sm w-full text-center space-y-4">
                <div className="text-lg font-semibold">{t(title)}</div>
                <p className="text-sm text-muted-foreground">{t(description)}</p>
                <Button
                    onClick={() => router.push("/register")}
                    className="rounded-full px-6"
                >
                    {t(buttonLabel)}
                </Button>
            </div>
        </div>
    )
}
