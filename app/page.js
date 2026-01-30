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
            const res = await fetch(`/api/crypto?symbol=${symbol}`);
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
          <div style={{ backgroundColor: '#050505', color: '#00ffcc', minHeight: '100vh', padding: '20px', fontFamily: '"Segoe UI", Roboto, monospace' }}>

            {/* --- TOP BAR --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #111', paddingBottom: '15px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '20px', letterSpacing: '2px' }}>ELSA PRO <span style={{ color: '#fff' }}>v3.5</span></h1>
                <div style={{ fontSize: '10px', color: '#444' }}>QUANTITATIVE INTELLIGENCE UNIT</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#00ff88' }}>● SYSTEM ACTIVE</div>
                <div style={{ fontSize: '9px', color: '#333' }}>{data?.last_updated || 'Syncing...'}</div>
              </div>
            </div>

            {/* --- SEARCH BOX --- */}
            <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
                  style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto 30px' }}>
              <input 
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                style={{ flex: 1, padding: '15px', borderRadius: '8px', background: '#0a0a0a', color: 'white', border: '1px solid #222', outline: 'none' }}
                placeholder="SEARCH ASSET (ETH, SOL, BTC)..."
              />
              <button type="submit" style={{ padding: '0 25px', background: '#00ffcc', color: 'black', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SCAN</button>
            </form>

            {data && (
              <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                {/* MAIN PRICE & SIGNAL */}
                <div style={{ gridColumn: '1 / -1', background: 'linear-gradient(145deg, #0a0a0a, #0f0f0f)', padding: '30px', borderRadius: '15px', border: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{data.symbol} / USD</div>
                    <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#fff' }}>${fNum(data.close_price)}</div>
                    <div style={{ color: data.signals.trend === 'UPTREND' ? '#00ff88' : '#ff4444', fontSize: '12px', marginTop: '5px' }}>
                      {data.signals.trend} MARKET
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px', borderLeft: '1px solid #222' }}>
                    <div style={{ fontSize: '10px', color: '#666', marginBottom: '5px' }}>ELSA SIGNAL</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: data.signals.final_signal.includes('BUY') ? '#00ff88' : '#ff4444' }}>
                      {data.signals.final_signal}
                    </div>
                    <div style={{ fontSize: '10px', color: '#333' }}>CONVICTION: {data.signals.score}/5</div>
                  </div>
                </div>

                {/* ON-CHAIN INTELLIGENCE */}
                <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px' }}>ON-CHAIN METRICS</div>
                  {data.fundamental_data.onchain.network === 'Ethereum' ? (
                    <div style={{ display: 'grid', gap: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Gas Fast:</span>
                        <span style={{ color: '#00ccff' }}>{Number(data.fundamental_data.onchain.gas_gwei?.Fast).toFixed(2)} Gwei</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Gas Safe:</span>
                        <span>{Number(data.fundamental_data.onchain.gas_gwei?.Safe).toFixed(2)} Gwei</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Hashrate:</span>
                        <span style={{ color: '#00ccff' }}>{data.fundamental_data.onchain.hash_rate || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* OSCILLATORS (STOCH & RSI) */}
                <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px' }}>OSCILLATORS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#666' }}>RSI</div>
                      <div style={{ fontSize: '20px', color: '#fff' }}>{fNum(data.technical_indicators.rsi)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#666' }}>STOCH_K</div>
                      <div style={{ fontSize: '20px', color: '#fff' }}>{fNum(data.technical_indicators.stoch_k)}</div>
                    </div>
                  </div>
                </div>

                {/* INSTITUTIONAL VIEW */}
                <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px' }}>INSTITUTIONAL VIEW</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#666' }}>Analis Rec:</span>
                    <span style={{ padding: '4px 10px', borderRadius: '4px', background: '#111', color: '#ffcc00', fontSize: '12px', fontWeight: 'bold' }}>
                      {data.fundamental_data.yahoo.recommendation}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <span style={{ color: '#666' }}>Mkt Cap:</span>
                    <span style={{ fontSize: '12px' }}>${(data.fundamental_data.yahoo.market_cap / 1e9).toFixed(2)}B</span>
                  </div>
                </div>

                {/* TRADING LEVELS (PIVOTS) */}
                <div style={{ gridColumn: '1 / -1', background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px' }}>TRADING LEVELS (PIVOTS)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', textAlign: 'center' }}>
                    <div><div style={{fontSize:'9px', color:'#ff4444'}}>R2</div><div style={{fontSize:'12px'}}>{fNum(data.pivots.R2)}</div></div>
                    <div><div style={{fontSize:'9px', color:'#ff4444'}}>R1</div><div style={{fontSize:'12px'}}>{fNum(data.pivots.R1)}</div></div>
                    <div><div style={{fontSize:'9px', color:'#00ffcc'}}>PIVOT</div><div style={{fontSize:'12px', fontWeight:'bold'}}>{fNum(data.pivots.pivot)}</div></div>
                    <div><div style={{fontSize:'9px', color:'#00ff88'}}>S1</div><div style={{fontSize:'12px'}}>{fNum(data.pivots.S1)}</div></div>
                    <div><div style={{fontSize:'9px', color:'#00ff88'}}>S2</div><div style={{fontSize:'12px'}}>{fNum(data.pivots.S2)}</div></div>
                  </div>
                </div>

              </div>
            )}

            {loading && <div style={{ textAlign: 'center', marginTop: '50px', color: '#00ffcc', fontSize: '12px' }}>RESCANNING NETWORK...</div>}
          </div>
        );
      }
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setActiveSymbol(query.toUpperCase()); }} 
            style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto 30px' }}>
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '15px', borderRadius: '12px', background: '#111', color: 'white', border: '1px solid #333', outline: 'none' }}
          placeholder="Enter Symbol (e.g. BTC, ETH, SOL)"
        />
        <button type="submit" style={{ padding: '0 25px', background: '#00ffcc', color: 'black', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ANALYZE</button>
      </form>

      {error && <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '20px', background: '#200', borderRadius: '10px' }}>⚠️ {error}</div>}

      {data ? (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

          {/* 1. PRICE & SIGNAL CARD */}
          <div style={{ gridColumn: '1 / -1', background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #222', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: data.signals.final_signal.includes('BUY') ? '#00ff88' : '#ff4444' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#666' }}>{data.symbol} / USD</div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff' }}>${fNum(data.close_price)}</div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  {data.signals.candlestick.map(p => <span key={p} style={{ fontSize: '10px', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>{p}</span>)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#888' }}>SIGNAL SCORE: {data.signals.score}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: data.signals.final_signal.includes('BUY') ? '#00ff88' : '#ff4444' }}>{data.signals.final_signal}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>Trend: {data.signals.trend}</div>
              </div>
            </div>
          </div>

          {/* 2. YAHOO FUNDAMENTAL & ON-CHAIN */}
          <div style={{ background: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222' }}>
            <div style={{ color: '#00ffcc', fontSize: '12px', marginBottom: '15px' }}>MARKET INSIGHTS (YAHOO & ON-CHAIN)</div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Analis Rec:</span>
                <span style={{ color: '#ffcc00' }}>{data.fundamental_data.yahoo.recommendation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Target Price:</span>
                <span>${fNum(data.fundamental_data.yahoo.target_price)}</span>
              </div>
              {/* On-Chain Logic */}
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #222' }}>
                {data.fundamental_data.onchain.network === "Ethereum" ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Gas Price:</span>
                    <span style={{ color: '#00ccff' }}>{data.fundamental_data.onchain.gas_gwei?.Fast} Gwei (Fast)</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>BTC Hashrate:</span>
                    <span style={{ color: '#00ccff' }}>{data.fundamental_data.onchain.hash_rate || "N/A"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. PIVOT POINTS (S&R) */}
          <div style={{ background: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222' }}>
            <div style={{ color: '#00ffcc', fontSize: '12px', marginBottom: '15px' }}>PIVOT POINTS (TRADING LEVELS)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ color: '#ff4444' }}>
                <div style={{ fontSize: '10px' }}>RESISTANCE 3</div>
                <div>{fNum(data.pivots.R3)}</div>
              </div>
              <div style={{ color: '#00ff88' }}>
                <div style={{ fontSize: '10px' }}>SUPPORT 3</div>
                <div>{fNum(data.pivots.S3)}</div>
              </div>
              <div style={{ color: '#ff4444', opacity: 0.7 }}>
                <div style={{ fontSize: '10px' }}>R1</div>
                <div>{fNum(data.pivots.R1)}</div>
              </div>
              <div style={{ color: '#00ff88', opacity: 0.7 }}>
                <div style={{ fontSize: '10px' }}>S1</div>
                <div>{fNum(data.pivots.S1)}</div>
              </div>
            </div>
          </div>

          {/* 4. FIBONACCI LEVELS */}
          <div style={{ background: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222' }}>
            <div style={{ color: '#00ffcc', fontSize: '12px', marginBottom: '15px' }}>FIBONACCI RETRACEMENT</div>
            {Object.entries(data.fibs).map(([level, price]) => (
              <div key={level} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px' }}>
                <span style={{ color: '#555' }}>{level}</span>
                <span>${fNum(price)}</span>
              </div>
            ))}
          </div>

          {/* 5. SENTIMENT METER */}
          <div style={{ background: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222', textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: '10px' }}>FEAR & GREED INDEX</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: data.market_sentiment.fear_and_greed.value > 50 ? '#00ff88' : '#ff4444' }}>
              {data.market_sentiment.fear_and_greed.value}
            </div>
            <div style={{ fontSize: '12px' }}>{data.market_sentiment.fear_and_greed.text}</div>
          </div>

        </div>
      ) : (
        !loading && <div style={{ textAlign: 'center', marginTop: '100px', color: '#333' }}>Enter a symbol to begin professional analysis.</div>
      )}

      <footer style={{ textAlign: 'center', marginTop: '50px', fontSize: '10px', color: '#333' }}>
        SYNCED WITH ELSA BRAIN v3.5 • {data?.last_updated}
      </footer>
    </div>
  );
}
