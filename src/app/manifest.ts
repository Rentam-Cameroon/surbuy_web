import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Surbuy',
        short_name: 'Surbuy',
        description: 'Cameroon\'s Premium Marketplace',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#5e17eb',
        icons: [
            {
                src: '/surbuy-icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png'
            },
            {
                src: '/icon-512-maskable.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ],
    }
}
