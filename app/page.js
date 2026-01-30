"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("BTC");
  const [activeSymbol, setActiveSymbol] = useState("BTC");
  const [chartMode, setChartMode] = useState("PYTHON"); // Default: Grafik Server Aman

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
    const interval = setInterval(() => fetchData(activeSymbol), 60000); // Auto-refresh 60 detik
    return () => clearInterval(interval);
  }, [activeSymbol]);

  const fNum = (num) => num ? Number(num).toLocaleString('en-US', {maximumFractionDigits: 2}) : "0";

  // URL Grafik Python (Langsung dari HF)
  const getChartSymbol = (sym) => {
    if (sym.includes('USDT')) return sym.replace('USDT', '/USDT');
    return `${sym}/USDT`;
  };
  const pythonChartUrl = `https://boyel2-backend-crypto.hf.space/api/chart/${getChartSymbol(activeSymbol)}/1h?t=${new Date().getTime()}`;

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'monospace' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#00ffcc', margin: 0 }}>ELSA SAFE TERMINAL</h2>
        <p style={{ color: '#666', fontSize: '11px' }}>Engine: CryptoCompare (US-Safe)</p>
      </div>

      {/* SEARCH */}
      <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
            style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto 20px' }}>
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#1a1a1a', color: 'white', border: '1px solid #333' }}
          placeholder="Simbol (BTC, ETH)"
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#00ffcc', border: 'none', borderRadius: '8px', fontWeight: 'bold', color:'black', cursor:'pointer' }}>GO</button>
      </form>

      {error && <div style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '20px' }}>⚠️ {error}</div>}

      {data ? (
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gap: '20px' }}>
          
          {/* HARGA & TREND */}
          <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px', borderLeft: `5px solid ${data.signals?.trend_signal === 'UPTREND' ? '#00ff88' : '#ff4444'}` }}>
             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                   <div style={{ fontSize: '12px', color: '#888' }}>{data.symbol}</div>
                   <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>${fNum(data.close_price)}</div>
                </div>
                <div style={{textAlign:'right'}}>
                   <div style={{ fontSize: '10px', color: '#888' }}>TREND</div>
                   <div style={{ fontSize: '20px', fontWeight: 'bold', color: data.signals?.trend_signal === 'UPTREND' ? '#00ff88' : '#ff4444' }}>
                     {data.signals?.trend_signal}
                   </div>
                </div>
             </div>
          </div>

          {/* DUAL CHART VIEWER */}
          <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button onClick={() => setChartMode("PYTHON")} 
                      style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: chartMode === 'PYTHON' ? '#00ffcc' : '#333', color: chartMode === 'PYTHON' ? 'black' : 'white', cursor: 'pointer', fontSize: '12px' }}>
                📡 SERVER CHART (Aman)
              </button>
              <button onClick={() => setChartMode("TV")} 
                      style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: chartMode === 'TV' ? '#00ffcc' : '#333', color: chartMode === 'TV' ? 'black' : 'white', cursor: 'pointer', fontSize: '12px' }}>
                📈 TRADINGVIEW
              </button>
            </div>

            {chartMode === 'PYTHON' ? (
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={pythonChartUrl} 
                  alt="Chart Analisis" 
                  style={{ width: '100%', borderRadius: '10px', border: '1px solid #333' }}
                  onError={(e) => { e.target.style.display='none'; }}
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

          {/* INDIKATOR GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             {/* Fear & Greed */}
             <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>FEAR & GREED</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: data.market_sentiment?.fear_and_greed?.value > 50 ? '#00ff88' : '#ff4444' }}>
                  {data.market_sentiment?.fear_and_greed?.value || "0"}
                </div>
                <div style={{ fontSize: '12px', color: 'white' }}>{data.market_sentiment?.fear_and_greed?.classification}</div>
             </div>
             {/* RSI */}
             <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>RSI (14)</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffcc00' }}>
                  {Number(data.technical_indicators?.rsi).toFixed(1)}
                </div>
                <div style={{ fontSize: '12px', color: 'white' }}>
                    {data.technical_indicators?.rsi > 70 ? 'Overbought' : data.technical_indicators?.rsi < 30 ? 'Oversold' : 'Normal'}
                </div>
             </div>
          </div>

          {/* FIBONACCI LEVELS */}
          <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '10px', textAlign: 'center', borderBottom:'1px solid #333', paddingBottom:'5px' }}>
                LEVEL FIBONACCI (Support & Resistance)
            </div>
            <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
              {data.fibonacci_levels && Object.entries(data.fibonacci_levels).map(([level, price]) => (
                <div key={level} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>{level}:</span>
                  <span style={{ color: '#00ffcc', fontWeight:'bold' }}>${fNum(price)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        !error && <div style={{ textAlign: 'center', marginTop: '50px', color: '#00ffcc' }}>Menghubungkan ke Elsa Brain (Safe Mode)...</div>
      )}
    </div>
  );
}
