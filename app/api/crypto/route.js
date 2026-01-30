import { NextResponse } from 'next/server';

/**
 * ELSA BACKEND ENGINE v1.6 - BYBIT EDITION
 * Jalur data lebih stabil dan cepat.
 */

function detectPattern(list) {
  if (!list || list.length < 2) return "Normal";

  // Data Bybit: [startTime, open, high, low, close, volume, turnover]
  const last = list[0]; // Bybit memberikan data terbaru di index 0
  const prev = list[1];

  const o1 = parseFloat(last[1]), h1 = parseFloat(last[2]), l1 = parseFloat(last[3]), c1 = parseFloat(last[4]);
  const o2 = parseFloat(prev[1]), c2 = parseFloat(prev[4]);

  const body = Math.abs(c1 - o1);
  if (c2 < o2 && c1 > o1 && o1 <= c2 && c1 >= o2) return "Bullish Engulfing 🚀";
  if (c2 > o2 && c1 < o1 && o1 >= c2 && c1 <= o2) return "Bearish Engulfing 📉";
  if ((Math.min(o1, c1) - l1) > body * 2) return "Hammer 🔨";

  return "Normal";
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol')?.toUpperCase() || 'ETHUSDT';

    // 1. Fetch ke Bybit V5 API (Public - No Key Needed)
    const res = await fetch(`https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=60&limit=60`, {
      cache: 'no-store'
    });

    const json = await res.json();

    // 2. Validasi Struktur Bybit (result.list)
    if (!json.result || !Array.isArray(json.result.list) || json.result.list.length === 0) {
      return NextResponse.json({ error: `Simbol ${symbol} tidak ditemukan di Bybit.` }, { status: 404 });
    }

    const list = json.result.list; // Bybit list: newest to oldest
    const closes = list.map(item => parseFloat(item[4])).reverse(); // Balik urutan agar EMA benar (oldest to newest)
    const currentPrice = closes[closes.length - 1];

    // 3. Hitung EMA 20
    const k = 2 / (20 + 1);
    let ema20 = closes[0];
    closes.forEach(p => {
      ema20 = (p * k) + (ema20 * (1 - k));
    });

    // 4. Hitung StochRSI Sederhana
    const last14 = closes.slice(-14);
    const low = Math.min(...last14);
    const high = Math.max(...last14);
    const stochRsi = ((currentPrice - low) / (high - low)) * 100;

    // 5. Kesimpulan Trend & Sinyal
    const trend = currentPrice > ema20 ? "BULLISH" : "BEARISH";
    let signal = "WAIT";
    if (stochRsi < 20 && trend === "BULLISH") signal = "STRONG BUY";
    else if (stochRsi > 80 && trend === "BEARISH") signal = "STRONG SELL";

    return NextResponse.json({
      symbol,
      price: currentPrice.toLocaleString('en-US'),
      ema20: ema20.toFixed(2),
      stochRsi: stochRsi.toFixed(2),
      trend,
      signal,
      pattern: detectPattern(list)
    });

  } catch (err) {
    return NextResponse.json({ error: "Koneksi Bybit bermasalah." }, { status: 500 });
  }
}
