"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { requestService } from "@/lib/requestService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { useRequestCache } from "@/contexts/RequestCacheContext"
import { getCities, getNeighborhoodsForCity } from "@/lib/locations"

export default function CreateRequestPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get("edit")
    const isEdit = !!editId
    const { invalidateCache } = useRequestCache()

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        max_budget: "",
        location_city: "",
        neighborhood: "",
        description: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([])

    useEffect(() => {
        if (formData.location_city) {
            setAvailableNeighborhoods(getNeighborhoodsForCity(formData.location_city))
        } else {
            setAvailableNeighborhoods([])
        }
    }, [formData.location_city])

    useEffect(() => {
        const fetchRequest = async () => {
            if (!editId) return

            try {
                const requests = await requestService.listRequests()
                const request = requests.find((r: any) => r.id === editId)

                if (request) {
                    setFormData({
                        title: request.title || "",
                        category: request.category || "",
                        max_budget: request.max_budget?.toString() || "",
                        location_city: request.location_city || "",
                        neighborhood: request.neighborhood || "",
                        description: request.description || ""
                    })
                }
            } catch (err) {
                console.error("Failed to fetch request:", err)
            }
        }

        fetchRequest()
    }, [editId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            setIsSubmitting(true)

            const data = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                max_budget: parseInt(formData.max_budget),
                location_city: formData.location_city,
                neighborhood: formData.neighborhood || undefined
            }

            if (isEdit) {
                await requestService.updateRequest(editId, data)
            } else {
                await requestService.createRequest(data)
            }

            invalidateCache()
            router.push("/request/my-requests")
        } catch (err: any) {
            setError(err.message || "Failed to save request")
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
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEdit ? "Update Request" : "Create Request"}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {isEdit ? "Modify your request details" : "Post what you are looking for"}
                    </p>
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">What are you looking for?</Label>
                    <Input
                        id="title"
                        placeholder="e.g. iPhone 15 Pro Max - 256GB"
                        required
                        className="rounded-xl h-12"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                        required
                        value={formData.category}
                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                        <SelectTrigger className="rounded-xl h-12">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Vehicles">Vehicles</SelectItem>
                            <SelectItem value="Real Estate">Real Estate</SelectItem>
                            <SelectItem value="Fashion">Fashion</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="max_budget">Max Budget (XAF)</Label>
                        <Input
                            id="max_budget"
                            type="number"
                            placeholder="e.g. 500000"
                            className="rounded-xl h-12"
                            value={formData.max_budget}
                            onChange={(e) => setFormData({ ...formData, max_budget: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location_city">City</Label>
                        <Input
                            id="location_city"
                            list="cities"
                            placeholder="e.g. Douala"
                            required
                            maxLength={50}
                            className="rounded-xl h-12"
                            value={formData.location_city}
                            onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                        />
                        <datalist id="cities">
                            {getCities().map(city => (
                                <option key={city} value={city} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="neighborhood">Neighborhood (Optional)</Label>
                    <Input
                        id="neighborhood"
                        list="neighborhoods"
                        placeholder="e.g. Akwa"
                        maxLength={50}
                        className="rounded-xl h-12"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        disabled={!formData.location_city}
                    />
                    <datalist id="neighborhoods">
                        {availableNeighborhoods.map(neighborhood => (
                            <option key={neighborhood} value={neighborhood} />
                        ))}
                    </datalist>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe the item, condition, and any other requirements..."
                        className="rounded-xl min-h-[120px] resize-none"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <CupertinoActivityIndicator size={20} color="white" />
                            {isEdit ? "Updating..." : "Posting..."}
                        </>
                    ) : (isEdit ? "Update Request" : "Post Request")}
                </Button>
            </form>
        </div>
    )
}
