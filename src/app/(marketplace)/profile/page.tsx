"use client"

import {
    Mail,
    Phone,
    ShieldCheck,
    ChevronRight,
    Bell,
    Shield,
    LogOut,
    Camera,
    Pencil,
    CircleCheck,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import AuthRequiredState from "@/components/common/AuthRequiredState"
import { useTheme } from "next-themes"
import { useI18n } from "@/contexts/I18nContext"
import { useEffect, useState } from "react"

export default function ProfilePage() {
    const { user, logout, isLoading } = useAuthStore()
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const { locale, setLocale, t } = useI18n()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CupertinoActivityIndicator size={28} />
            </div>
        )
    }

    if (!user) {
        return (
            <AuthRequiredState
                title={t("Login Required")}
                description={t("Login to view your profile.")}
            />
        )
    }

    const handleLogout = () => {
        logout()
        router.push('/register')
    }

    const userData = {
        name: user.full_name,
        email: user.email || t("No email"),
        phone: user.phone,
        avatar: user.profile_image_url || user.avatar_url || "",
        isEmailVerified: user.is_email_verified,
        isPhoneVerified: user.is_phone_verified,
        memberSince: user.created_at
            ? new Date(user.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' })
            : t("Jan 2024"),
    }

    return (
        <div className="pb-32 pt-6 min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <Avatar className="h-28 w-28 border-4 border-background shadow-xl ring-1 ring-border/50">
                            <AvatarImage src={userData.avatar} />
                            <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold">
                                {userData.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{userData.name}</h1>
                        <p className="text-muted-foreground text-sm">{t("Member since")} {userData.memberSince}</p>
                    </div>
                    <Link href="/profile/edit">
                        <Button variant="outline" size="sm" className="rounded-full px-6 gap-2 h-9 border-primary/20 hover:bg-primary/5 text-primary font-semibold">
                            <Pencil className="w-3.5 h-3.5" />
                            {t("Edit Profile")}
                        </Button>
                    </Link>
                </div>

                {/* Appearance */}
                <Card className="border-border/40 overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            {t("Appearance")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/40">
                            <div className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">{t("Theme")}</p>
                                        <p className="text-xs text-muted-foreground">{t("System")}/{t("Light")}/{t("Dark")}</p>
                                    </div>
                                </div>
                                <Select value={(isMounted ? theme : "system") || "system"} onValueChange={(val) => setTheme(val)} disabled={!isMounted}>
                                    <SelectTrigger className="h-9 w-32 rounded-full">
                                        <SelectValue placeholder={t("Theme")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">{t("System")}</SelectItem>
                                        <SelectItem value="light">{t("Light")}</SelectItem>
                                        <SelectItem value="dark">{t("Dark")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">{t("Language")}</p>
                                        <p className="text-xs text-muted-foreground">{t("English")} / {t("French")}</p>
                                    </div>
                                </div>
                                <Select value={locale} onValueChange={(val) => setLocale(val as "en" | "fr")} disabled={!isMounted}>
                                    <SelectTrigger className="h-9 w-32 rounded-full">
                                        <SelectValue placeholder={t("Language")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">{t("English")}</SelectItem>
                                        <SelectItem value="fr">{t("French")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Verification Status */}
                <Card className="border-border/40 overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            {t("Verification Status")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/40">
                            <div className="flex items-center justify-between p-4 px-6 hover:bg-muted/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={userData.isEmailVerified ? "text-green-600 bg-green-500/10 p-2 rounded-full" : "text-amber-600 bg-amber-500/10 p-2 rounded-full"}>
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">{t("Email Address")}</p>
                                        <p className="text-xs text-muted-foreground">{userData.email}</p>
                                    </div>
                                </div>
                                {userData.isEmailVerified ? (
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none pointer-events-none gap-1">
                                        <CircleCheck className="w-3 h-3" />
                                        {t("Verified")}
                                    </Badge>
                                ) : (
                                    <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-full">{t("Verify Now")}</Button>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 px-6 hover:bg-muted/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={userData.isPhoneVerified ? "text-green-600 bg-green-500/10 p-2 rounded-full" : "text-amber-600 bg-amber-500/10 p-2 rounded-full"}>
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">{t("Phone Number")}</p>
                                        <p className="text-xs text-muted-foreground">{userData.phone}</p>
                                    </div>
                                </div>
                                {userData.isPhoneVerified ? (
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none pointer-events-none gap-1">
                                        <CircleCheck className="w-3 h-3" />
                                        {t("Verified")}
                                    </Badge>
                                ) : (
                                    <Link href="/profile/verify-phone">
                                        <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-full text-amber-600 border-amber-200 bg-amber-50 group hover:bg-amber-100">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {t("Verify Now")}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">{t("Account Settings")}</h2>
                    <Card className="border-border/40 overflow-hidden shadow-sm">
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/40">
                                <Link href="/profile/notifications" className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <Bell className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold">{t("Notifications")}</p>
                                            <p className="text-xs text-muted-foreground">{t("Manage your alert preferences")}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </Link>

                                <Link href="/profile/security" className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <Shield className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold">{t("Security")}</p>
                                            <p className="text-xs text-muted-foreground">{t("Password & account safety")}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between p-6 hover:bg-destructive/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                                        <div className="space-y-0.5 text-left">
                                            <p className="text-sm font-bold group-hover:text-red-600 transition-colors">{t("Logout")}</p>
                                            <p className="text-xs text-muted-foreground">{t("Sign out of your account")}</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <FloatingNavbar />
        </div>
    )
}
