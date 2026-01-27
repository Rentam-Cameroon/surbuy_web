import { NextResponse } from 'next/server'

const DYNAMIC_TASK_URL = 'https://izcnepuykfwfrusrooen.supabase.co/functions/v1/auth-signup'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Sending request to dynamic-task:', JSON.stringify(body))

        const response = await fetch(DYNAMIC_TASK_URL, {
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
            console.error('Edge Function Error (dynamic-task):', text)
            console.error('Status:', response.status)
            return NextResponse.json({ error: text || 'Dynamic Task returned an error' }, { status: response.status })
        }
    } catch (error: any) {
        console.error('Error in dynamic-task proxy:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
