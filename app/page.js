"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("BTC");
  const [activeSymbol, setActiveSymbol] = useState("BTC");
  const [loading, setLoading] = useState(false);

  // LOGIKA PENGAMBILAN DATA (ANTI-NOL)
  const fetchData = async (symbol) => {
    setLoading(true);
    try {
      // Menggunakan API Backend Hugging Face Bos
      const res = await fetch(`https://boyel2-backend-crypto.hf.space/api/analyze?symbol=${symbol}`);
      const json = await res.json();

      // Mencegah Error jika Backend mengirim format berbeda
      if (json) {
        setData({
          ...json,
          // Cari harga di mana saja agar tidak muncul $0
          displayPrice: json.close_price || json.price || json.current_price || 0,
          // Pastikan symbol ada
          displaySymbol: json.symbol || symbol,
          // Pastikan signal ada
          displaySignal: json.signals?.final_signal || "NEUTRAL"
        });
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
    setLoading(false);
  };

  // AUTO-REFRESH SETIAP 1 MENIT
  useEffect(() => {
    fetchData(activeSymbol);
    const interval = setInterval(() => fetchData(activeSymbol), 60000);
    return () => clearInterval(interval);
  }, [activeSymbol]);

  // FORMAT ANGKA MATA UANG
  const fNum = (n) => n ? Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }) : "0";

  return (
    <div style={{ backgroundColor: '#050505', color: '#00ffcc', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>

      {/* 1. HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', letterSpacing: '2px', textShadow: '0 0 10px rgba(0,255,204,0.3)' }}>ELSA TERMINAL <span style={{ color: '#fff' }}>v3.5</span></h1>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>QUANTITATIVE INTELLIGENCE UNIT</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#00ff88', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', background: '#00ff88', borderRadius: '50%', display: 'inline-block' }}></span>
            SYSTEM ONLINE
          </div>
        </div>
      </div>

      {/* 2. SEARCH FORM */}
      <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
            style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto 40px' }}>
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '15px', background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '5px', outline: 'none', fontFamily: 'monospace' }}
          placeholder="ENTER SYMBOL (BTC, ETH, SOL)..."
        />
        <button type="submit" style={{ padding: '0 25px', background: '#00ffcc', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          SCAN
        </button>
      </form>

      {/* 3. DASHBOARD DISPLAY */}
      {data && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

          {/* PANEL A: HARGA UTAMA */}
          <div style={{ gridColumn: '1 / -1', border: '1px solid #333', padding: '25px', borderRadius: '10px', background: 'linear-gradient(180deg, #0f0f0f 0%, #050505 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>ASSET PRICE ({data.displaySymbol})</div>
                <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#fff', textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>${fNum(data.displayPrice)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>AI RECOMMENDATION</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: data.displaySignal === 'BUY' ? '#00ff88' : (data.displaySignal === 'SELL' ? '#ff4444' : '#ffcc00') }}>
                  {data.displaySignal}
                </div>
              </div>
            </div>
          </div>

          {/* PANEL B: INDIKATOR TEKNIKAL */}
          <div style={{ border: '1px solid #222', padding: '20px', borderRadius: '10px', background: '#0a0a0a' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '5px' }}>TECHNICAL INDICATORS</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#888' }}>RSI (14):</span>
              <span style={{ color: '#00ccff' }}>{fNum(data.technical_indicators?.rsi)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#888' }}>SMA 50:</span>
              <span style={{ color: '#fff' }}>{fNum(data.technical_indicators?.sma50)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>TREND:</span>
              <span style={{ color: data.signals?.trend === 'UPTREND' ? '#00ff88' : '#ff4444' }}>{data.signals?.trend || 'N/A'}</span>
            </div>
          </div>

          {/* PANEL C: ON-CHAIN DATA */}
          <div style={{ border: '1px solid #222', padding: '20px', borderRadius: '10px', background: '#0a0a0a' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '5px' }}>ON-CHAIN METRICS</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#888' }}>NETWORK:</span>
              <span style={{ color: '#fff' }}>{data.fundamental_data?.onchain?.network || 'ETHEREUM'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>GAS (GWEI):</span>
              <span style={{ color: '#ffcc00' }}>{data.fundamental_data?.onchain?.gas_gwei?.Fast || 'Fetching...'}</span>
            </div>
          </div>

          {/* PANEL D: LEVEL TRADING (PIVOTS) */}
          <div style={{ gridColumn: '1 / -1', border: '1px solid #222', padding: '20px', borderRadius: '10px', background: '#080808' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '15px', textAlign: 'center' }}>KEY TRADING LEVELS (PIVOTS)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div style={{ background: '#111', padding: '10px', borderRadius: '5px' }}>
                 <div style={{ fontSize: '10px', color: '#ff4444' }}>RESISTANCE</div>
                 <div style={{ fontSize: '16px' }}>{fNum(data.pivots?.R1)}</div>
              </div>
              <div style={{ background: '#151515', padding: '10px', borderRadius: '5px', border: '1px solid #333' }}>
                 <div style={{ fontSize: '10px', color: '#00ffcc' }}>PIVOT</div>
                 <div style={{ fontSize: '16px' }}>{fNum(data.pivots?.pivot)}</div>
              </div>
              <div style={{ background: '#111', padding: '10px', borderRadius: '5px' }}>
                 <div style={{ fontSize: '10px', color: '#00ff88' }}>SUPPORT</div>
                 <div style={{ fontSize: '16px' }}>{fNum(data.pivots?.S1)}</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* LOADING INDICATOR */}
      {loading && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#000', border: '1px solid #00ffcc', padding: '10px 20px', borderRadius: '30px', color: '#00ffcc', fontSize: '12px' }}>
          PROCESSING DATA...
        </div>
      )}
    </div>
  );
}
