import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            console.warn('User KYC Status Error: No auth_token cookie found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const KYC_STATUS_URL = 'https://izcnepuykfwfrusrooen.supabase.co/functions/v1/user-kyc-status'

        console.log('User KYC Status: Proxying request (POST)')

        const response = await fetch(KYC_STATUS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${anonKey}`,
                'apikey': anonKey || '',
            },
            body: JSON.stringify({ token })
        })

        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            if (!response.ok) {
                console.error('User KYC Status Edge Function Error:', data)
                return NextResponse.json(data, { status: response.status })
            }
            return NextResponse.json(data)
        } else {
            const text = await response.text()
            console.error('User KYC Status Non-JSON Error:', {
                status: response.status,
                text
            })
            return NextResponse.json({ error: text || 'Failed to fetch user KYC status' }, { status: response.status })
        }
    } catch (error: any) {
        console.error('Error in user KYC status proxy:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
