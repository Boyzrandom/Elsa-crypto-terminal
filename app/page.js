"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("BTC");
  const [activeSymbol, setActiveSymbol] = useState("BTC");

  const fetchData = async (symbol) => {
    try {
      setData(null); // Reset saat loading
      const res = await fetch(`/api/crypto?symbol=${symbol}`);
      const json = await res.json();

      if (json.error) {
        setError(json.details || json.error);
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
  }, [activeSymbol]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSymbol(query.toUpperCase().replace(/\s/g, ''));
  };

  // --- FUNGSI HELPER UNTUK MENAMPILKAN DATA API ---
  // Karena kita belum tahu persis nama 'key' JSON dari API Boyel2,
  // fungsi ini akan mencari harga dan sinyal secara otomatis.
  const getPrice = (d) => d.price || d.close || d.current_price || "0";
  const getSignal = (d) => d.signal || d.recommendation || d.action || "WAIT";
  const getTrend = (d) => d.trend || "NEUTRAL";

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'monospace' }}>

      {/* HEADER */}
      <h2 style={{ color: '#00ffcc', textAlign: 'center' }}>ADVANCED CRYPTO TERMINAL</h2>
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>Powered by: Boyel2 HF Space</p>

      {/* SEARCH */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '20px auto' }}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Simbol (cth: BTC, ETH)"
          style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#222', color: 'white', border: '1px solid #444' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#00ffcc', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>CEK</button>
      </form>

      {/* ERROR STATE */}
      {error && <div style={{ color: '#ff6b6b', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '8px' }}>⚠️ {error}</div>}

      {/* LOADING */}
      {!data && !error && <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>Sedang mengambil analisis canggih...</div>}

      {/* DASHBOARD */}
      {data && (
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'grid', gap: '15px' }}>

          {/* CARD UTAMA */}
          <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '15px', textAlign: 'center', border: '1px solid #333' }}>
            <h1 style={{ fontSize: '48px', margin: '10px 0', color: 'white' }}>${Number(getPrice(data)).toLocaleString()}</h1>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: getTrend(data) === 'BULLISH' ? '#00ff88' : '#ff4444' }}>
              {getTrend(data)}
            </div>
            <div style={{ marginTop: '10px', padding: '5px 15px', background: '#333', borderRadius: '20px', display: 'inline-block' }}>
               Sinyal: <span style={{ color: '#ffcc00' }}>{getSignal(data)}</span>
            </div>
          </div>

          {/* DEBUG AREA (Sangat Penting untuk API Baru) */}
          {/* Ini akan menampilkan SEMUA data mentah dari API Boyel2 supaya kita tahu fiturnya apa saja */}
          <div style={{ background: '#111', padding: '15px', borderRadius: '10px', fontSize: '10px', overflowX: 'auto', border: '1px dashed #444' }}>
            <p style={{ color: '#888', marginBottom: '5px' }}>🔍 DATA MENTAH DARI API (Untuk Pengecekan):</p>
            <pre style={{ color: '#00ffcc' }}>{JSON.stringify(data, null, 2)}</pre>
          </div>

        </div>
      )}
    </div>
  );
}
