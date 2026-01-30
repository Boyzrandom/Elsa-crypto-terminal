"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [query, setQuery] = useState("ETHUSDT");
  const [activeSymbol, setActiveSymbol] = useState("ETHUSDT");
  const [activeTab, setActiveTab] = useState("analysis"); // Tab: analysis atau chart

  const fetchData = async (symbol) => {
    try {
      const res = await fetch(`/api/crypto?symbol=${symbol}`);
      const json = await res.json();
      if (!json.error) {
        setData(json);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(activeSymbol);
    const interval = setInterval(() => fetchData(activeSymbol), 30000);
    return () => clearInterval(interval);
  }, [activeSymbol]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setActiveSymbol(query.toUpperCase().replace(/\s/g, ''));
  };

  if (!data) return <div style={{padding: '50px', color: '#00ffcc', textAlign: 'center', backgroundColor: '#0f0f0f', minHeight: '100vh'}}>Inisialisasi Elsa Terminal...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'monospace' }}>
      
      {/* 1. Navigasi & Search */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex: 2, display: 'flex', gap: '10px', minWidth: '300px' }}>
          <input 
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Contoh: BTCUSDT"
            style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#00ffcc', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LACAK</button>
        </form>
        
        {/* Tab Switcher */}
        <div style={{ flex: 1, display: 'flex', gap: '5px', minWidth: '200px' }}>
          <button onClick={() => setActiveTab('analysis')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'analysis' ? '#333' : '#1a1a1a', color: activeTab === 'analysis' ? '#00ffcc' : '#888', cursor: 'pointer' }}>DATA</button>
          <button onClick={() => setActiveTab('chart')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'chart' ? '#333' : '#1a1a1a', color: activeTab === 'chart' ? '#00ffcc' : '#888', cursor: 'pointer' }}>CHART</button>
        </div>
      </div>

      {/* 2. Konten Berdasarkan Tab */}
      {activeTab === 'analysis' ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Card Utama */}
          <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '15px', borderLeft: `8px solid ${data.trend === 'BULLISH' ? '#00ff88' : '#ff4d4d'}` }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>{data.symbol} • {data.trend} • {lastUpdated}</div>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>${data.price}</div>
            <div style={{ marginTop: '10px' }}>
               <span style={{ color: '#888' }}>Pattern: </span>
               <span style={{ color: '#00ffcc', fontWeight: 'bold' }}>{data.pattern}</span>
            </div>
          </div>

          {/* Grid Indikator */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ color: '#888', fontSize: '11px' }}>STOCH RSI</div>
              <div style={{ fontSize: '28px', color: '#ffcc00' }}>{data.stochRsi}%</div>
            </div>
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ color: '#888', fontSize: '11px' }}>REKOMENDASI</div>
              <div style={{ fontSize: '18px', color: data.signal.includes('BUY') ? '#00ff88' : '#ff4d4d' }}>{data.signal}</div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab TradingView */
        <div style={{ height: '600px', backgroundColor: '#1a1a1a', borderRadius: '15px', overflow: 'hidden' }}>
          <iframe
            style={{ width: '100%', height: '100%', border: 'none' }}
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_76d4d&symbol=BINANCE%3A${activeSymbol}&interval=60&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=id&utm_source=replit&utm_medium=widget&utm_campaign=chart&utm_term=BINANCE%3A${activeSymbol}`}
          ></iframe>
        </div>
      )}

      {/* 3. Link Website Penting (Sidebar-like Section) */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <a href={`https://www.binance.com/id/trade/${activeSymbol.replace('USDT', '_USDT')}`} target="_blank" style={{ padding: '10px 15px', background: '#252525', borderRadius: '5px', fontSize: '12px', color: '#f3ba2f', textDecoration: 'none' }}>🔗 Buka Binance</a>
        <a href="https://cryptopanic.com/" target="_blank" style={{ padding: '10px 15px', background: '#252525', borderRadius: '5px', fontSize: '12px', color: '#00ffcc', textDecoration: 'none' }}>📰 Berita Crypto</a>
        <a href="https://coinmarketcap.com/" target="_blank" style={{ padding: '10px 15px', background: '#252525', borderRadius: '5px', fontSize: '12px', color: '#3861fb', textDecoration: 'none' }}>📊 MarketCap</a>
      </div>

    </div>
  );
}
