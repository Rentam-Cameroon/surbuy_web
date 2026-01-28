"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, Clock, Pencil, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import Link from "next/link"
import { requestService } from "@/lib/requestService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { VerificationDialog } from "@/components/dialogs/VerificationDialog"

export default function MyRequestsPage() {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [requests, setRequests] = useState<any[]>([])
    const [isLoadingRequests, setIsLoadingRequests] = useState(true)
    const [error, setError] = useState("")
    const [responsesByRequest, setResponsesByRequest] = useState<Record<string, any[]>>({})
    const [loadingResponsesId, setLoadingResponsesId] = useState<string | null>(null)
    const [actioningId, setActioningId] = useState<string | null>(null)
    const [closeDialogOpen, setCloseDialogOpen] = useState(false)
    const [pendingCloseId, setPendingCloseId] = useState<string | null>(null)

    useEffect(() => {
        const loadRequests = async () => {
            try {
                setIsLoadingRequests(true)
                const data = await requestService.listMyRequests()
                setRequests(data || [])
            } catch (err: any) {
                setError(err.message || "Failed to load requests")
            } finally {
                setIsLoadingRequests(false)
            }
        }

        loadRequests()
    }, [])

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Unknown date"
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }

    const selectedResponses = useMemo(() => {
        if (!selectedId) return []
        return responsesByRequest[selectedId] || []
    }, [responsesByRequest, selectedId])

    const handleToggleResponses = async (requestId: string) => {
        const nextSelected = selectedId === requestId ? null : requestId
        setSelectedId(nextSelected)

        if (nextSelected && !responsesByRequest[requestId]) {
            try {
                setLoadingResponsesId(requestId)
                const data = await requestService.viewRequestResponses(requestId)
                setResponsesByRequest((prev) => ({ ...prev, [requestId]: data || [] }))
            } catch (err: any) {
                setError(err.message || "Failed to load responses")
            } finally {
                setLoadingResponsesId(null)
            }
        }
    }

    const handleCloseRequest = async (requestId: string) => {
        try {
            setActioningId(requestId)
            await requestService.deleteRequest(requestId)
            setRequests((prev) =>
                prev.map((req) => (req.id === requestId ? { ...req, status: "closed" } : req))
            )
        } catch (err) {
            alert("Failed to close request")
        } finally {
            setActioningId(null)
        }
    }

    const openCloseDialog = (requestId: string) => {
        setPendingCloseId(requestId)
        setCloseDialogOpen(true)
    }

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

            {error && (
                <div className="mb-4 p-3 text-sm rounded-xl border border-destructive/30 text-destructive bg-destructive/10">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {isLoadingRequests ? (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <CupertinoActivityIndicator size={40} />
                    </div>
                ) : requests.length > 0 ? (
                    requests.map((req) => (
                        <Card key={req.id} className="overflow-hidden border-border/40 hover:border-primary/20 transition-colors">
                            <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                                <div className="space-y-1">
                                    <Badge variant="secondary" className="text-[10px] mb-1">{req.category}</Badge>
                                    <CardTitle className="text-lg font-bold leading-tight">{req.title}</CardTitle>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(req.created_at)}
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
                                            <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-none">Closed</Badge>
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
                                        {(responsesByRequest[req.id]?.length ?? 0)} Responses
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {req.status === "active" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="rounded-lg text-xs h-8"
                                                disabled={actioningId === req.id}
                                                onClick={() => openCloseDialog(req.id)}
                                            >
                                                {actioningId === req.id ? (
                                                    <CupertinoActivityIndicator size={16} />
                                                ) : (
                                                    "Close"
                                                )}
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant={selectedId === req.id ? "secondary" : "outline"}
                                            className="rounded-lg text-xs h-8"
                                            onClick={() => handleToggleResponses(req.id)}
                                        >
                                            {selectedId === req.id ? "Hide Details" : "View Details"}
                                        </Button>
                                    </div>
                                </div>

                                {selectedId === req.id && (
                                    <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                        <h4 className="font-bold text-sm border-l-2 border-primary pl-2">Responses</h4>
                                        {loadingResponsesId === req.id ? (
                                            <div className="flex justify-center py-4">
                                                <CupertinoActivityIndicator size={20} />
                                            </div>
                                        ) : selectedResponses.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedResponses.map((res) => (
                                                    <div key={res.id} className="p-3 bg-muted/30 rounded-xl border border-border/20">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                                    <User className="w-3 h-3 text-primary" />
                                                                </div>
                                                                <span className="font-bold text-xs">
                                                                    {res.response_type === "have_product" ? "Seller" : "Referral"}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {formatDate(res.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mb-2 italic">"{res.message}"</p>
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            {res.product_id ? (
                                                                <span>Product ID: {res.product_id}</span>
                                                            ) : res.referral_contact ? (
                                                                <span className="flex items-center gap-1">
                                                                    <Phone className="w-3 h-3" />
                                                                    {res.referral_contact}
                                                                </span>
                                                            ) : (
                                                                <span>Details provided</span>
                                                            )}
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
                    ))
                ) : (
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

            <VerificationDialog
                open={closeDialogOpen}
                onOpenChange={(open) => {
                    setCloseDialogOpen(open)
                    if (!open) setPendingCloseId(null)
                }}
                type="confirm"
                title="Close this request?"
                description="This will stop new responses from coming in. You can’t undo this action."
                confirmLabel="Proceed"
                cancelLabel="Cancel"
                onConfirm={() => {
                    if (pendingCloseId) {
                        handleCloseRequest(pendingCloseId)
                    }
                }}
            />

            <FloatingNavbar />
        </div>
    )
}
