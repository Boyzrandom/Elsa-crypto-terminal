"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("BTC");
  const [activeSymbol, setActiveSymbol] = useState("BTC");

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
      setError("Gagal menghubungi Advanced API.");
    }
  };

  useEffect(() => {
    fetchData(activeSymbol);
  }, [activeSymbol]);

  // Fungsi Pembantu untuk Format Angka
  const fNum = (num) => num ? Number(num).toLocaleString('en-US') : "0";

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'monospace' }}>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#00ffcc', margin: 0 }}>ADVANCED CRYPTO TERMINAL</h2>
        <p style={{ color: '#666', fontSize: '11px' }}>Powered by: Boyel2 HF Space</p>
      </div>

      {/* SEARCH FORM */}
      <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
            style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto 20px' }}>
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#1a1a1a', color: 'white', border: '1px solid #333' }}
          placeholder="Simbol (BTC, ETH, SOL)"
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#00ffcc', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>CEK</button>
      </form>

      {error && <div style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '20px' }}>⚠️ {error}</div>}

      {data ? (
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'grid', gap: '15px' }}>

          {/* 1. CARD HARGA UTAMA */}
          <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '15px', textAlign: 'center', border: '1px solid #333' }}>
            <div style={{ fontSize: '12px', color: '#888' }}>{activeSymbol}/USDT • 1H TIMEFRAME</div>
            <h1 style={{ fontSize: '48px', margin: '10px 0', color: 'white' }}>${fNum(data.close_price)}</h1>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00ffcc' }}>
               {data.market_sentiment?.fear_and_greed?.classification?.toUpperCase() || "NEUTRAL"}
            </div>
          </div>

          {/* 2. GRID INDIKATOR CANGGIH */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ color: '#888', fontSize: '11px' }}>FEAR & GREED</div>
              <div style={{ fontSize: '24px', color: '#ffcc00' }}>{data.market_sentiment?.fear_and_greed?.value || "0"}</div>
            </div>
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ color: '#888', fontSize: '11px' }}>SENTIMENT</div>
              <div style={{ fontSize: '16px', color: '#00ffcc' }}>{data.market_sentiment?.overall_sentiment || "WAITING"}</div>
            </div>
          </div>

          {/* 3. FIBONACCI LEVELS (Harta Karun!) */}
          <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '10px', textAlign: 'center' }}>FIBONACCI RETRACEMENT</div>
            <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
              {Object.entries(data.fibonacci_levels || {}).map(([level, price]) => (
                <div key={level} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '4px' }}>
                  <span style={{ color: '#666' }}>{level.replace('level_', 'Level ')}:</span>
                  <span style={{ color: '#00ffcc' }}>${fNum(price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. UPDATE TERAKHIR */}
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#444' }}>
            Last Sync: {data.last_updated}
          </div>

        </div>
      ) : (
        !error && <div style={{ textAlign: 'center', marginTop: '50px', color: '#00ffcc' }}>Menganalisis data dari Boyel2 Space...</div>
      )}
    </div>
  );
}
