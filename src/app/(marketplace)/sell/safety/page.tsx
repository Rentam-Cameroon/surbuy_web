"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck, BadgeCheck, PhoneCall, Wallet, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

const GUIDES = [
    {
        title: "Verify buyer identity",
        body: "Only transact with buyers who have verified profiles and clear contact details. Be cautious of rushed requests.",
        icon: BadgeCheck
    },
    {
        title: "Meet in safe places",
        body: "Use public, well-lit locations with security or CCTV. Avoid late-night meetups and isolated areas.",
        icon: ShieldCheck
    },
    {
        title: "Confirm payment first",
        body: "Never release items before confirming full payment. Avoid screenshots or unverified transfer messages.",
        icon: Wallet
    },
    {
        title: "Share only necessary info",
        body: "Do not share OTPs, PINs, or sensitive details. Keep conversations on Surbuy when possible.",
        icon: PhoneCall
    },
    {
        title: "Report suspicious activity",
        body: "If anything feels off, end the conversation and report the user immediately.",
        icon: AlertTriangle
    }
]

export default function SellSafetyGuidePage() {
    const router = useRouter()

    return (
        <div className="pb-12 pt-6 px-4 max-w-2xl mx-auto min-h-screen">
            <header className="mb-8 flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sell Safety Guide</h1>
                    <p className="text-muted-foreground text-sm">Stay safe while selling on Surbuy</p>
                </div>
            </header>

            <div className="space-y-4">
                {GUIDES.map((guide) => (
                    <div key={guide.title} className="p-4 rounded-2xl border border-border/40 bg-muted/10">
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <guide.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{guide.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{guide.body}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 rounded-2xl border border-primary/20 bg-primary/5 text-sm text-muted-foreground">
                Always trust your instincts. If a deal feels unsafe, walk away and report the activity.
            </div>
        </div>
    )
}
