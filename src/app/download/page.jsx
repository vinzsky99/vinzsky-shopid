"use client";
import React from 'react';

export default function DownloadVinzsky() {
  // Ini link direct download dari ID Google Drive kamu
  const DIRECT_LINK = "https://drive.google.com/uc?export=download&id=1CG0GVrcRvboTyCE6cav1aJJswK455nWg";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-[#0a0a0a] p-12 rounded-[50px] border border-gray-900 text-center shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-blue-500 italic tracking-tighter leading-none uppercase">
            VinzSky Ultimate
          </h1>
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] mt-3 font-bold">
            Professional Engine V1.0
          </p>
        </div>

        {/* Tombol Download Utama */}
        <div className="space-y-4">
          <a 
            href={DIRECT_LINK}
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-3xl transition-all active:scale-95 shadow-2xl shadow-blue-900/40 text-xl uppercase tracking-tighter"
          >
            Download Software
          </a>
          <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">
            File Size: ±100MB | Format: .EXE
          </p>
        </div>

        {/* Grid Informasi */}
        <div className="mt-12 pt-8 border-t border-gray-900 grid grid-cols-2 gap-4">
          <div className="text-left border-r border-gray-900 pr-4">
            <p className="text-[8px] text-gray-700 uppercase font-black mb-1">Security</p>
            <p className="text-[10px] text-gray-400 font-bold italic">PyArmor Protected</p>
          </div>
          <div className="text-right pl-4">
            <p className="text-[8px] text-gray-700 uppercase font-black mb-1">Platform</p>
            <p className="text-[10px] text-gray-400 font-bold italic">Windows 10 / 11</p>
          </div>
        </div>

        {/* Peringatan Virus Google (Penting karena file > 40MB) */}
        <div className="mt-8 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-left">
          <p className="text-[10px] text-blue-400/60 leading-relaxed">
            <span className="font-black text-blue-400">INFO:</span> Jika muncul peringatan "Google Drive can't scan this file for viruses" karena ukuran besar, klik saja <span className="underline font-bold text-blue-400">"Download Anyway"</span>. File 100% aman buatan Vinzsky.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-10 text-gray-800 text-[9px] font-black tracking-widest uppercase italic">
        Tools By | vinzsky | software engineer | since 2026
      </p>
    </div>
  );
}