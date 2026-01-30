import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Ambil simbol dari input user (misal: BTC)
    let rawSymbol = searchParams.get('symbol')?.toUpperCase() || 'BTC';

    // FORMATTING: Pastikan formatnya "BTC/USDT" agar backend Python mengerti
    let formattedSymbol = rawSymbol;
    if (!rawSymbol.includes('/')) {
        if (rawSymbol.endsWith('USDT')) {
            formattedSymbol = rawSymbol.replace('USDT', '/USDT');
        } else {
            formattedSymbol = `${rawSymbol}/USDT`;
        }
    }

    // Panggil API Python Anda di Hugging Face
    // Pastikan URL ini sesuai dengan Space Anda (boyel2-backend-crypto)
    const targetUrl = `https://boyel2-backend-crypto.hf.space/api/analyze?symbol=${formattedSymbol}`;

    const res = await fetch(targetUrl, { 
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error("Gagal mengambil data dari server Python.");

    const json = await res.json();
    return NextResponse.json(json);

  } catch (err) {
    return NextResponse.json({ error: "Koneksi ke Brain Error", details: err.message }, { status: 500 });
  }
}
