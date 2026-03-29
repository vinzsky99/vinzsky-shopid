"use client";

import React, { useState } from 'react';
import Head from 'next/head';

// ==============================================================================
// 👑 VINZSKY CONFIGURATION CENTER
// ==============================================================================
const MOCK_MEMBER_ACCESS = 'ALL_ACCESS'; 

const PRODUCTS_DATA = {
  video: {
    id: 'VIDEO_VIP',
    title: "VinzSky Video Upscale VIP",
    engine: "VIP ENGINE V1.0 - HWID LOCKED",
    icon: "/icon_video_folder.png", 
    downloadUrl: "https://drive.google.com/file/d/1yQa0Q9E7CXmvbGJQYsdVuk3dyveu3lhU",
    features: ["⚡ 4K/8K Upscale Precision", "⚡ 120 FPS Frame Interpolation", "⚡ Bitrate Master (300Mbps)", "⚡ Anti-Lag Engine"],
    pdfGuide: { title: "🎥 Buku Panduan Video Upscale VIP.pdf", file: "/Panduan_Video_VIP.pdf" } 
  },
  photo: {
    id: 'PHOTO_VIP',
    title: "VinzSky Photo Upscale UHQ",
    engine: "ULTIMATE AI V1.0 - HWID LOCKED",
    icon: "/icon_photo_folder.png", 
    downloadUrl: "https://drive.google.com/file/d/1aEmKx_aIBWG4aRL8qbSq5Lp2tMcK-co1",
    features: ["⚡ AI Deep Cleaning (Noise Fix)", "⚡ Blur & Sharpener Fix", "⚡ 4x Monster 8K Scaling", "⚡ Anti-Forensic Metadata Removal"],
    pdfGuide: { title: "🖼️ Buku Panduan Photo Upscale UHQ.pdf", file: "/Panduan_Photo_VIP.pdf" } 
  }
};

const GALAXY_VIDEO_BG = "/galaxy_bg.mp4";

// ==============================================================================
// 👑 VINZSKY SULTAN UI COMPONENT 
// ==============================================================================

