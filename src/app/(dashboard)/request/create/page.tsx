"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft } from "lucide-react"
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

export default function CreateRequestPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get("edit")
    const isEdit = !!editId

    // State for pre-filling (Mock simulation)
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        maxBudget: "",
        city: "",
        neighborhood: "",
        description: ""
    })

    useEffect(() => {
        if (isEdit) {
            // Simulate fetching data for the request
            // In a real app, this would be a DB fetch
            if (editId === "my-1") {
                setFormData({
                    title: "Used iPhone 12 Pro",
                    category: "electronics",
                    maxBudget: "250000",
                    city: "Douala",
                    neighborhood: "Akwa",
                    description: "Need a clean UK used iPhone 12 Pro. Battery health should be above 85%."
                })
            }
        }
    }, [isEdit, editId])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate submission
        router.push("/request/my-requests")
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
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="vehicles">Vehicles</SelectItem>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
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
                            value={formData.maxBudget}
                            onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location_city">City</Label>
                        <Input
                            id="location_city"
                            placeholder="e.g. Douala"
                            required
                            className="rounded-xl h-12"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="neighborhood">Neighborhood (Optional)</Label>
                    <Input
                        id="neighborhood"
                        placeholder="e.g. Akwa"
                        className="rounded-xl h-12"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    />
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

                <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all">
                    {isEdit ? "Update Request" : "Post Request"}
                </Button>
            </form>
        </div>
    )
}
