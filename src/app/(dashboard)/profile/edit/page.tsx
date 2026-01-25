"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EditProfilePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "Zadolf Ngouajio",
        email: "zadolf@example.com",
        phone: "+237 670 000 000",
        bio: "I love buying and selling on Surbuy!",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate save
        router.push("/profile")
    }

    return (
        <div className="pb-12 pt-6 min-h-screen bg-background">
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
                        <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
                        <p className="text-muted-foreground text-sm">Update your public information</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="rounded-xl h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="rounded-xl h-12 bg-muted/50"
                            disabled
                        />
                        <p className="text-[10px] text-muted-foreground px-1">Email cannot be changed for security reasons.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="rounded-xl h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="rounded-xl min-h-[120px] resize-none"
                            placeholder="Tell us a bit about yourself..."
                        />
                    </div>

                    <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all gap-2">
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    )
}
