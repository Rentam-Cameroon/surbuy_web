import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            console.warn('KYC Status Error: No auth_token cookie found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Decode user_id from token payload (first segment)
        let userId = ''
        try {
            const payloadB64 = token.split('.')[0]
            const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString())
            userId = payload.sub
        } catch (e) {
            console.error('Failed to parse user_id from token:', e)
            return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
        }

        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const KYC_STATUS_URL = 'https://izcnepuykfwfrusrooen.supabase.co/functions/v1/get-kyc-status'

        console.log(`KYC Status: Proxying request (POST) for user_id ${userId}`)

        const response = await fetch(KYC_STATUS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${anonKey}`,
                'apikey': anonKey || '',
            },
            body: JSON.stringify({
                user_id: userId,
                token: token
            })
        })

        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            if (!response.ok) {
                console.error('KYC Status Edge Function Error:', data)
                return NextResponse.json(data, { status: response.status })
            }
            return NextResponse.json(data)
        } else {
            const text = await response.text()
            console.error('KYC Status Non-JSON Error:', {
                status: response.status,
                text
            })
            return NextResponse.json({ error: text || 'Failed to fetch KYC status' }, { status: response.status })
        }
    } catch (error: any) {
        console.error('Error in KYC status proxy:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
