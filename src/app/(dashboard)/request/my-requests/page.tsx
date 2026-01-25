"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, Clock, CheckCircle2, XCircle, User, Phone, Pencil, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import Link from "next/link"

const MY_MOCK_REQUESTS = [
    {
        id: "my-1",
        title: "Used iPhone 12 Pro",
        status: "active",
        createdAt: "Jan 24, 2026",
        responses: 3,
        category: "Electronics",
        maxBudget: 250000,
        city: "Douala",
        neighborhood: "Akwa",
        description: "Need a clean UK used iPhone 12 Pro. Battery health should be above 85%."
    },
    {
        id: "my-2",
        title: "Modern Sofa Set",
        status: "fulfilled",
        createdAt: "Jan 20, 2026",
        responses: 0,
        category: "Furniture",
        maxBudget: 350000,
        city: "Yaoundé",
        neighborhood: "Bastos",
        description: "Looking for a 5-seater modern sofa set for my living room."
    }
]

const MOCK_RESPONSES = [
    { id: 1, sender: "Samuel K.", price: 240000, message: "I have a very clean one, gold color. 88% battery.", time: "1h ago" },
    { id: 2, sender: "Alice Shop", price: 255000, message: "Brand new UK used, came in yesterday. 92% battery health.", time: "3h ago" },
    { id: 3, sender: "Tech Hub", price: 235000, message: "Available in blue and black. 86% battery.", time: "5h ago" }
]

export default function MyRequestsPage() {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState<string | null>(null)

    return (
        <div className="pb-32 pt-6 px-4 max-w-2xl mx-auto min-h-screen">
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
                    <h1 className="text-2xl font-bold tracking-tight">My Requests</h1>
                    <p className="text-muted-foreground text-sm">Manage your posts and responses</p>
                </div>
            </header>

            <div className="space-y-4">
                {MY_MOCK_REQUESTS.map((req) => (
                    <Card key={req.id} className="overflow-hidden border-border/40 hover:border-primary/20 transition-colors">
                        <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                            <div className="space-y-1">
                                <Badge variant="secondary" className="text-[10px] mb-1">{req.category}</Badge>
                                <CardTitle className="text-lg font-bold leading-tight">{req.title}</CardTitle>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {req.createdAt}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2">
                                    <Link href={`/request/create?edit=${req.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5 text-muted-foreground hover:text-primary">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    {req.status === "active" ? (
                                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none">Active</Badge>
                                    ) : (
                                        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none">Fulfilled</Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {req.description}
                            </p>

                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/40">
                                <div className="flex items-center gap-2 text-sm font-bold text-primary">
                                    <MessageSquare className="w-4 h-4" />
                                    {req.responses} {req.responses === 1 ? 'Response' : 'Responses'}
                                </div>
                                <Button
                                    size="sm"
                                    variant={selectedId === req.id ? "secondary" : "outline"}
                                    className="rounded-lg text-xs h-8"
                                    onClick={() => setSelectedId(selectedId === req.id ? null : req.id)}
                                >
                                    {selectedId === req.id ? "Hide Details" : "View Details"}
                                </Button>
                            </div>

                            {selectedId === req.id && (
                                <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                    <h4 className="font-bold text-sm border-l-2 border-primary pl-2">Responses</h4>
                                    {req.responses > 0 ? (
                                        <div className="space-y-3">
                                            {MOCK_RESPONSES.map((res) => (
                                                <div key={res.id} className="p-3 bg-muted/30 rounded-xl border border-border/20">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <User className="w-3 h-3 text-primary" />
                                                            </div>
                                                            <span className="font-bold text-xs">{res.sender}</span>
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">{res.time}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-2 italic">"{res.message}"</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-primary">{res.price.toLocaleString()} XAF</span>
                                                        <Link href="/marketplace/product/1">
                                                            <Button size="sm" className="h-8 text-xs px-4 rounded-xl shadow-sm">
                                                                <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-muted/20 rounded-xl border border-dashed border-border/50">
                                            <p className="text-xs text-muted-foreground">No responses yet. We'll notify you when someone has what you're looking for!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {MY_MOCK_REQUESTS.length === 0 && (
                    <div className="text-center py-20 px-4">
                        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No requests yet</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                            Post what you're looking for and let sellers come to you.
                        </p>
                        <Link href="/request/create">
                            <Button>Create Your First Request</Button>
                        </Link>
                    </div>
                )}
            </div>

            <FloatingNavbar />
        </div>
    )
}
