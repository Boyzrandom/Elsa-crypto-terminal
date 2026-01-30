import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Ambil simbol, default BTCUSDT
    let rawSymbol = searchParams.get('symbol')?.toUpperCase() || 'BTCUSDT';
    
    // FORMATTING: Ubah "BTCUSDT" menjadi "BTC/USDT" agar sesuai dengan API Boyel2
    // Jika user mengetik "BTC", kita jadikan "BTC/USDT"
    let formattedSymbol = rawSymbol;
    if (!rawSymbol.includes('/')) {
        if (rawSymbol.endsWith('USDT')) {
            formattedSymbol = rawSymbol.replace('USDT', '/USDT');
        } else {
            formattedSymbol = `${rawSymbol}/USDT`;
        }
    }

    // URL Target: Hugging Face Space Anda
    const targetUrl = `https://boyel2-backend-crypto.hf.space/api/analyze?symbol=${formattedSymbol}&timeframe=1h`;

    console.log(`Fetching: ${targetUrl}`); // Untuk cek di Log Vercel

    // Fetch ke Hugging Face
    const res = await fetch(targetUrl, { 
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error(`Gagal mengambil data dari Boyel2 (Status: ${res.status})`);
    }

    const json = await res.json();

    // Kirim data mentah dari Boyel2 langsung ke Frontend
    return NextResponse.json(json);

  } catch (err) {
    console.error("Proxy Error:", err);
    return NextResponse.json({ 
        error: "Gagal terhubung ke Advanced API.", 
        details: err.message 
    }, { status: 500 });
  }
}
