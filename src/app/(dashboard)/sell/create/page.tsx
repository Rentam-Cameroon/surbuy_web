"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, X, CheckCircle2, Hash, FileCheck } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"

const CATEGORIES = ['Phones', 'Laptops', 'Monitors', 'Tablets', 'Accessories', 'Other']
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'For Parts']

export default function AddProductPage() {
    const router = useRouter()
    const [images, setImages] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        condition: "",
        price: "",
        locationCity: "",
        neighborhood: "",
        serialNumber: "",
        hasReceipt: false
    })

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file))
            setImages([...images, ...newImages].slice(0, 5))
        }
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call based on the schema
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
            setTimeout(() => {
                router.push("/sell")
            }, 2000)
        }, 1500)
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-bold">Listing Published!</h1>
                <p className="text-muted-foreground">Your item is now live and pending review.</p>
            </div>
        )
    }

    return (
        <div className="pb-32 pt-6 px-4 max-w-2xl mx-auto min-h-screen bg-background">
            <header className="mb-8 flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">List an Item</h1>
                    <p className="text-muted-foreground text-sm">Post a product for sale</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload Section */}
                <div className="space-y-4">
                    <Label className="text-base font-bold">Product Photos (Max 5)</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {images.map((src, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border/40 group">
                                <img src={src} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {images.length < 5 && (
                            <label className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
                                <Camera className="w-6 h-6 text-muted-foreground/60" />
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Add</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title (Max 100 characters)</Label>
                            <Input
                                id="title"
                                maxLength={100}
                                placeholder="e.g. iPhone 15 Pro Max"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="rounded-xl h-12"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    required
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="condition">Condition</Label>
                                <Select
                                    required
                                    value={formData.condition}
                                    onValueChange={(val) => setFormData({ ...formData, condition: val })}
                                >
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CONDITIONS.map(cond => (
                                            <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Price & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (XAF)</Label>
                            <div className="relative">
                                <Input
                                    id="price"
                                    type="number"
                                    min={1}
                                    placeholder="0"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="rounded-xl h-12 pl-12"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">FCFA</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">City (Max 50 characters)</Label>
                            <Input
                                id="city"
                                maxLength={50}
                                placeholder="e.g. Douala"
                                required
                                value={formData.locationCity}
                                onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                                className="rounded-xl h-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="neighborhood">Neighborhood (Max 50 characters)</Label>
                        <Input
                            id="neighborhood"
                            maxLength={50}
                            placeholder="e.g. Akwa"
                            value={formData.neighborhood}
                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                            className="rounded-xl h-12"
                        />
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
                        <div className="space-y-2">
                            <Label htmlFor="serial_number" className="flex items-center gap-2">
                                <Hash className="h-3 w-3" />
                                Serial Number (Optional)
                            </Label>
                            <Input
                                id="serial_number"
                                maxLength={100}
                                placeholder="e.g. SN123456789"
                                value={formData.serialNumber}
                                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                className="rounded-xl h-12"
                            />
                        </div>

                        <div className="flex flex-col justify-center space-y-3">
                            <Label className="flex items-center gap-2">
                                <FileCheck className="h-3 w-3" />
                                Have Receipt?
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="has_receipt"
                                    checked={formData.hasReceipt}
                                    onCheckedChange={(val) => setFormData({ ...formData, hasReceipt: val })}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {formData.hasReceipt ? "Yes, I have it" : "No receipt"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 pt-4 border-t border-border/40">
                        <Label htmlFor="description">Detailed Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe features, defects, and usage history..."
                            className="rounded-xl min-h-[140px] resize-none"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Publishing..." : "Publish Listing"}
                    </Button>
                </div>
            </form>

            <FloatingNavbar />
        </div>
    )
}
