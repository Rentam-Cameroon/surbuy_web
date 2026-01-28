import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        const response = await fetch(`${supabaseUrl}/functions/v1/sell-product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': anonKey!,
                'Authorization': `Bearer ${anonKey}`
            },
            body: JSON.stringify({
                ...body,
                token
            })
        })

        const responseText = await response.text()
        console.log('Edge Function Response:', responseText)

        let data
        try {
            data = JSON.parse(responseText)
        } catch (e) {
            console.error('Failed to parse response as JSON:', responseText.substring(0, 500))
            return NextResponse.json({
                error: 'Invalid response from server',
                details: responseText.substring(0, 200)
            }, { status: 500 })
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error: any) {
        console.error('SELL PRODUCT PROXY ERROR:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
