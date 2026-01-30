import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const CHAT_URL = "https://izcnepuykfwfrusrooen.supabase.co/functions/v1/chat"

        const response = await fetch(CHAT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${anonKey}`,
                "apikey": anonKey || "",
            },
            body: JSON.stringify(body),
        })

        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json()
            if (!response.ok) {
                console.error("Chat Edge Function Error:", data)
                return NextResponse.json(data, { status: response.status })
            }
            return NextResponse.json(data)
        }

        const text = await response.text()
        console.error("Chat Edge Function Non-JSON Error:", {
            status: response.status,
            text,
        })
        return NextResponse.json(
            { error: text || "Failed to call chat function" },
            { status: response.status }
        )
    } catch (error: any) {
        console.error("Error in chat proxy:", error)
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        )
    }
}
