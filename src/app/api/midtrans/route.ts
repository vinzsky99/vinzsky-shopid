export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { order_id, gross_amount, customer_details } = await request.json();

    // 🔐 MENGAMBIL KUNCI DARI BRANKAS .ENV
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    const response = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(serverKey + ':').toString('base64')
      },
      body: JSON.stringify({
        transaction_details: { order_id, gross_amount: Math.round(gross_amount) },
        customer_details
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}