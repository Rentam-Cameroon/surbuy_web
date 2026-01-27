import { NextResponse } from 'next/server'

const SUPER_WORKER_URL = 'https://izcnepuykfwfrusrooen.supabase.co/functions/v1/super-worker'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Sending request to check-user:', JSON.stringify(body))

        const response = await fetch(SUPER_WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            },
            body: JSON.stringify(body),
        })

        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            return NextResponse.json(data, { status: response.status })
        } else {
            const text = await response.text()
            console.error('Edge Function Error (check-user):', text)
            console.error('Status:', response.status)
            return NextResponse.json({ error: text || 'Super Worker returned an error' }, { status: response.status })
        }
    } catch (error: any) {
        console.error('Error in check-user proxy:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
