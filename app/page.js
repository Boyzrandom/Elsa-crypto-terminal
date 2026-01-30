"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("BTC");
  const [activeSymbol, setActiveSymbol] = useState("BTC");
  const [chartMode, setChartMode] = useState("PYTHON"); // Default: Chart Server

  const fetchData = async (symbol) => {
    try {
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
    const interval = setInterval(() => fetchData(activeSymbol), 60000);
    return () => clearInterval(interval);
  }, [activeSymbol]);

  const fNum = (num) => num ? Number(num).toLocaleString('en-US') : "0";

  // --- LOGIKA PINTAR URL CHART ---
  const getChartSymbol = (sym) => {
    // Pastikan format selalu COIN/USDT agar backend Python bisa baca
    if (sym.includes('USDT')) return sym.replace('USDT', '/USDT'); 
    return `${sym}/USDT`;
  };

  const pythonChartUrl = `https://boyel2-backend-crypto.hf.space/api/chart/${getChartSymbol(activeSymbol)}/1h?t=${new Date().getTime()}`;

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'monospace' }}>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00ffcc', margin: 0 }}>ELSA PRO TERMINAL</h2>
        <div style={{ fontSize: '10px', color: '#666' }}>Engine: Boyel2 Python V2</div>
      </div>

      {/* SEARCH */}
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

          {/* HARGA */}
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

          {/* DUAL CHART VIEWER */}
          <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button onClick={() => setChartMode("PYTHON")} 
                      style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: chartMode === 'PYTHON' ? '#00ffcc' : '#333', color: chartMode === 'PYTHON' ? 'black' : 'white', cursor: 'pointer', fontSize: '12px' }}>
                📡 SERVER CHART
              </button>
              <button onClick={() => setChartMode("TV")} 
                      style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: chartMode === 'TV' ? '#00ffcc' : '#333', color: chartMode === 'TV' ? 'black' : 'white', cursor: 'pointer', fontSize: '12px' }}>
                📈 TRADINGVIEW
              </button>
            </div>

            {chartMode === 'PYTHON' ? (
              <div style={{ textAlign: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', borderRadius: '10px' }}>
                <img 
                  src={pythonChartUrl} 
                  alt="Chart Loading..." 
                  style={{ width: '100%', borderRadius: '10px' }}
                  onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerText = "⚠️ Gagal memuat grafik. Coba refresh atau gunakan TradingView."; }}
                />
              </div>
            ) : (
              <div style={{ height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
                 <iframe 
                    src={`https://s.tradingview.com/widgetembed/?symbol=BINANCE%3A${activeSymbol}USDT&interval=60&theme=dark&style=1&locale=id`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                 ></iframe>
              </div>
            )}
          </div>

          {/* INDIKATOR LAINNYA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>FEAR & GREED</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: data.market_sentiment?.fear_and_greed?.value > 50 ? '#00ff88' : '#ff4444' }}>
                  {data.market_sentiment?.fear_and_greed?.value || "0"}
                </div>
             </div>
             <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>SENTIMENT</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#00ffcc' }}>
                  {data.market_sentiment?.fear_and_greed?.classification?.toUpperCase()}
                </div>
             </div>
          </div>

        </div>
      ) : (
        !error && <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>Connecting to Boyel2 Engine...</div>
      )}
    </div>
  );
}
