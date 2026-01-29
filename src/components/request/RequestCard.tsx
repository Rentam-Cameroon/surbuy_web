"use client"

import { MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface RequestCardProps {
    request: {
        id: string
        title: string
        max_budget: number | string | null
        location_city: string
        neighborhood?: string
        description: string
        category: string
        created_at: string
    }
    onRespond: (requestId: string, responseType: 'i_have_this' | 'i_know_someone') => void
}

export default function RequestCard({ request, onRespond }: RequestCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const budget = Number(request.max_budget ?? 0)

    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden group">
            <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(request.created_at)}
                    </span>
                </div>
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
                        Budget: {Number.isFinite(budget) ? budget.toLocaleString() : "0"} XAF
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs gap-1 opacity-80">
                        <MapPin className="w-3 h-3" />
                        {request.location_city}{request.neighborhood ? `, ${request.neighborhood}` : ''}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 bg-muted/10 flex gap-2 w-full">
                <Button
                    className="w-[65%] h-10 text-xs font-bold shadow-sm hover:shadow-md transition-all rounded-xl"
                    size="sm"
                    onClick={() => onRespond(request.id, 'i_have_this')}
                >
                    I have it
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-[35%] h-10 text-[10px] font-medium rounded-xl leading-tight px-1 text-center"
                    onClick={() => onRespond(request.id, 'i_know_someone')}
                >
                    I know someone
                </Button>
            </CardFooter>
        </Card>
    )
}
