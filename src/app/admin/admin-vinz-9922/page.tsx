"use client";
import React, { useState, useEffect } from 'react';
// PASTIKAN FILE SUPABASE INI ADA DI FOLDER YANG BENAR YA BOS!
import { supabase } from '@/src/lib/supabase'; 

// Daftar Kode Rahasia (SALT)
const SALTS: any = {
  PHOTO: {
    "1H": "PHOTO_TRIAL_1H_2026",
    "3D": "PHOTO_VIP_3D_2026",
    "7D": "PHOTO_VIP_7D_2026",
    "14D": "PHOTO_VIP_14D_2026",
    "30D": "PHOTO_VIP_30D_2026"
  },
  VIDEO: {
    "1H": "VINZ_TRIAL_1H_2026",
    "3D": "VINZ_VIP_3D_2026",
    "7D": "VINZ_VIP_7D_2026",
    "14D": "VINZ_VIP_14D_2026",
    "30D": "VINZ_VIP_30D_2026"
  }
};

export default function AdminDashboard() {
  // === STATE KEAMANAN (GOD MODE) ===
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // === STATE DATA LISENSI ===
  const [keys, setKeys] = useState<any[]>([]);
  const [targetHwid, setTargetHwid] = useState('');
  const [productType, setProductType] = useState('PHOTO');
  const [pkg, setPkg] = useState('1H');
  const [isGenerating, setIsGenerating] = useState(false);

  // === FUNGSI LOGIN ===
  const handleLogin = () => {
    if (password === 'vinzsky_god_mode') {
      setIsLoggedIn(true);
    } else {
      alert('TETOT! Password Salah Bos!');
      setPassword('');
    }
  };

  // === FUNGSI CETAK KUNCI (ENKRIPSI SHA-256) ===
  const generateVinzKey = async (hwid: string, type: string, packageCode: string) => {
    const salt = SALTS[type][packageCode];
    const msgBuffer = new TextEncoder().encode(`${hwid}-${salt}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    if (type === 'PHOTO') {
      return `PHOTO-${packageCode}-${hashHex.substring(0, 4)}-${hashHex.substring(4, 8)}`;
    } else {
      return `${packageCode}-${hashHex.substring(0, 4)}-${hashHex.substring(4, 8)}-${hashHex.substring(8, 12)}`;
    }
  };

  // === FUNGSI SIMPAN KE SUPABASE ===
  const handleCreate = async () => {
    if (!targetHwid) {
      alert("HWID nggak boleh kosong!");
      return;
    }

    setIsGenerating(true);
    try {
      const finalKey = await generateVinzKey(targetHwid, productType, pkg);
      
      const { error } = await supabase.from('license_keys').insert({
        license_key: finalKey,
        key_status: 'UNUSED',
        product_tier: `${productType}-${pkg}`,
        activated_hwid: targetHwid 
      });

      if (error) {
        alert("Gagal menyimpan ke database! Cek koneksi Supabase.");
        console.error(error);
      } else {
        alert(`Sukses! Key: ${finalKey}`);
        setTargetHwid(''); // Kosongkan form setelah sukses
        fetchKeys(); // Refresh tabel bawah
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem!");
    }
    setIsGenerating(false);
  };

  // === FUNGSI AMBIL DATA TABEL ===
  const fetchKeys = async () => {
    const { data, error } = await supabase.from('license_keys').select('*').order('created_at', { ascending: false });
    if (data) setKeys(data);
  };

  // Tarik data cuma kalau udah berhasil login (Biar hemat kuota Database)
  useEffect(() => { 
    if (isLoggedIn) fetchKeys(); 
  }, [isLoggedIn]);


  // ==========================================
  // UI 1: HALAMAN LOGIN RAHASIA
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020610] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-black p-10 rounded-3xl border border-blue-500/30 text-center max-w-sm w-full shadow-2xl shadow-blue-500/10">
          <h1 className="text-2xl font-black text-blue-500 mb-2 uppercase italic">Admin Only</h1>
          <p className="text-gray-500 text-sm mb-6">Area Terlarang Vinzsky Ultimate</p>
          <input 
            type="password" 
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl mb-4 text-center text-white focus:border-blue-500 outline-none"
            placeholder="Master Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold uppercase transition-all">
            Masuk Brankas
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI 2: DASHBOARD UTAMA (SETELAH LOGIN)
  // ==========================================
  return (
    <div className="p-10 bg-[#020610] min-h-screen text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-blue-500 italic uppercase">VinzSky Ultimate Control 👑</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-sm text-red-500 hover:text-red-400 font-bold px-4 py-2 border border-red-500/30 rounded-lg">Kunci Brankas</button>
        </div>
        
        {/* PANEL PEMBUATAN KEY */}
        <div className="bg-[#0a0f1c] p-6 rounded-3xl border border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 items-end">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Target HWID (Dari Pelanggan)</label>
            <input 
              value={targetHwid} 
              onChange={(e) => setTargetHwid(e.target.value.toUpperCase())} 
              placeholder="Paste HWID..."
              className="w-full bg-black border border-white/10 p-3 rounded-xl uppercase font-mono text-blue-400 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Pilih Produk</label>
            <select value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none">
              <option value="PHOTO">PHOTO</option>
              <option value="VIDEO">VIDEO / ULTIMATE</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Pilih Paket Durasi</label>
            <select value={pkg} onChange={(e) => setPkg(e.target.value)} className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none">
              <option value="1H">1 Jam (Trial)</option>
              <option value="3D">3 Hari</option>
              <option value="7D">7 Hari</option>
              <option value="14D">14 Hari</option>
              <option value="30D">30 Hari</option>
            </select>
          </div>
          <button 
            onClick={handleCreate} 
            disabled={isGenerating}
            className={`py-3 rounded-xl font-black uppercase transition-all shadow-lg ${isGenerating ? 'bg-gray-600 text-gray-400' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 text-white'}`}
          >
            {isGenerating ? 'Mencetak...' : 'Cetak Serial'}
          </button>
        </div>

        {/* TABEL DATABASE */}
        <div className="overflow-hidden rounded-2xl border border-white/5 shadow-xl">
          <div className="bg-[#0a0f1c] p-4 border-b border-white/5 flex justify-between items-center">
            <h2 className="font-bold text-sm uppercase text-gray-400">Log Lisensi Tercetak</h2>
            <button onClick={fetchKeys} className="text-xs text-blue-500 hover:underline">Refresh Data</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-[#050505]">
              <thead className="bg-[#0a0f1c] text-gray-500 uppercase">
                <tr>
                  <th className="p-4 font-bold">Serial Key</th>
                  <th className="p-4 font-bold">Terikat ke HWID</th>
                  <th className="p-4 font-bold">Produk & Paket</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {keys.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-600">Belum ada lisensi yang dicetak.</td></tr>
                ) : (
                  keys.map(k => (
                    <tr key={k.license_key} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-blue-400 font-bold">{k.license_key}</td>
                      <td className="p-4 font-mono text-gray-500">{k.activated_hwid}</td>
                      <td className="p-4"><span className="bg-white/10 px-2 py-1 rounded text-gray-300">{k.product_tier}</span></td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${k.key_status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-400'}`}>
                          {k.key_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}