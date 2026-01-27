import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            console.warn('KYC Upload Error: No auth_token cookie found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Decode user_id from token payload
        let userId = ''
        try {
            const payloadB64 = token.split('.')[0]
            const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString())
            userId = payload.sub
        } catch (e) {
            console.error('Failed to parse user_id from token:', e)
            return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
        }

        const body = await req.json()
        const { docType, docName, fileBase64, fileExt, debug } = body

        const enrichedBody = {
            token,
            user_id: userId,
            document_type: docType,
            document_name: docName || null,
            file_base64: fileBase64,
            file_ext: fileExt,
            debug: debug === true
        }

        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const KYC_UPLOAD_URL = `${supabaseUrl}/functions/v1/upload-kyc-document`

        console.log(`KYC Upload: Proxying request for user_id ${userId}, type ${docType}`)

        const response = await fetch(KYC_UPLOAD_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${anonKey}`,
                'apikey': anonKey || '',
            },
            body: JSON.stringify(enrichedBody)
        })

        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            if (!response.ok) {
                console.error('KYC Upload Edge Function Error:', data)
                return NextResponse.json(data, { status: response.status })
            }
            return NextResponse.json(data)
        } else {
            const text = await response.text()
            console.error('KYC Upload Non-JSON Error:', {
                status: response.status,
                text
            })
            return NextResponse.json({ error: text || 'Failed to upload KYC document' }, { status: response.status })
        }
    } catch (error: any) {
        console.error('Error in KYC upload proxy:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
