"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { productService } from "@/lib/productService"
import { requestService } from "@/lib/requestService"

export default function RespondRequestPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const requestId = searchParams.get("requestId") || ""
    const responseType = searchParams.get("responseType") as "have_product" | "know_someone" | null

    const [message, setMessage] = useState("")
    const [referralContact, setReferralContact] = useState("")
    const [products, setProducts] = useState<any[]>([])
    const [selectedProductLabel, setSelectedProductLabel] = useState("")
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (responseType !== "have_product") return

        const loadProducts = async () => {
            try {
                setIsLoadingProducts(true)
                const data = await productService.listMyProducts()
                setProducts(data || [])
            } catch (err: any) {
                setError(err.message || "Failed to load your products")
            } finally {
                setIsLoadingProducts(false)
            }
        }

        loadProducts()
    }, [responseType])

    const productOptions = useMemo(() => {
        return products.map((product) => `${product.title} • ${Number(product.price ?? 0).toLocaleString()} FCFA`)
    }, [products])

    const selectedProductId = useMemo(() => {
        if (!selectedProductLabel) return ""
        const index = productOptions.indexOf(selectedProductLabel)
        if (index < 0) return ""
        return products[index]?.id || ""
    }, [productOptions, products, selectedProductLabel])

    const isCameroonPhone = (value: string) => {
        const digits = value.replace(/\s+/g, "")
        return /^6\d{8}$/.test(digits)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!requestId || !responseType) {
            setError("Invalid request details")
            return
        }

        if (!message.trim()) {
            setError("Please enter a message")
            return
        }

        if (responseType === "have_product" && !selectedProductId) {
            setError("Please select a product")
            return
        }

        if (responseType === "know_someone" && !isCameroonPhone(referralContact)) {
            setError("Phone number must be 9 digits and start with 6")
            return
        }

        try {
            setIsSubmitting(true)
            await requestService.respondToRequest({
                request_id: requestId,
                response_type: responseType,
                product_id: responseType === "have_product" ? selectedProductId : undefined,
                referral_contact: responseType === "know_someone" ? referralContact.replace(/\s+/g, "") : undefined,
                message
            })
            router.push("/sell/requests")
        } catch (err: any) {
            setError(err.message || "Failed to send response")
        } finally {
            setIsSubmitting(false)
        }
    }

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
                    <h1 className="text-2xl font-bold tracking-tight">Respond to Request</h1>
                    <p className="text-muted-foreground text-sm">
                        {responseType === "have_product"
                            ? "Let the buyer know you have the item"
                            : "Share a trusted contact who can help"}
                    </p>
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
                    {error}
                </div>
            )}

            {!requestId || !responseType ? (
                <div className="text-sm text-muted-foreground">Missing request details.</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {responseType === "have_product" && (
                        <div className="space-y-2">
                            <Label>Select your product</Label>
                            {isLoadingProducts ? (
                                <div className="flex justify-center py-3">
                                    <CupertinoActivityIndicator size={20} />
                                </div>
                            ) : products.length > 0 ? (
                                <Combobox
                                    options={productOptions}
                                    value={selectedProductLabel}
                                    onValueChange={setSelectedProductLabel}
                                    placeholder="Choose a product"
                                    emptyText="No products match your search."
                                />
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    You don&apos;t have any products yet.{" "}
                                    <Link href="/sell/create" className="text-primary font-semibold">
                                        Create one
                                    </Link>
                                    .
                                </div>
                            )}
                        </div>
                    )}

                    {responseType === "know_someone" && (
                        <div className="space-y-2">
                            <Label htmlFor="referral_contact">Referral phone number</Label>
                            <Input
                                id="referral_contact"
                                placeholder="e.g. 6XXXXXXXX"
                                inputMode="numeric"
                                maxLength={9}
                                className="rounded-xl h-12"
                                value={referralContact}
                                onChange={(e) => setReferralContact(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Must be 9 digits and start with 6 (Cameroon number, no country code).
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Share details about the item or contact..."
                            className="rounded-xl min-h-[140px] resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                        disabled={
                            isSubmitting ||
                            (responseType === "have_product" && (isLoadingProducts || products.length === 0))
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <CupertinoActivityIndicator size={20} color="white" />
                                Sending...
                            </>
                        ) : (
                            "Send Response"
                        )}
                    </Button>
                </form>
            )}
        </div>
    )
}
