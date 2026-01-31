import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !anonKey) {
            console.error('Missing Supabase environment variables')
            return NextResponse.json({ error: 'Server configuration error: Missing environment variables' }, { status: 500 })
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': anonKey!,
                'Authorization': `Bearer ${anonKey}`
            },
            body: JSON.stringify(body)
        })

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error: any) {
        console.error('CATEGORIES PROXY ERROR:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
