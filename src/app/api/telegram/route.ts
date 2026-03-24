export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = "5518512739:AAHi8ZyPar6hT9xbdQcsj2fx_WrhIilOSkA";
const TELEGRAM_CHAT_ID = "1731847118";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get('offset') || "-1";
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ ok: false, error: 'Failed to fetch Telegram' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, { 
                method: 'POST', 
                body: formData 
            });
            const data = await res.json();
            return NextResponse.json(data);
        } else {
            const body = await request.json();
            body.chat_id = TELEGRAM_CHAT_ID;
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(body) 
            });
            const data = await res.json();
            return NextResponse.json(data);
        }
    } catch (error) {
        return NextResponse.json({ ok: false, error: 'Server Error' }, { status: 500 });
    }
}