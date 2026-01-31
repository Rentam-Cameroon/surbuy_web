"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPrompt() {
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handler = (event: Event) => {
            event.preventDefault()
            setPromptEvent(event as BeforeInstallPromptEvent)
            setVisible(true)
        }

        window.addEventListener("beforeinstallprompt", handler)
        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    const handleInstall = async () => {
        if (!promptEvent) return
        await promptEvent.prompt()
        const choice = await promptEvent.userChoice
        if (choice.outcome === "accepted") {
            setVisible(false)
            setPromptEvent(null)
        }
    }

    if (!visible) return null

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button
                onClick={handleInstall}
                className="rounded-full px-5 shadow-lg shadow-primary/20"
            >
                Install App
            </Button>
        </div>
    )
}
