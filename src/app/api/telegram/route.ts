import { NextResponse } from 'next/server';

// 🤖 TOKEN LU AMAN DI SINI KARENA INI AREA BACKEND (SERVER)
const TELEGRAM_BOT_TOKEN = "5518512739:AAHi8ZyPar6hT9xbdQcsj2fx_WrhIilOSkA"; 
const TELEGRAM_CHAT_ID = "1731847118";

// Fungsi buat RADAR CHAT (GetUpdates)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const offset = searchParams.get('offset') || -1;
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset}`);
    const data = await res.json();
    return NextResponse.json(data);
}

// Fungsi buat KIRIM PESAN & GAMBAR (SendMessage & SendPhoto)
export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';

        // Kalau ada file gambar (Bukti Bayar)
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, { method: 'POST', body: formData });
            const data = await res.json();
            return NextResponse.json(data);
        } 
        // Kalau cuma teks (Live Chat CS / Review)
        else {
            const body = await request.json();
            body.chat_id = TELEGRAM_CHAT_ID;
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            return NextResponse.json(data);
        }
    } catch (error) {
        return NextResponse.json({ ok: false, error: 'Server Error' }, { status: 500 });
    }
}