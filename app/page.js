"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("BTC");
  const [activeSymbol, setActiveSymbol] = useState("BTC");
  const [chartMode, setChartMode] = useState("PYTHON"); // Pilihan: PYTHON (Anti-Blokir) atau TV (TradingView)

  const fetchData = async (symbol) => {
    try {
      // 1. Ambil Data Analisis (JSON)
      const res = await fetch(`/api/crypto?symbol=${symbol}`);
      const json = await res.json();

      if (json.error) {
        setError(json.error);
        setData(null);
      } else {
        setData(json);
        setError(null);
      }
    } catch (err) {
      setError("Gagal menghubungi server.");
    }
  };

  useEffect(() => {
    fetchData(activeSymbol);
    // Refresh data setiap 60 detik
    const interval = setInterval(() => fetchData(activeSymbol), 60000);
    return () => clearInterval(interval);
  }, [activeSymbol]);

  // Format Angka Cantik
  const fNum = (num) => num ? Number(num).toLocaleString('en-US') : "0";

  // URL Grafik Python (Langsung dari Hugging Face agar cepat)
  // Kita ubah simbol "/" jadi "-" karena URL tidak boleh ada 2 slash
  const pythonChartUrl = `https://boyel2-backend-crypto.hf.space/api/chart/${activeSymbol.replace('USDT', '/USDT')}/1h?t=${new Date().getTime()}`;

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'monospace' }}>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00ffcc', margin: 0 }}>ELSA PRO TERMINAL</h2>
        <div style={{ fontSize: '10px', color: '#666' }}>Engine: Boyel2 Python V2</div>
      </div>

      {/* SEARCH BAR */}
      <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
            style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto 20px' }}>
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#1a1a1a', color: 'white', border: '1px solid #333' }}
          placeholder="Cari Koin (BTC, ETH)"
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#00ffcc', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>GO</button>
      </form>

      {error && <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '10px', border: '1px solid #ff4d4d', borderRadius: '8px' }}>⚠️ {error}</div>}

      {data ? (
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gap: '20px' }}>

          {/* 1. HARGA UTAMA */}
          <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #00ffcc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#888' }}>{activeSymbol}/USDT</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>${fNum(data.close_price)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#888' }}>TREND</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: data.signals?.trend_signal?.includes('Uptrend') ? '#00ff88' : '#ff4444' }}>
                {data.signals?.trend_signal || "NEUTRAL"}
              </div>
            </div>
          </div>

          {/* 2. SENTIMEN METER (Order Book Pressure) */}
          <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>TEKANAN PASAR (Order Book)</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00ffcc' }}>
                {data.market_sentiment?.order_book?.market_pressure?.toUpperCase()}
              </span>
            </div>
            {/* Visualisasi Bar Bid vs Ask */}
            <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ flex: data.market_sentiment?.order_book?.bid_volume || 1, background: '#00ff88' }}></div>
              <div style={{ flex: data.market_sentiment?.order_book?.ask_volume || 1, background: '#ff4444' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '10px', color: '#666' }}>
              <span>BUY VOL: {fNum(data.market_sentiment?.order_book?.bid_volume)}</span>
              <span>SELL VOL: {fNum(data.market_sentiment?.order_book?.ask_volume)}</span>
            </div>
          </div>

          {/* 3. CHART SECTION (DUAL MODE) */}
          <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '15px' }}>
            {/* Tombol Ganti Mode */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button onClick={() => setChartMode("PYTHON")} 
                      style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: chartMode === 'PYTHON' ? '#00ffcc' : '#333', color: chartMode === 'PYTHON' ? 'black' : 'white', cursor: 'pointer', fontSize: '12px' }}>
                📡 SERVER CHART (Anti-Blokir)
              </button>
              <button onClick={() => setChartMode("TV")} 
                      style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: chartMode === 'TV' ? '#00ffcc' : '#333', color: chartMode === 'TV' ? 'black' : 'white', cursor: 'pointer', fontSize: '12px' }}>
                📈 TRADINGVIEW (Interaktif)
              </button>
            </div>

            {chartMode === 'PYTHON' ? (
              // MODE 1: Gambar Statis dari Python (Aman)
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={pythonChartUrl} 
                  alt="Chart Analisis" 
                  style={{ width: '100%', borderRadius: '10px', border: '1px solid #333' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/1a1a1a/FFF?text=Gagal+Muat+Chart"; }}
                />
                <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>*Grafik digenerate otomatis oleh server Python Hugging Face</div>
              </div>
            ) : (
              // MODE 2: TradingView Widget (Interaktif tapi rawan blokir)
              <div style={{ height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
                 <iframe 
                    src={`https://s.tradingview.com/widgetembed/?symbol=BINANCE%3A${activeSymbol}USDT&interval=60&theme=dark&style=1&locale=id`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                 ></iframe>
              </div>
            )}
          </div>

          {/* 4. DATA SENTIMEN LAINNYA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             {/* Fear & Greed */}
             <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>FEAR & GREED</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: data.market_sentiment?.fear_and_greed?.value > 50 ? '#00ff88' : '#ff4444' }}>
                  {data.market_sentiment?.fear_and_greed?.value || "0"}
                </div>
                <div style={{ fontSize: '12px', color: 'white' }}>{data.market_sentiment?.fear_and_greed?.classification}</div>
             </div>

             {/* Sinyal Volume */}
             <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>VOLUME STATUS</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffcc00' }}>
                  {data.market_sentiment?.volume_analysis?.volume_status || "N/A"}
                </div>
                <div style={{ fontSize: '12px', color: 'white' }}>Ratio: {data.market_sentiment?.volume_analysis?.volume_ratio}x</div>
             </div>
          </div>

        </div>
      ) : (
        !error && <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>Menghubungkan ke Boyel2 Brain...</div>
      )}
    </div>
  );
}
