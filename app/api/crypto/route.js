import { NextResponse } from 'next/server';

/**
 * ELSA SAFE ENGINE v3.0
 * Source: CryptoCompare (Anti-Block & Public API)
 */

function detectPattern(candles) {
  try {
    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2];

    // CryptoCompare structure: { close, open, high, low, ... }
    const c1 = last.close, o1 = last.open, h1 = last.high, l1 = last.low;
    const c2 = prev.close, o2 = prev.open;
    const body = Math.abs(c1 - o1);

    // Logic Pattern Sederhana
    if (c2 < o2 && c1 > o1 && o1 <= c2 && c1 >= o2) return "Bullish Engulfing 🚀";
    if (c2 > o2 && c1 < o1 && o1 >= c2 && c1 <= o2) return "Bearish Engulfing 📉";
    if ((Math.min(o1, c1) - l1) > body * 2) return "Hammer 🔨";

    return "Normal";
  } catch (e) {
    return "Normal";
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Bersihkan simbol (misal ETHUSDT -> ETH) agar cocok dengan CryptoCompare
    let rawSymbol = searchParams.get('symbol')?.toUpperCase() || 'ETH';
    const coin = rawSymbol.replace('USDT', '').replace('USD', '').replace('BUSD', ''); 

    // URL API Publik CryptoCompare (Aman & Stabil)
    const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${coin}&tsym=USD&limit=30`;

    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();

    // Validasi Data
    if (json.Response === 'Error' || !json.Data || !json.Data.Data) {
      return NextResponse.json({ error: `Koin ${coin} tidak ditemukan.` }, { status: 404 });
    }

    const candles = json.Data.Data; // Array data (Time Ascending)
    const closes = candles.map(c => c.close);
    const currentPrice = closes[closes.length - 1];

    // Hitung EMA 20
    const k = 2 / (20 + 1);
    let ema20 = closes[0];
    closes.forEach(p => { ema20 = (p * k) + (ema20 * (1 - k)); });

    // Hitung StochRSI
    const last14 = closes.slice(-14);
    const low = Math.min(...last14);
    const high = Math.max(...last14);
    let stochRsi = 50; // Default middle
    if (high - low !== 0) {
        stochRsi = ((currentPrice - low) / (high - low)) * 100;
    }

    // Tentukan Trend & Signal
    const trend = currentPrice > ema20 ? "BULLISH" : "BEARISH";
    let signal = "WAIT";

    if (stochRsi < 20 && trend === "BULLISH") signal = "STRONG BUY";
    else if (stochRsi > 80 && trend === "BEARISH") signal = "STRONG SELL";
    else if (stochRsi < 20) signal = "BUY (RISKY)";
    else if (stochRsi > 80) signal = "SELL (RISKY)";

    return NextResponse.json({
      symbol: `${coin}/USD`,
      price: currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ema20: ema20.toFixed(2),
      stochRsi: stochRsi.toFixed(2),
      trend,
      signal,
      pattern: detectPattern(candles)
    });

  } catch (err) {
    return NextResponse.json({ error: "Gagal terhubung ke server data." }, { status: 500 });
  }
}
