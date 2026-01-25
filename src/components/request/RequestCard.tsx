"use client"

import { MapPin, Clock, MessageCircle, MoreVertical } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RequestCardProps {
    request: {
        id: string
        title: string
        budgetMax: number
        location: string
        description: string
        user: {
            name: string
            avatar: string
            isVerified: boolean
        }
        category: string
        postedAt: string
        urgency: string
    }
}

export default function RequestCard({ request }: RequestCardProps) {
    const isHighUrgency = request.urgency === "High"

    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden group">
            <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                        <AvatarImage src={request.user.avatar} alt={request.user.name} />
                        <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm flex items-center gap-1">
                            {request.user.name}
                            {request.user.isVerified && (
                                <span className="text-blue-500 text-[10px]">✓</span>
                            )}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {request.postedAt}
                        </span>
                    </div>
                </div>
                {isHighUrgency && (
                    <Badge variant="destructive" className="animate-pulse text-[10px] px-2 py-0.5 h-5">
                        Urgent
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3">
                <div className="space-y-1">
                    <Badge variant="secondary" className="text-[10px] mb-2">{request.category}</Badge>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                        {request.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {request.description}
                    </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="font-bold text-primary">
                        Budget: {request.budgetMax.toLocaleString()} XAF
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs gap-1 opacity-80">
                        <MapPin className="w-3 h-3" />
                        {request.location}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 bg-muted/20 flex gap-2 w-full">
                <Button className="w-full h-9 text-xs font-semibold shadow-sm hover:shadow-md transition-all" size="sm">
                    Make Offer
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
