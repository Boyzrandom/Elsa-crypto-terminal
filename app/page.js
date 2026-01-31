          "use client";
          import { useEffect, useState } from 'react';

          export default function Home() {
            const [data, setData] = useState(null);
            const [query, setQuery] = useState("ETH");
            const [activeSymbol, setActiveSymbol] = useState("ETH");
            const [loading, setLoading] = useState(false);

            const fetchData = async (symbol) => {
              setLoading(true);
              try {
                const res = await fetch(`https://boyel2-backend-crypto.hf.space/api/analyze?symbol=${symbol}`);
                const json = await res.json();

                // SYNC: Memastikan variabel sesuai dengan output Backend Pro
                if (json) {
                  setData({
                    ...json,
                    // Fallback jika salah satu variabel beda penamaan
                    display_price: json.close_price || json.price || 0,
                    display_rsi: json.technical_indicators?.rsi || 0,
                    display_trend: json.signals?.trend || "UNKNOWN"
                  });
                }
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
              <div style={{ backgroundColor: '#050505', color: '#00ffcc', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>

                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px' }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '18px', letterSpacing: '1px' }}>ELSA PRO TERMINAL v3.5</h1>
                    <div style={{ fontSize: '10px', color: '#444' }}>QUANTITATIVE ANALYSIS UNIT</div>
                  </div>
                  <div style={{ color: '#00ff88', fontSize: '10px' }}>● SYSTEM LIVE</div>
                </div>

                {/* SEARCH */}
                <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
                      style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                  <input 
                    type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                    style={{ flex: 1, padding: '12px', background: '#000', color: '#00ffcc', border: '1px solid #00ffcc', borderRadius: '4px', outline: 'none' }}
                    placeholder="ENTER SYMBOL (BTC, ETH...)"
                  />
                  <button type="submit" style={{ padding: '0 20px', background: '#00ffcc', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SCAN</button>
                </form>

                {data && (
                  <div style={{ display: 'grid', gap: '20px' }}>

                    {/* PRICE CARD */}
                    <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', background: '#0a0a0a', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>{data.symbol} / USD</div>
                      <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#fff' }}>${fNum(data.display_price)}</div>
                      <div style={{ color: '#00ff88', fontSize: '14px', marginTop: '5px' }}>SIGNAL: {data.signals?.final_signal || 'WAITING'}</div>
                    </div>

                    {/* METRICS GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px' }}>TECHNICAL</div>
                        <div style={{ fontSize: '14px' }}>RSI: <span style={{color: '#fff'}}>{fNum(data.display_rsi)}</span></div>
                        <div style={{ fontSize: '14px' }}>TREND: <span style={{color: '#fff'}}>{data.display_trend}</span></div>
                      </div>
                      <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px' }}>MARKET DATA</div>
                        <div style={{ fontSize: '14px' }}>VOL: <span style={{color: '#fff'}}>{data.fundamental_data?.market_cap_rank || 'N/A'} (RANK)</span></div>
                        <div style={{ fontSize: '14px' }}>SENTIMENT: <span style={{color: '#fff'}}>{data.fundamental_data?.sentiment || 'FEAR'}</span></div>
                      </div>
                    </div>

                    {/* PIVOT LEVELS */}
                    <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px', textAlign: 'center' }}>TRADING BOUNDARIES</div>
                      <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div><div style={{fontSize:'10px', color:'#ff4444'}}>RESISTANCE</div>{fNum(data.pivots?.R1)}</div>
                        <div><div style={{fontSize:'10px', color:'#00ffcc'}}>PIVOT</div>{fNum(data.pivots?.pivot)}</div>
                        <div><div style={{fontSize:'10px', color:'#00ff88'}}>SUPPORT</div>{fNum(data.pivots?.S1)}</div>
                      </div>
                    </div>

                  </div>
                )}

                {loading && <div style={{ color: '#00ffcc', textAlign: 'center', marginTop: '20px' }}>POLLING DATA FROM CLUSTER...</div>}
              </div>
            );
          }
          <div style={{ fontSize: '10px', color: '#00ff88' }}>● SYSTEM ONLINE</div>
        </div>
      </div>

      {/* FORM PENCARIAN */}
      <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
            style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '12px', background: '#000', color: '#00ffcc', border: '1px solid #00ffcc', borderRadius: '4px', outline: 'none' }}
          placeholder="INPUT SYMBOL..."
        />
        <button type="submit" style={{ padding: '0 20px', background: '#00ffcc', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SCAN</button>
      </form>

      {/* TAMPILAN DATA */}
      {data && (
        <div style={{ display: 'grid', gap: '20px' }}>

          <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', background: '#0a0a0a' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>{data.symbol} PRICE</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>${fNum(data.close_price)}</div>
            <div style={{ color: '#00ff88', fontSize: '12px' }}>SIGNAL: {data.signals?.final_signal}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: '#666' }}>ON-CHAIN</div>
              <div style={{ fontSize: '12px' }}>Net: {data.fundamental_data?.onchain?.network}</div>
              <div style={{ fontSize: '12px', color: '#00ccff' }}>Gas: {data.fundamental_data?.onchain?.gas_gwei?.Fast || 'N/A'}</div>
            </div>
            <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: '#666' }}>TECHNICAL</div>
              <div style={{ fontSize: '12px' }}>RSI: {fNum(data.technical_indicators?.rsi)}</div>
              <div style={{ fontSize: '12px' }}>Trend: {data.signals?.trend}</div>
            </div>
          </div>

          <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px' }}>TRADE LEVELS</div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div><div style={{fontSize:'10px', color:'#ff4444'}}>R1</div>{fNum(data.pivots?.R1)}</div>
              <div><div style={{fontSize:'10px', color:'#00ffcc'}}>PV</div>{fNum(data.pivots?.pivot)}</div>
              <div><div style={{fontSize:'10px', color:'#00ff88'}}>S1</div>{fNum(data.pivots?.S1)}</div>
            </div>
          </div>

        </div>
      )}

      {loading && <div style={{ color: '#00ffcc', textAlign: 'center' }}>EXECUTING SCAN...</div>}
    </div>
  );
}
