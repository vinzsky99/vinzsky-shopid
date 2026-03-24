// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react'
import { Lock, Clock, Key, ShieldCheck, MonitorPlay, Cpu } from 'lucide-react'

export default function TrialPage() {
  const [hwid, setHwid] = useState('744BC690E35B') 
  const [licenseKey, setLicenseKey] = useState('')
  
  // FIX 1: Default state diubah agar tidak langsung mengunci saat loading
  const [userStatus, setUserStatus] = useState({ 
    isLoading: true, // Tambah flag loading
    status: '', 
    hours: 0,        // FIX 2: Ganti 'remaining' jadi 'hours' sesuai Backend
    success: false 
  })
  
  const API_URL = "https://www.vinzsky.shop"; 

  const checkAccess = async () => {
    // Ambil key dari localStorage (bisa kosong jika belum login)
    const savedKey = localStorage.getItem('vinz_key') || '';
    setLicenseKey(savedKey);

    try {
      const res = await fetch(`${API_URL}/api/check_access?hwid=${hwid}&key=${savedKey}`);
      const data = await res.json();
      
      // FIX 3: Simpan data dari Backend dengan benar
      setUserStatus({
        isLoading: false,
        status: data.status || '',
        hours: data.hours || 0, // Ambil data 'hours' (9999)
        success: data.success || false
      });
      
    } catch (e) { 
      console.log("Backend offline atau Error Fetching!"); 
      setUserStatus(prev => ({ ...prev, isLoading: false })); // Matikan loading jika error
    }
  };

  useEffect(() => { 
    checkAccess(); 
  }, []);

  const handleRedeem = () => {
    // Simpan key yang diketik ke localStorage lalu refresh
    localStorage.setItem('vinz_key', licenseKey);
    window.location.reload();
  };

  const handleLogout = () => {
    // Hapus key dari memori dan refresh
    localStorage.removeItem('vinz_key');
    window.location.reload();
  };

  // ==========================================
  // UI 1: TAMPILAN LOADING SEMENTARA
  // ==========================================
  if (userStatus.isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
        <Clock size={40} className="text-blue-500 animate-spin mb-4" />
        <h1 className="text-xl font-bold italic animate-pulse">Menghubungkan ke VinzSky Server...</h1>
      </div>
    );
  }

  // ==========================================
  // UI 2: TAMPILAN TERKUNCI (JIKA KEY SALAH / BELUM ADA)
  // ==========================================
  if (!userStatus.success) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
        <Lock size={60} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-black mb-2 uppercase italic">Akses Terkunci!</h1>
        <p className="text-gray-500 mb-8">Kunci tidak valid untuk HWID: <span className="text-white font-mono">{hwid}</span></p>
        
        <div className="w-full max-w-sm bg-white/5 p-6 rounded-3xl border border-white/10">
          <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Input Serial Key</label>
          <input 
            type="text" 
            className="w-full bg-black border border-white/20 p-4 rounded-xl mb-4 text-center font-bold text-blue-400 focus:outline-none focus:border-blue-500"
            placeholder="Ketik Master Key..."
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)} // Jangan di-uppercase kalau Master Key sensitif huruf kecil
            onKeyDown={(e) => e.key === 'Enter' && handleRedeem()} // Bisa tekan Enter
          />
          <button onClick={handleRedeem} className="w-full py-4 bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl font-black uppercase">
            Aktifkan Lisensi
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI 3: TAMPILAN BERHASIL MASUK (DASHBOARD)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#020610] text-white p-6">
      {/* Timer Status Panel */}
      <div className="fixed top-6 right-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-blue-400" />
          <div className="text-right">
            <p className="text-[9px] font-black uppercase opacity-50">HWID: {hwid}</p>
            <p className="text-lg font-mono font-bold text-blue-400">
              {/* FIX 4: Tampilkan 'hours' langsung dari Backend */}
              {userStatus.status === 'MASTER ADMIN' ? "UNLIMITED" : `${userStatus.hours} Jam Sisa`}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto mt-20">
         <h1 className="text-5xl font-black italic mb-10 text-center uppercase">
           VinzSky <span className="text-blue-500">Engine V3</span>
         </h1>
         
         <div className="bg-[#0a0f1c] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
            <div className="text-center py-10">
                <ShieldCheck size={80} className="text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-2">Sistem Aktif & Terhubung!</h2>
                <p className="text-gray-400">Silakan jalankan tools melalui terminal utama.</p>
            </div>
            
            <p className="text-center text-gray-500 font-bold mb-6 italic text-sm mt-10">
               System Active for Device ID: {hwid}
            </p>
            <button 
              onClick={handleLogout} // Pakai fungsi logout yang benar
              className="w-full py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black uppercase transition-all border border-red-500/20"
            >
              Logout / Ganti Key
            </button>
         </div>
      </main>
    </div>
  )
}