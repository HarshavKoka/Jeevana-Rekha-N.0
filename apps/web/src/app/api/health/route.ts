import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

// Always fetch fresh — health checks must not be cached
export const dynamic = 'force-dynamic';

export async function GET() {
    const timestamp = new Date().toISOString();
    try {
        const payload = await getPayload({ config });
        // Lightweight DB ping — just fetch 1 category doc
        await payload.find({ collection: 'categories', limit: 1 });

        return NextResponse.json(
            { status: 'ok', service: 'jeevanarekha', db: 'connected', timestamp },
            { status: 200 },
        );
    } catch {
        return NextResponse.json(
            { status: 'error', service: 'jeevanarekha', db: 'disconnected', timestamp },
            { status: 503 },
        );
    }
}
