"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Lock,
    Trash2,
    ShieldAlert,
    Eye,
    EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/useAuthStore"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import AuthRequiredState from "@/components/common/AuthRequiredState"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"

export default function SecurityPage() {
    const router = useRouter()
    const [showPass, setShowPass] = useState(false)
    const { user, isLoading } = useAuthStore()

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
                    title="Login Required"
                    description="Login to manage your security settings."
                />
                <FloatingNavbar />
            </>
        )
    }

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
                        <h1 className="text-2xl font-bold tracking-tight">Login & Security</h1>
                        <p className="text-muted-foreground text-sm">Manage your account safety</p>
                    </div>
                </header>

                {/* Change Password Section */}
                <Card className="border-border/40 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary" />
                            Change Password
                        </CardTitle>
                        <CardDescription>Update your login credentials regularly</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Password</Label>
                            <div className="relative">
                                <Input id="current" type={showPass ? "text" : "password"} className="rounded-xl h-12 pr-10" />
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new">New Password</Label>
                            <Input id="new" type="password" className="rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirm New Password</Label>
                            <Input id="confirm" type="password" className="rounded-xl h-12" />
                        </div>
                        <Button className="w-full h-12 rounded-xl mt-4 font-bold shadow-md">
                            Update Password
                        </Button>
                    </CardContent>
                </Card>

                {/* Dangerous Action Zone */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-red-600 px-2 flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Danger Zone
                    </h2>
                    <Card className="border-red-200 bg-red-50/30 overflow-hidden shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-red-600">Delete Account</p>
                                    <p className="text-xs text-muted-foreground max-w-[280px]">
                                        Permanently remove your account and all associated data. This action cannot be undone.
                                    </p>
                                </div>
                                <Button variant="destructive" size="sm" className="rounded-xl h-10 px-4 font-bold">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
