"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("BTC");
  const [activeSymbol, setActiveSymbol] = useState("BTC");
  const [loading, setLoading] = useState(false);

  const fetchData = async (symbol) => {
    setLoading(true);
    try {
      // Menggunakan URL Backend Hugging Face Bos
      const res = await fetch(`https://boyel2-backend-crypto.hf.space/api/analyze?symbol=${symbol}`);
      const json = await res.json();

      // LOGIKA PRO: Memastikan angka tetap muncul meski nama variabel berbeda di Backend
      if (json) {
        setData({
          ...json,
          displayPrice: json.close_price || json.price || json.current_price || 0,
          displaySymbol: json.symbol || symbol
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(activeSymbol);
    const interval = setInterval(() => fetchData(activeSymbol), 60000);
    return () => clearInterval(interval);
  }, [activeSymbol]);

  const fNum = (n) => n ? Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }) : "0";

  return (
    <div style={{ backgroundColor: '#050505', color: '#00ffcc', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>

      {/* TERMINAL HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', letterSpacing: '2px' }}>ELSA PRO TERMINAL <span style={{ color: '#fff' }}>v3.5</span></h1>
          <div style={{ fontSize: '10px', color: '#444' }}>CORE UNIT: QUANTITATIVE INTELLIGENCE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#00ff88' }}>● SYSTEM_ENCRYPTED</div>
          <div style={{ fontSize: '10px', color: '#666' }}>{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* COMMAND INPUT */}
      <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
            style={{ display: 'flex', gap: '10px', maxWidth: '800px', margin: '0 auto 40px' }}>
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '15px', background: '#000', color: '#00ffcc', border: '1px solid #00ffcc', borderRadius: '4px', outline: 'none', boxShadow: '0 0 10px rgba(0,255,204,0.1)' }}
          placeholder="ENTER ASSET SYMBOL (e.g. BTC, ETH)..."
        />
        <button type="submit" style={{ padding: '0 30px', background: '#00ffcc', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>SCAN</button>
      </form>

      {/* DASHBOARD GRID */}
      {data && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

          {/* PRICE PANEL */}
          <div style={{ gridColumn: '1 / -1', border: '1px solid #333', padding: '30px', borderRadius: '12px', background: 'linear-gradient(145deg, #0a0a0a, #050505)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>{data.displaySymbol} / USD</div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>${fNum(data.displayPrice)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>SIGNAL_STATUS</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: data.signals?.final_signal === 'BUY' ? '#00ff88' : '#ff4444' }}>{data.signals?.final_signal || 'NEUTRAL'}</div>
              </div>
            </div>
          </div>

          {/* ANALYTICS PANEL */}
          <div style={{ border: '1px solid #1a1a1a', padding: '20px', borderRadius: '10px', background: '#080808' }}>
            <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px', borderBottom: '1px solid #111' }}>TECHNICAL_INDICATORS</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>RSI (14):</span>
              <span style={{ color: '#00ccff' }}>{fNum(data.technical_indicators?.rsi)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>TREND:</span>
              <span style={{ color: '#fff' }}>{data.signals?.trend || 'N/A'}</span>
            </div>
          </div>

          {/* ON-CHAIN PANEL */}
          <div style={{ border: '1px solid #1a1a1a', padding: '20px', borderRadius: '10px', background: '#080808' }}>
            <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px', borderBottom: '1px solid #111' }}>ON_CHAIN_DATA</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>NETWORK:</span>
              <span style={{ color: '#fff' }}>{data.fundamental_data?.onchain?.network || 'ETHEREUM'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>GAS_PRICE:</span>
              <span style={{ color: '#00ffcc' }}>{data.fundamental_data?.onchain?.gas_gwei?.Fast || 'N/A'} GWEI</span>
            </div>
          </div>

          {/* TRADING LEVELS */}
          <div style={{ gridColumn: '1 / -1', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '10px', background: '#080808' }}>
            <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px', borderBottom: '1px solid #111' }}>PIVOT_LEVELS_EXECUTION</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#ff4444' }}>RESISTANCE (R1)</div>
                <div style={{ fontSize: '18px' }}>{fNum(data.pivots?.R1)}</div>
              </div>
              <div style={{ borderLeft: '1px solid #222', borderRight: '1px solid #222' }}>
                <div style={{ fontSize: '10px', color: '#00ffcc' }}>PIVOT POINT</div>
                <div style={{ fontSize: '18px' }}>{fNum(data.pivots?.pivot)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#00ff88' }}>SUPPORT (S1)</div>
                <div style={{ fontSize: '18px' }}>{fNum(data.pivots?.S1)}</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {loading && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', color: '#00ffcc', fontSize: '12px' }}>
          [ EXECUTING_SYNC_DATA... ]
        </div>
      )}
    </div>
  );
}
