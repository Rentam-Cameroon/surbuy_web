"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    MessageSquare,
    Bell,
    Smartphone,
    Mail,
    Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import { useAuthStore } from "@/store/useAuthStore"
import AuthRequiredState from "@/components/common/AuthRequiredState"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"

import { useI18n } from "@/contexts/I18nContext"

export default function NotificationsPage() {
    const router = useRouter()
    const { user, isLoading } = useAuthStore()
    const { t } = useI18n()

    const [prefs, setPrefs] = useState({
        sms_new_message: true,
        sms_request_response: true,
        sms_new_listing: false,
        sms_kyc_update: true,
        push_new_message: true,
        push_request_response: true,
        push_new_listing: false,
        push_kyc_update: true,
        whatsapp_new_message: true,
        whatsapp_request_response: true,
        whatsapp_new_listing: false,
        whatsapp_kyc_update: true,
        telegram_new_message: true,
        telegram_request_response: true,
        telegram_new_listing: false,
        telegram_kyc_update: true,
        email_enabled: false,
    })

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CupertinoActivityIndicator size={28} />
            </div>
        )
    }

    if (!user) {
        return (
            <>
                <AuthRequiredState
                    title={t("Login Required")}
                    description={t("Login to manage notification settings.")}
                />
                <FloatingNavbar />
            </>
        )
    }

    const toggle = (key: keyof typeof prefs) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const sections = [
        {
            title: t("Push Notifications"),
            icon: Bell,
            keys: [
                { id: "push_new_message", label: t("New Messages"), desc: t("Alerts for incoming chat messages") },
                { id: "push_request_response", label: t("Request Responses"), desc: t("When someone responds to your buyer request") },
                { id: "push_new_listing", label: t("New Listings"), desc: t("Based on your saved searches & interests") },
                { id: "push_kyc_update", label: t("KYC Updates"), desc: t("Status of your identity verification") },
            ]
        },
        {
            title: t("SMS Notifications"),
            icon: Smartphone,
            keys: [
                { id: "sms_new_message", label: t("New Messages"), desc: t("Get SMS for important chat activity") },
                { id: "sms_request_response", label: t("Request Responses"), desc: t("Urgent updates on your requests") },
                { id: "sms_new_listing", label: t("New Listings"), desc: t("Daily digest of new items") },
                { id: "sms_kyc_update", label: t("KYC Updates"), desc: t("Crucial account verification alerts") },
            ]
        },
        {
            title: t("WhatsApp"),
            icon: MessageSquare,
            keys: [
                { id: "whatsapp_new_message", label: t("New Messages"), desc: t("Direct messages via WhatsApp") },
                { id: "whatsapp_request_response", label: t("Request Responses"), desc: t("Convenient updates on your requests") },
                { id: "whatsapp_new_listing", label: t("New Listings"), desc: t("Market highlights") },
                { id: "whatsapp_kyc_update", label: t("KYC Updates"), desc: t("Verification flow support") },
            ]
        },
        {
            title: t("Telegram"),
            icon: Send,
            keys: [
                { id: "telegram_new_message", label: t("New Messages"), desc: t("Notifications via our Telegram bot") },
                { id: "telegram_request_response", label: t("Request Responses"), desc: t("Instant request updates") },
                { id: "telegram_new_listing", label: t("New Listings"), desc: t("Bot-driven product alerts") },
                { id: "telegram_kyc_update", label: t("KYC Updates"), desc: t("Account security alerts") },
            ]
        },
    ]

    return (
        <div className="pb-20 pt-6 min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 space-y-8">
                <header className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{t("Notification Preferences")}</h1>
                        <p className="text-muted-foreground text-sm">{t("Choose how you want to stay updated")}</p>
                    </div>
                </header>

                <div className="space-y-6">
                    {/* Email Master Toggle */}
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">{t("Email Notifications")}</p>
                                        <p className="text-xs text-muted-foreground">{t("General updates and marketing emails")}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={prefs.email_enabled}
                                    onCheckedChange={() => toggle("email_enabled")}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Grouped Sections */}
                    {sections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 flex items-center gap-2">
                                <section.icon className="w-3.5 h-3.5" />
                                {section.title}
                            </h2>
                            <Card className="border-border/40 overflow-hidden shadow-sm">
                                <CardContent className="p-0">
                                    <div className="divide-y divide-border/40">
                                        {section.keys.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 px-6 hover:bg-muted/5 transition-colors">
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold">{item.label}</p>
                                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                                </div>
                                                <Switch
                                                    checked={prefs[item.id as keyof typeof prefs]}
                                                    onCheckedChange={() => toggle(item.id as keyof typeof prefs)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg" onClick={() => router.back()}>
                        {t("Save Preferences")}
                    </Button>
                </div>
            </div>
            <FloatingNavbar />
        </div>
    )
}
