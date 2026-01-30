module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/crypto/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// --- Fungsi Deteksi Pattern ---
function detectPattern(candles) {
    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2];
    const o1 = parseFloat(last[1]), h1 = parseFloat(last[2]), l1 = parseFloat(last[3]), c1 = parseFloat(last[4]);
    const o2 = parseFloat(prev[1]), h2 = parseFloat(prev[2]), l2 = parseFloat(prev[3]), c2 = parseFloat(prev[4]);
    const body = Math.abs(c1 - o1);
    const totalRange = h1 - l1;
    if (c2 < o2 && c1 > o1 && o1 <= c2 && c1 >= o2) return "Bullish Engulfing 🚀";
    if (c2 > o2 && c1 < o1 && o1 >= c2 && c1 <= o2) return "Bearish Engulfing 📉";
    const lowerWick = Math.min(o1, c1) - l1;
    const upperWick = h1 - Math.max(o1, c1);
    if (lowerWick > body * 2 && upperWick < body) return "Hammer 🔨";
    if (body <= totalRange * 0.1) return "Doji ⏳";
    return "Normal";
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol')?.toUpperCase() || 'ETHUSDT';
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=100`);
        const candles = await res.json();
        if (candles.code) throw new Error("Simbol Salah");
        const closes = candles.map((c)=>parseFloat(c[4]));
        const pattern = detectPattern(candles);
        const calculateRSI = (data)=>{
            let gains = 0, losses = 0;
            for(let i = 1; i <= 14; i++){
                let diff = data[i] - data[i - 1];
                if (diff >= 0) gains += diff;
                else losses -= diff;
            }
            let avgG = gains / 14, avgL = losses / 14;
            let rsiArr = [];
            for(let i = 15; i < data.length; i++){
                let diff = data[i] - data[i - 1];
                let g = diff >= 0 ? diff : 0, l = diff < 0 ? -diff : 0;
                avgG = (avgG * 13 + g) / 14;
                avgL = (avgL * 13 + l) / 14;
                rsiArr.push(100 - 100 / (1 + avgG / avgL));
            }
            return rsiArr;
        };
        const calculateEMA = (data, p)=>{
            const k = 2 / (p + 1);
            let ema = data[0];
            for(let i = 1; i < data.length; i++)ema = data[i] * k + ema * (1 - k);
            return ema;
        };
        const rsiData = calculateRSI(closes);
        const stochRsi = (rsiData[rsiData.length - 1] - Math.min(...rsiData.slice(-14))) / (Math.max(...rsiData.slice(-14)) - Math.min(...rsiData.slice(-14)));
        const ema20 = calculateEMA(closes, 20);
        const price = closes[closes.length - 1];
        let signal = "WAIT";
        if (stochRsi < 0.2 && price > ema20) signal = "STRONG BUY";
        else if (stochRsi > 0.8 && price < ema20) signal = "STRONG SELL";
        else if (stochRsi < 0.2) signal = "BUY (RISKY)";
        else if (stochRsi > 0.8) signal = "SELL (RISKY)";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            symbol,
            price: price.toFixed(2),
            ema20: ema20.toFixed(2),
            stochRsi: (stochRsi * 100).toFixed(2),
            signal,
            pattern,
            trend: price > ema20 ? "BULLISH" : "BEARISH"
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__33c04e62._.js.map