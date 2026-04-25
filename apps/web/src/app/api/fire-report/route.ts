import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function POST(req: NextRequest) {
    try {
        const payload = await getPayload({ config });
        const formData = await req.formData();

        const name = formData.get('name') as string;
        const issue = formData.get('issue') as string;
        const briefing = formData.get('briefing') as string;
        const files = formData.getAll('files') as File[];

        if (!name || !issue || !briefing) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Upload files to Media collection first
        const mediaIds: string[] = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());

            const mediaDoc = await payload.create({
                collection: 'media',
                data: {
                    alt: `Fire report attachment from ${name}`,
                },
                file: {
                    data: buffer,
                    name: file.name,
                    mimetype: file.type,
                    size: file.size,
                },
            });

            mediaIds.push(String(mediaDoc.id));
        }

        // 2. Create the Fire Report entry
        await payload.create({
            collection: 'fire-reports',
            data: {
                name,
                issue,
                briefing,
                attachments: mediaIds.map(id => ({ file: id })),
            },
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Fire report submission error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to submit report' },
            { status: 500 }
        );
    }
}
