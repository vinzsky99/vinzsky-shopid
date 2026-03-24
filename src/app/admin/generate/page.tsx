"use client";
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { supabase } from '@/lib/supabase'; // Sesuaikan path config supabase kamu

export default function AdminGenerate() {
  const [hwid, setHwid] = useState('');
  const [duration, setDuration] = useState('1H');
  const [generatedKey, setGeneratedKey] = useState('');

  // RUMUS SALT HARUS SAMA DENGAN DI PYTHON (check_license.py)
  const SALTS: any = {
    "1H": "VINZ_TRIAL_1H_2026",
    "7H": "VINZ_VIP_7H_2026",
    "14H": "VINZ_VIP_14H_2026",
    "30H": "VINZ_VIP_30H_2026"
  };

  const handleGenerate = async () => {
    if (!hwid) return alert("Masukkan HWID Pembeli!");

    // 1. Rumus Generate (Sama dengan Python)
    const salt = SALTS[duration];
    const rawHash = CryptoJS.SHA256(`${hwid}-${salt}`).toString().toUpperCase();
    const shortHash = `${rawHash.substring(0, 4)}-${rawHash.substring(4, 8)}-${rawHash.substring(8, 12)}`;
    const finalKey = `PHOTO-${duration}-${shortHash}`;

    // 2. Simpan ke Supabase
    const { error } = await supabase.from('license_keys').insert([
      {
        license_key: finalKey,
        product_tier: `VIP-${duration}`,
        key_status: 'ACTIVE', // Langsung active karena sudah nempel HWID
        activated_hwid: hwid,
        activated_at: new Date().toISOString()
      }
    ]);

    if (error) {
      alert("Gagal simpan ke Database: " + error.message);
    } else {
      setGeneratedKey(finalKey);
      alert("Key Berhasil Dibuat & Masuk Database!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-10 font-sans">
      <div className="max-w-md mx-auto bg-[#111] p-8 rounded-[30px] border border-blue-900/30 shadow-2xl">
        <h1 className="text-2xl font-black italic text-blue-500 mb-6 uppercase tracking-tighter">
          VinzSky Key Factory 🏭
        </h1>

        <div className="space-y-6">
          {/* Input HWID */}
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">Customer HWID</label>
            <input 
              type="text" 
              placeholder="Contoh: 744BC690E35B"
              className="w-full bg-black border border-gray-800 p-4 rounded-xl text-blue-400 font-mono focus:border-blue-500 outline-none transition-all"
              value={hwid}
              onChange={(e) => setHwid(e.target.value.toUpperCase())}
            />
          </div>

          {/* Select Durasi */}
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">Duration Package</label>
            <select 
              className="w-full bg-black border border-gray-800 p-4 rounded-xl text-white font-bold outline-none appearance-none cursor-pointer"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="1H">1 HOUR (TRIAL)</option>
              <option value="7H">7 HOURS</option>
              <option value="14H">14 HOURS</option>
              <option value="30H">30 HOURS (VIP)</option>
            </select>
          </div>

          {/* Button Generate */}
          <button 
            onClick={handleGenerate}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black uppercase italic tracking-widest transition-all active:scale-95"
          >
            Generate & Save Key
          </button>

          {/* Result Area */}
          {generatedKey && (
            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl animate-pulse">
              <p className="text-[9px] text-blue-400 font-bold uppercase mb-2">Generated License Key:</p>
              <p className="text-xl font-black text-white tracking-widest select-all cursor-pointer">
                {generatedKey}
              </p>
              <p className="text-[8px] text-gray-600 mt-3 italic">*Salin key ini dan berikan ke pembeli.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}