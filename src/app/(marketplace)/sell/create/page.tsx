"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Camera, X, CheckCircle2, Hash, FileCheck, AlertCircle } from "lucide-react"
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
import Image from "next/image"
import { productService } from "@/lib/productService"
import { motion, AnimatePresence } from "framer-motion"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { getCityNames, getNeighborhoodsForCity } from "@/lib/locations"

import { useI18n } from "@/contexts/I18nContext"

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'For Parts']

interface Category {
    id: string
    name: string
}

export default function AddProductPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editProductId = searchParams.get('edit')
    const isEditMode = !!editProductId
    const { t } = useI18n()

    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<Array<{ image_url: string, display_order: number }>>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([])
    const [isLoadingProduct, setIsLoadingProduct] = useState(isEditMode)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        condition: "",
        price: "",
        locationCity: "",
        neighborhood: "",
        serialNumber: "",
        hasReceipt: false
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productService.listCategories()
                setCategories(data || [])
            } catch (err) {
                console.error("Failed to fetch categories:", err)
            } finally {
                setIsLoadingCategories(false)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchProduct = async () => {
            if (!editProductId) return

            try {
                setIsLoadingProduct(true)
                const product = await productService.getProduct(editProductId)

                setFormData({
                    title: product.title || "",
                    description: product.description || "",
                    category_id: product.category_id || "",
                    condition: product.condition || "",
                    price: product.price?.toString() || "",
                    locationCity: product.location_city || "",
                    neighborhood: product.neighborhood || "",
                    serialNumber: product.serial_number || "",
                    hasReceipt: product.has_receipt || false
                })

                if (product.images && product.images.length > 0) {
                    setExistingImages(product.images)
                }
            } catch (err) {
                console.error("Failed to fetch product:", err)
                setError(t("Failed to load product data"))
            } finally {
                setIsLoadingProduct(false)
            }
        }

        fetchProduct()
    }, [editProductId, t])

    useEffect(() => {
        if (formData.locationCity) {
            const neighborhoods = getNeighborhoodsForCity(formData.locationCity)
            setAvailableNeighborhoods(neighborhoods)
        } else {
            setAvailableNeighborhoods([])
        }
    }, [formData.locationCity])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            const combined = [...images, ...newFiles].slice(0, 5)
            setImages(combined)

            const previews = combined.map(file => URL.createObjectURL(file))
            setImagePreviews(previews)
        }
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = imagePreviews.filter((_, i) => i !== index)
        setImages(newImages)
        setImagePreviews(newPreviews)
    }

    const removeExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index))
    }

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const result = reader.result as string
                const base64 = result.split(',')[1]
                resolve(base64)
            }
            reader.onerror = error => reject(error)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const imageData = await Promise.all(
                images.map(async (file) => {
                    const base64 = await fileToBase64(file)
                    const ext = file.name.split('.').pop() || 'jpg'
                    return { base64, ext }
                })
            )

            const productData = {
                title: formData.title,
                description: formData.description,
                category_id: formData.category_id,
                condition: formData.condition,
                price: Number(formData.price),
                location_city: formData.locationCity,
                neighborhood: formData.neighborhood,
                serial_number: formData.serialNumber,
                has_receipt: formData.hasReceipt,
                images: imageData.length > 0 ? imageData : undefined
            }

            if (isEditMode && editProductId) {
                await productService.editProduct(editProductId, productData)
            } else {
                await productService.createProduct(productData)
            }

            setIsSuccess(true)
            setTimeout(() => {
                router.push("/sell/my-products")
            }, 2000)
        } catch (err: any) {
            console.error("Submission failed:", err)
            setError(err.message || (isEditMode ? t("Failed to update listing") : t("Failed to publish listing")))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-bold">{isEditMode ? t('Product Updated!') : t('Listing Published!')}</h1>
                <p className="text-muted-foreground">{isEditMode ? t('Your changes have been saved.') : t('Your item is now live and pending review.')}</p>
            </div>
        )
    }

    if (isLoadingProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
                <CupertinoActivityIndicator size={40} />
                <p className="mt-4 text-sm text-muted-foreground">{t("Loading product...")}</p>
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
                    <h1 className="text-2xl font-bold tracking-tight">{isEditMode ? t('Edit Product') : t('List an Item')}</h1>
                    <p className="text-muted-foreground text-sm">{isEditMode ? t('Update your product details') : t('Post a product for sale')}</p>
                </div>
            </header>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm font-medium"
                    >
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload Section */}
                <div className="space-y-4">
                    <Label className="text-base font-bold">{t("Product Photos")} ({t("Max 5")})</Label>
                    <p className="text-[10px] text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/10 italic">
                        {t("Note: Image upload is currently in beta. Your listing will use a default placeholder if no images are attached.")}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {existingImages.map((img, idx) => (
                            <div key={`existing-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border border-border/40 group">
                                <Image src={img.image_url} alt={`Existing ${idx}`} fill className="object-cover" sizes="160px" />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(idx)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {imagePreviews.map((src, idx) => (
                            <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border border-border/40 group">
                                <Image src={src} alt={`Upload ${idx}`} fill className="object-cover" sizes="160px" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {(existingImages.length + images.length) < 5 && (
                            <label className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
                                <Camera className="w-6 h-6 text-muted-foreground/60" />
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t("Add")}</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t("Title")} ({t("Max 100 characters")})</Label>
                            <Input
                                id="title"
                                maxLength={100}
                                placeholder={t("e.g. iPhone 15 Pro Max")}
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="rounded-xl h-12"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">{t("Category")}</Label>
                                <Select
                                    required
                                    value={formData.category_id}
                                    onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                                    disabled={isLoadingCategories}
                                >
                                    <SelectTrigger className="rounded-xl h-12">
                                        {isLoadingCategories ? (
                                            <div className="flex items-center gap-2">
                                                <CupertinoActivityIndicator size={16} />
                                                <span>{t("Loading...")}</span>
                                            </div>
                                        ) : (
                                            <SelectValue placeholder={t("Select")} />
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="condition">{t("Condition")}</Label>
                                <Select
                                    required
                                    value={formData.condition}
                                    onValueChange={(val) => setFormData({ ...formData, condition: val })}
                                >
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder={t("Select")} />
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
                            <Label htmlFor="price">{t("Price")} (XAF)</Label>
                            <div className="relative">
                                <Input
                                    id="price"
                                    type="number"
                                    min={1}
                                    placeholder="0"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="rounded-xl h-12 pl-14"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">FCFA</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">{t("City")} ({t("Max 50 characters")})</Label>
                            <Input
                                id="city"
                                list="cities"
                                maxLength={50}
                                placeholder={t("e.g. Douala")}
                                required
                                value={formData.locationCity}
                                onChange={(e) => setFormData({ ...formData, locationCity: e.target.value, neighborhood: "" })}
                                className="rounded-xl h-12"
                            />
                            <datalist id="cities">
                                {getCityNames().map(city => (
                                    <option key={city} value={city} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="neighborhood">{t("Neighborhood")} ({t("Max 50 characters")})</Label>
                        <Input
                            id="neighborhood"
                            list="neighborhoods"
                            maxLength={50}
                            placeholder={t("e.g. Akwa")}
                            value={formData.neighborhood}
                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                            className="rounded-xl h-12"
                            disabled={!formData.locationCity}
                        />
                        <datalist id="neighborhoods">
                            {availableNeighborhoods.map(neighborhood => (
                                <option key={neighborhood} value={neighborhood} />
                            ))}
                        </datalist>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
                        <div className="space-y-2">
                            <Label htmlFor="serial_number" className="flex items-center gap-2">
                                <Hash className="h-3 w-3" />
                                {t("Serial Number")} ({t("Optional")})
                            </Label>
                            <Input
                                id="serial_number"
                                maxLength={100}
                                placeholder={t("e.g. SN123456789")}
                                value={formData.serialNumber}
                                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                className="rounded-xl h-12"
                            />
                        </div>

                        <div className="flex flex-col justify-center space-y-3">
                            <Label className="flex items-center gap-2">
                                <FileCheck className="h-3 w-3" />
                                {t("Have Receipt?")}
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="has_receipt"
                                    checked={formData.hasReceipt}
                                    onCheckedChange={(val) => setFormData({ ...formData, hasReceipt: val })}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {formData.hasReceipt ? t("Yes, I have it") : t("No receipt")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 pt-4 border-t border-border/40">
                        <Label htmlFor="description">{t("Detailed Description")}</Label>
                        <Textarea
                            id="description"
                            placeholder={t("Describe features, defects, and usage history...")}
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
                        className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <CupertinoActivityIndicator size={20} color="white" />
                                {isEditMode ? t('Updating...') : t('Publishing...')}
                            </>
                        ) : (isEditMode ? t('Update Product') : t('Publish Listing'))}
                    </Button>
                </div>
            </form>
        </div>
    )
}
