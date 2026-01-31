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
              // Elsa arahkan langsung ke backend Hugging Face Bos yang sudah jalan
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
            <div style={{ backgroundColor: '#050505', color: '#00ffcc', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>

              {/* HEADER UNIT */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px' }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: '18px' }}>ELSA TERMINAL v3.5</h1>
                  <div style={{ fontSize: '10px', color: '#444' }}>STATUS: ONLINE</div>
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

                  {/* KARTU HARGA UTAMA */}
                  <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', background: '#0a0a0a' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>{data.symbol} PRICE</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>${fNum(data.close_price)}</div>
                    <div style={{ color: '#00ff88', fontSize: '12px' }}>SIGNAL: {data.signals?.final_signal}</div>
                  </div>

                  {/* ON-CHAIN & TEKNIKAL */}
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

                  {/* PIVOT LEVELS */}
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