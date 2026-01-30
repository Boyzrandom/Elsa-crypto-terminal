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
      const res = await fetch(`https://boyel2-backend-crypto.hf.space/api/analyze?symbol=${symbol}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);
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
    <div style={{ backgroundColor: '#050505', color: '#00ffcc', minHeight: '100vh', padding: '20px', fontFamily: '"Segoe UI", monospace' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #111', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', letterSpacing: '2px' }}>ELSA PRO <span style={{ color: '#fff' }}>v3.5</span></h1>
          <div style={{ fontSize: '10px', color: '#444' }}>QUANTITATIVE INTELLIGENCE UNIT</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#00ff88' }}>● SYSTEM ONLINE</div>
        </div>
      </div>

      {/* SEARCH FORM */}
      <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
            style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto 30px' }}>
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '15px', borderRadius: '8px', background: '#0a0a0a', color: 'white', border: '1px solid #222', outline: 'none' }}
          placeholder="SEARCH ASSET (ETH, BTC)..."
        />
        <button type="submit" style={{ padding: '0 25px', background: '#00ffcc', color: 'black', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SCAN</button>
      </form>

      {/* MAIN CONTENT */}
      {data && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

          {/* PRICE CARD */}
          <div style={{ gridColumn: '1 / -1', background: '#0a0a0a', padding: '30px', borderRadius: '15px', border: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#666', fontSize: '12px' }}>{data.symbol} / USD</div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#fff' }}>${fNum(data.close_price)}</div>
              <div style={{ color: '#00ff88', fontSize: '12px', marginTop: '5px' }}>{data.signals?.trend}</div>
            </div>
            <div style={{ textAlign: 'center', paddingLeft: '20px', borderLeft: '1px solid #222' }}>
              <div style={{ fontSize: '10px', color: '#666' }}>SIGNAL</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.signals?.final_signal}</div>
            </div>
          </div>

          {/* ON-CHAIN CARD */}
          <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #1a1a1a' }}>
            <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px' }}>ON-CHAIN METRICS</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Network:</span>
              <span>{data.fundamental_data?.onchain?.network}</span>
            </div>
            {data.fundamental_data?.onchain?.gas_gwei && (
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Gas (Fast):</span>
                <span style={{ color: '#00ccff' }}>{data.fundamental_data.onchain.gas_gwei.Fast} Gwei</span>
              </div>
            )}
          </div>

          {/* INDICATORS CARD */}
          <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #1a1a1a' }}>
            <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px' }}>INDICATORS</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>RSI (14):</span>
              <span>{fNum(data.technical_indicators?.rsi)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <span style={{ color: '#666' }}>SMA 50:</span>
              <span>{fNum(data.technical_indicators?.sma50)}</span>
            </div>
          </div>

          {/* PIVOTS CARD */}
          <div style={{ gridColumn: '1 / -1', background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #1a1a1a' }}>
            <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px' }}>TRADING LEVELS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
               <div><div style={{color:'#ff4444', fontSize:'10px'}}>RESIST</div><div>{fNum(data.pivots?.R1)}</div></div>
               <div><div style={{color:'#00ffcc', fontSize:'10px'}}>PIVOT</div><div>{fNum(data.pivots?.pivot)}</div></div>
               <div><div style={{color:'#00ff88', fontSize:'10px'}}>SUPPORT</div><div>{fNum(data.pivots?.S1)}</div></div>
            </div>
          </div>

        </div>
      )}

      {loading && <div style={{ textAlign: 'center', marginTop: '50px', color: '#00ffcc' }}>SYNCING...</div>}
    </div>
  );
}
