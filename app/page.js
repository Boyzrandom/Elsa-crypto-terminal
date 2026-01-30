"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("ETHUSDT");
  const [activeSymbol, setActiveSymbol] = useState("ETHUSDT");
  const [activeTab, setActiveTab] = useState("analysis");

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
      setError("Gagal terhubung ke API Vercel.");
    }
  };

  useEffect(() => {
    fetchData(activeSymbol);
    const interval = setInterval(() => fetchData(activeSymbol), 30000);
    return () => clearInterval(interval);
  }, [activeSymbol]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'monospace' }}>
      {/* Search & Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} style={{ flex: 2, display: 'flex', gap: '10px' }}>
          <input 
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#00ffcc', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>TRACK</button>
        </form>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => setActiveTab('analysis')} style={{ padding: '10px', borderRadius: '8px', backgroundColor: activeTab === 'analysis' ? '#333' : '#1a1a1a', color: 'white' }}>DATA</button>
          <button onClick={() => setActiveTab('chart')} style={{ padding: '10px', borderRadius: '8px', backgroundColor: activeTab === 'chart' ? '#333' : '#1a1a1a', color: 'white' }}>CHART</button>
        </div>
      </div>

      {error && <div style={{ background: '#4a0000', padding: '15px', borderRadius: '8px', color: '#ff8888', marginBottom: '20px' }}>⚠️ Error: {error}</div>}

      {!data && !error ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#00ffcc' }}>Menghubungkan ke Terminal Elsa...</div>
      ) : data ? (
        activeTab === 'analysis' ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '15px', borderLeft: `8px solid ${data.trend === 'BULLISH' ? '#00ff88' : '#ff4d4d'}` }}>
              <div style={{ fontSize: '14px', color: '#888' }}>{data.symbol} / {data.trend}</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>${data.price}</div>
              <div style={{ color: '#00ffcc', marginTop: '10px' }}>Pattern: {data.pattern}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ color: '#888' }}>STOCH RSI</div>
                <div style={{ fontSize: '24px', color: '#ffcc00' }}>{data.stochRsi}%</div>
              </div>
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ color: '#888' }}>REKOMENDASI</div>
                <div style={{ fontSize: '18px', color: data.signal.includes('BUY') ? '#00ff88' : '#ff4d4d' }}>{data.signal}</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: '500px', borderRadius: '15px', overflow: 'hidden' }}>
            <iframe style={{ width: '100%', height: '100%', border: 'none' }} src={`https://s.tradingview.com/widgetembed/?symbol=BINANCE%3A${activeSymbol}&interval=60&theme=dark`}></iframe>
          </div>
        )
      ) : null}
    </div>
  );
}