const VinzSkyDownloadCenter = () => {
  const [activePdfPath, setActivePdfPath] = useState(null);

  const hasVideoAccess = MOCK_MEMBER_ACCESS === 'ALL_ACCESS' || MOCK_MEMBER_ACCESS === 'VIDEO_ONLY';
  const hasPhotoAccess = MOCK_MEMBER_ACCESS === 'ALL_ACCESS' || MOCK_MEMBER_ACCESS === 'PHOTO_ONLY';

  const ProductCard = ({ product, colorGradient }) => (
    <div className="group relative w-full max-w-lg transition-all duration-700 hover:scale-[1.03]">
      <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${colorGradient} opacity-20 blur-2xl transition duration-700 group-hover:opacity-100 group-hover:blur-3xl group-hover:duration-300`}></div>
      <div className="relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-2xl shadow-3xl overflow-hidden min-h-[500px]">
        <div className={`absolute -top-3 left-8 h-6 w-32 rounded-t-xl bg-gradient-to-r ${colorGradient} border border-white/10 shadow-lg`}></div>
        <div className="mb-8 relative transition-transform duration-500 group-hover:-translate-y-3 group-hover:rotate-6">
           <img src={product.icon} alt={product.title} className="h-32 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
        </div>
        <h3 className={`text-2xl font-extrabold tracking-tighter mb-1 text-transparent bg-clip-text bg-gradient-to-r ${colorGradient} drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]`}>
          {product.title}
        </h3>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[4px] italic mb-6">{product.engine}</p>
        <div className="w-full space-y-2 mb-8 p-5 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
           {product.features.map((feature, index) => (
             <p key={index} className="text-[10px] text-green-400 font-bold uppercase tracking-wider">{feature}</p>
           ))}
        </div>
        <div className="grid grid-cols-2 gap-4 w-full mt-auto">
          <a href={product.downloadUrl} target="_blank" rel="noopener noreferrer" className={`px-5 py-3 rounded-2xl border border-white/10 text-xs font-black text-white uppercase tracking-widest bg-gradient-to-r ${colorGradient} text-center hover:scale-105 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>
             Download Tools
          </a>
          <button 
             onClick={() => setActivePdfPath(activePdfPath === product.pdfGuide.file ? null : product.pdfGuide.file)}
             className={`px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all ${activePdfPath === product.pdfGuide.file ? 'border-[#facc15] text-[#facc15]' : ''}`}>
             {activePdfPath === product.pdfGuide.file ? "Tutup Panduan" : "Baca Panduan"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>VinzSky VIP | SULTAN DOWNLOAD CENTER | {MOCK_MEMBER_ACCESS}</title>
      </Head>

      <div className="min-h-screen w-full relative overflow-hidden font-sans text-white bg-black">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover z-0 opacity-50 scale-105 animate-slowGalaxy">
          <source src={GALAXY_VIDEO_BG} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black via-purple-950/20 to-black opacity-90 backdrop-blur-sm"></div>
        
        <div className="relative z-10 flex flex-col items-center p-6 md:p-12 min-h-screen">
          <header className="w-full max-w-7xl flex flex-col items-center justify-center text-center border-b border-white/5 pb-10 mb-20 animate-fadeInDown">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-yellow-500 uppercase tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
              VinzSky VIP DOWNLOAD
            </h1>
            <p className="text-xs md:text-sm font-bold text-[#facc15] uppercase tracking-[8px] italic animate-pulse">
              💎 PUSAT UNDUHAN & BUKU PANDUAN ANDA 💎
            </p>
            <div className="mt-4 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">Akses ID: {MOCK_MEMBER_ACCESS}</div>
          </header>

          <main className="w-full max-w-7xl flex flex-col items-center gap-16">
            <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 justify-items-center animate-fadeIn">
              {hasVideoAccess && (
                <ProductCard 
                  product={PRODUCTS_DATA.video}
                  colorGradient="from-[#1e3a8a] via-[#3b82f6] to-[#06b6d4]"
                />
              )}
              {hasPhotoAccess && (
                <ProductCard 
                  product={PRODUCTS_DATA.photo}
                  colorGradient="from-[#7e22ce] via-[#facc15] to-[#f59e0b]"
                />
              )}
              {!hasVideoAccess && !hasPhotoAccess && (
                  <div className="col-span-full text-center p-20 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-xl">
                      <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest mb-2">🚨 AKSES DITOLAK! 🚨</h2>
                      <p className="text-xs text-gray-500">Anda belum membeli produk apapun atau lisensi Anda tidak valid.</p>
                      <p className="text-xs text-gray-500">Silahkan hubungi VinzSky untuk mengaktifkan lisensi VIP Anda!</p>
                  </div>
              )}
            </section>

            {/* 🔥 INI YANG TADI SALAH TUTUP BOS, UDAH SAYA FIX JADI </section> 🔥 */}
            {activePdfPath && (
                <section className="w-full h-[85vh] rounded-3xl border-2 border-white/10 bg-black/50 p-3 backdrop-blur-3xl shadow-3xl animate-in fade-in slide-in-from-top-10 duration-1000 relative">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#1e3a8a]/40 via-[#7e22ce]/40 to-[#facc15]/40 opacity-50 blur-2xl z-[-1]"></div>
                    <button onClick={() => setActivePdfPath(null)} className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-10 h-10 font-black border-4 border-black hover:bg-red-500 hover:scale-110 transition-all z-50 shadow-2xl">X</button>
                    <embed 
                        src={activePdfPath} 
                        type="application/pdf" 
                        width="100%" 
                        height="100%" 
                        className="rounded-2xl border border-white/10 shadow-inner bg-white"
                    />
                    <a href={activePdfPath} download className="absolute bottom-10 right-10 px-6 py-3 rounded-full bg-black/80 border border-white/30 text-xs font-black text-[#facc15] uppercase tracking-widest hover:bg-[#facc15] hover:text-black hover:border-black transition-all shadow-2xl">
                       Download File PDF
                    </a>
                </section>
            )}

          </main>

          <footer className="w-full max-w-7xl mt-auto pt-10 text-center border-t border-white/5 animate-fadeInUp">
             <div className="text-[10px] text-gray-600 font-black tracking-[6px] uppercase italic drop-shadow-md">
                Tools By | vinzsky | software engineer | version 2.0 | since 2026
             </div>
             <p className="text-[8px] text-gray-700 font-bold mt-1">
                © All Rights Reserved. Nuansa Horoscope Angkasa VIP & Glassmorphism Terbaik.
             </p>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slowGalaxy { 0% { transform: scale(1.05); } 50% { transform: scale(1.10); } 100% { transform: scale(1.05); } }
        
        .animate-fadeIn { animation: fadeIn 1.5s ease-out forwards; }
        .animate-fadeInDown { animation: fadeInDown 1.2s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 1.2s ease-out forwards; }
        .animate-slowGalaxy { animation: slowGalaxy 20s infinite ease-in-out; }

        embed::-webkit-scrollbar { width: 6px; height: 6px; }
        embed::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        embed::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 10px; }
        embed::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.6); }
      `}</style>
    </>
  );
};

export default VinzSkyDownloadCenter;