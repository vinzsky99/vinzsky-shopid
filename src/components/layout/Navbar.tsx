// @ts-nocheck
/* eslint-disable */
'use client'

import React from 'react'
import { Bell, ShoppingCart, MoreVertical, Search, LogIn, UserCircle, LogOut, Download, Key, HardDrive, ShieldCheck, Eye, Flame } from 'lucide-react'

export default function Navbar({
  authUser,
  userActiveTier,
  isAdminUser,
  visitorCount,
  cartCount,
  unreadCount,
  showNotif,
  setShowNotif,
  setUnreadCount,
  setShowAuthModal,
  setShowCheckout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setSearchQuery,
  setShowOrderStatus,
  handleLogout,
  router,
  timeLeft,
  fmt
}) {
  return (
    <nav className="fixed top-0 left-0 w-full z-[80] glass-nav">
      <div className="py-1.5 px-4 text-center flex justify-center items-center gap-2" style={{ background: 'linear-gradient(90deg,#7f1d1d,#000000,#7f1d1d)', borderBottom: '1px solid rgba(239,68,68,.4)' }}>
        <Flame size={14} className="text-red-500" style={{ filter: 'drop-shadow(0 0 6px #ef4444)', animation: 'fireFlicker .7s ease infinite' }} />
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-red-100">FLASH SALE BERAKHIR DALAM:</span>
        <span className="bg-black/80 px-2 py-0.5 rounded text-[10px] md:text-xs font-mono font-black text-red-400 border border-red-500/50" style={{ textShadow: '0 0 10px #ef4444' }}>{fmt(timeLeft)}</span>
      </div>
      <div className="px-4 md:px-6 py-3 flex justify-between items-center gap-3">
        <div className="text-xl md:text-2xl font-black cursor-pointer tracking-tighter hover:scale-105 transition-transform flex-shrink-0 text-transparent bg-clip-text bg-gradient-to-r from-white to-red-300" onClick={() => window.location.reload()}>
          VinzSky<span className="text-red-500" style={{ textShadow: '0 0 10px rgba(239,68,68,.8)' }}>-shopID</span>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md rounded-full px-4 py-2 transition-all focus-within:border-red-500 focus-within:shadow-[0_0_15px_rgba(255,0,0,0.5)]" style={{ background: 'rgba(0,0,0,.7)', border: '1px solid rgba(255,255,255,.15)' }}>
          <Search size={18} className="text-red-400 mr-2 flex-shrink-0" />
          <input type="text" placeholder="Cari software VinzSky-shopID..." className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400" onChange={e => setSearchQuery(e.target.value)} />
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full visitor-pulse" style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.4)', boxShadow: '0 0 15px rgba(239,68,68,.3)' }}>
          <Eye size={12} className="text-red-500" style={{ filter: 'drop-shadow(0 0 5px #ef4444)' }} />
          <span className="text-[10px] font-black text-red-400">{visitorCount}</span>
          <span className="text-[9px] text-red-300 uppercase font-bold tracking-widest">Online</span>
        </div>

        <div className="flex gap-2 md:gap-3 items-center flex-shrink-0">
          <button onClick={() => setShowAuthModal(true)} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ninja-btn-hover"
            style={authUser
              ? { background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.5)' }
              : { background: 'rgba(185,28,28,.2)', border: '1px solid rgba(220,38,38,.5)', color: '#fca5a5' }}>
            {authUser ? <>
              {authUser.user_metadata?.avatar_url
                ? <img src={authUser.user_metadata.avatar_url} className="w-6 h-6 rounded-full object-cover flex-shrink-0" style={{ border: '1.5px solid rgba(239,68,68,.8)' }} alt="av" />
                : <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ background: 'linear-gradient(135deg,#991b1b,#000000)' }}>{(authUser.user_metadata?.full_name || authUser.email || 'U')[0].toUpperCase()}</div>
              }
              <div className="flex flex-col items-start leading-none ml-1">
                <span className="text-[10px] font-black truncate max-w-[80px]" style={{ color: '#fca5a5' }}>
                  {isAdminUser(authUser) ? 'ADMIN' : authUser.user_metadata?.full_name?.split(' ')[0] || authUser.email?.split('@')[0]}
                </span>
                {userActiveTier && !isAdminUser(authUser) && (
                  <span className="text-[8px] font-black uppercase tracking-widest mt-0.5" style={{ color: userActiveTier.color }}>
                    {userActiveTier.tierName}
                  </span>
                )}
              </div>
            </> : <><LogIn size={14} className="text-red-400" /><span className="text-[10px] font-black uppercase tracking-widest text-red-200">Login</span></>}
          </button>

          <div className="relative cursor-pointer transition-all ninja-menu-hover p-1 rounded-full" onClick={() => { setShowNotif(!showNotif); setUnreadCount(0) }}>
            <Bell size={22} className={unreadCount > 0 ? 'animate-bounce text-red-500 ninja-icon' : 'ninja-icon text-gray-300'} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-[9px] font-bold text-red-600 w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.8)]">{unreadCount}</span>}
          </div>

          <div className="relative cursor-pointer transition-all ninja-menu-hover p-1 rounded-full" onClick={() => setShowCheckout(true)}>
            <ShoppingCart size={22} className="text-gray-300 ninja-icon" />
          </div>

          <div className="relative py-2">
            <MoreVertical size={24} className={`cursor-pointer transition-all ${isMobileMenuOpen ? 'text-red-500' : 'text-gray-300'} ninja-menu-hover p-1 rounded-full`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            {isMobileMenuOpen && <div className="fixed inset-0 z-[400]" onClick={() => setIsMobileMenuOpen(false)} />}
            <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden z-[500] transition-all shadow-[0_10px_60px_rgba(220,38,38,.4)] ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
              style={{ background: 'linear-gradient(135deg,rgba(15,0,0,.98),rgba(0,0,0,1))', backdropFilter: 'blur(32px)', border: '1px solid rgba(239,68,68,.3)' }}>
              <div className="p-4" style={{ borderBottom: '1px solid rgba(239,68,68,.2)' }}>
                {authUser ? (
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {authUser.user_metadata?.avatar_url
                        ? <img src={authUser.user_metadata.avatar_url} className="w-11 h-11 rounded-full object-cover" style={{ border: '2px solid rgba(239,68,68,.8)' }} alt="av" />
                        : <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-black" style={{ background: 'linear-gradient(135deg,#991b1b,#000000)', border: '2px solid rgba(239,68,68,.8)' }}>{(authUser.user_metadata?.full_name || authUser.email || 'U')[0].toUpperCase()}</div>
                      }
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#000] bg-green-500 animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-white font-black truncate drop-shadow-md">{authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Member VinzSky-shopID'}</p>
                      <p className="text-[10px] text-red-200 truncate mt-0.5">{authUser.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.4)' }}><UserCircle size={22} className="text-red-500" /></div>
                    <div><p className="text-[12px] font-black text-red-400">Guest Mode</p><p className="text-[10px] mt-0.5 text-gray-400">Login untuk akses semua fitur</p></div>
                  </div>
                )}
              </div>
              <div className="p-1.5">
                <button onClick={() => { setShowAuthModal(true); setIsMobileMenuOpen(false) }} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold text-gray-300 transition-all ninja-menu-hover">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)' }}><LogIn size={15} className="text-red-500 ninja-icon" /></div>
                  <div><p className="text-[12px] font-black">{authUser ? 'Profil & Akun' : 'Login / Daftar'}</p><p className="text-[9px] text-gray-500">{authUser ? 'Lihat detail akun' : 'Masuk dengan Google'}</p></div>
                </button>
                <button onClick={() => { window.open('https://www.vinzsky.shop/download', '_blank'); setIsMobileMenuOpen(false) }} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold text-gray-300 transition-all ninja-menu-hover">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)' }}><Download size={15} className="text-red-500 ninja-icon" /></div>
                  <div><p className="text-[12px] font-black">Download Software</p><p className="text-[9px] text-gray-500">Pusat unduhan tools</p></div>
                </button>
                {isAdminUser(authUser) && (
                  <button onClick={() => { window.open('/admin', '_blank'); setIsMobileMenuOpen(false) }} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold transition-all ninja-menu-hover" style={{ background: 'rgba(239,68,68,.06)', margin: '2px 0' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.4)' }}>🛡️</div>
                    <div className="flex-1"><p className="text-[12px] font-black text-red-400">Admin Portal</p><p className="text-[9px] text-red-300">Dashboard toko</p></div>
                  </button>
                )}
                <button onClick={() => { setShowOrderStatus(true); setIsMobileMenuOpen(false) }} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold text-gray-300 transition-all ninja-menu-hover">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)' }}><Key size={15} className="text-red-500 ninja-icon" /></div>
                  <div><p className="text-[12px] font-black">Data Lisensi HWID</p><p className="text-[9px] text-gray-500">Cek license key aktif</p></div>
                </button>
                <button onClick={() => { router.push('/tools-lifetime'); setIsMobileMenuOpen(false) }} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold text-gray-300 transition-all ninja-menu-hover">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)' }}><HardDrive size={15} className="text-red-500 ninja-icon" /></div>
                  <div><p className="text-[12px] font-black">Tool-Lifetime</p><p className="text-[9px] text-gray-500">Riwayat link Google Drive</p></div>
                </button>
                <button onClick={() => { setShowOrderStatus(true); setIsMobileMenuOpen(false) }} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold text-gray-300 transition-all ninja-menu-hover">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)' }}><ShoppingCart size={15} className="text-red-500 ninja-icon" /></div>
                  <div><p className="text-[12px] font-black">Status Pesanan</p><p className="text-[9px] text-gray-500">Cek progress pembelian</p></div>
                </button>
                {authUser && <>
                  <div style={{ height: 1, background: 'rgba(239,68,68,.2)', margin: '6px 4px' }} />
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false) }} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold transition-all ninja-menu-hover">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.4)' }}><LogOut size={15} className="text-red-500 ninja-icon" /></div>
                    <div><p className="text-[12px] font-black text-red-400">Keluar Akun</p><p className="text-[9px] text-red-300">Sign out Google</p></div>
                  </button>
                </>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}