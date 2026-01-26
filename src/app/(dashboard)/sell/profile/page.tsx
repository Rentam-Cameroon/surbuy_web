"use client"

import {
    User,
    ShieldCheck,
    ChevronRight,
    Bell,
    Shield,
    LogOut,
    Camera,
    Pencil,
    CircleCheck,
    AlertCircle,
    CreditCard,
    FileCheck,
    ScanFace,
    BadgeCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import Link from "next/link"

export default function SellerProfilePage() {
    const user = {
        name: "Zadolf Ngouajio",
        email: "zadolf@example.com",
        memberSince: "Jan 2024",
        avatar: "",
        kyc: {
            id: true,
            selfie: true,
            tax: false
        },
        subscription: "Yellow Badge"
    }

    return (
        <div className="pb-32 pt-6 min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <Avatar className="h-28 w-28 border-4 border-background shadow-xl ring-1 ring-border/50">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-none h-6 px-2 font-black text-[10px] uppercase">
                                {user.subscription}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">Professional Seller since {user.memberSince}</p>
                    </div>
                    <Link href="/profile/edit">
                        <Button variant="outline" size="sm" className="rounded-full px-6 gap-2 h-9 border-primary/20 hover:bg-primary/5 text-primary font-semibold">
                            <Pencil className="w-3.5 h-3.5" />
                            Edit Profile
                        </Button>
                    </Link>
                </div>

                {/* Seller Verification (KYC) */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">Verification Docs</h2>
                    <Card className="border-border/40 overflow-hidden shadow-sm">
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/40">
                                <div className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={user.kyc.id ? "text-green-600 bg-green-500/10 p-2.5 rounded-2xl" : "text-amber-600 bg-amber-500/10 p-2.5 rounded-2xl"}>
                                            <FileCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">ID Card Verification</p>
                                            <p className="text-xs text-muted-foreground">National ID or Passport</p>
                                        </div>
                                    </div>
                                    {user.kyc.id ? (
                                        <CircleCheck className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Button variant="outline" size="sm" className="h-8 rounded-full text-xs">Upload</Button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={user.kyc.selfie ? "text-green-600 bg-green-500/10 p-2.5 rounded-2xl" : "text-amber-600 bg-amber-500/10 p-2.5 rounded-2xl"}>
                                            <ScanFace className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Live Selfie</p>
                                            <p className="text-xs text-muted-foreground">Face recognition check</p>
                                        </div>
                                    </div>
                                    {user.kyc.selfie ? (
                                        <CircleCheck className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Button variant="outline" size="sm" className="h-8 rounded-full text-xs">Capture</Button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={user.kyc.tax ? "text-green-600 bg-green-500/10 p-2.5 rounded-2xl" : "text-slate-400 bg-slate-500/10 p-2.5 rounded-2xl"}>
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Tax Documentation</p>
                                            <p className="text-xs text-muted-foreground">NIU / Tax clearance card</p>
                                        </div>
                                    </div>
                                    {user.kyc.tax ? (
                                        <CircleCheck className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Link href="/kyc">
                                            <Button variant="outline" size="sm" className="h-8 rounded-full text-xs font-bold text-primary border-primary/20">Upgrade to Green</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Selling Plan */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">Subscription</h2>
                    <Card className="border-none bg-primary/5 overflow-hidden ring-1 ring-primary/10">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-primary">
                                        <CreditCard className="w-5 h-5" />
                                        <h3 className="font-bold">Free Seller Plan</h3>
                                    </div>
                                    <p className="text-sm text-balance text-muted-foreground leading-relaxed">
                                        You are currently on the free tier. Upgrade to unlock bulk listing and lower transaction fees.
                                    </p>
                                </div>
                                <Button size="sm" className="rounded-xl font-bold shadow-lg shadow-primary/20">Upgrade</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Settings */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">Business Settings</h2>
                    <Card className="border-border/40 overflow-hidden shadow-sm">
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/40">
                                <Link href="/profile/notifications" className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <Bell className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold">Alert Preferences</p>
                                            <p className="text-xs text-muted-foreground">Sales and offer notifications</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </Link>

                                <Link href="/profile/security" className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <Shield className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold">Business Security</p>
                                            <p className="text-xs text-muted-foreground">Secure your shop and payments</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </Link>

                                <button className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                                        <div className="space-y-0.5 text-left">
                                            <p className="text-sm font-bold group-hover:text-red-600 transition-colors">Logout</p>
                                            <p className="text-xs text-muted-foreground">Sign out of your business account</p>
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
