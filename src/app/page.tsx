// @ts-nocheck
/* eslint-disable */
'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'; import 'swiper/css/effect-fade'
import {
  Star, Search, ShoppingCart, Bell, MoreVertical, History, Key, X, Plus,
  ShieldCheck, Upload, Send, CheckCircle, Download, FileText, Clock, Printer,
  HardDrive, Trash2, Phone, UserCircle, Quote, Flame, Users, Copy, Crown,
  Percent, Landmark, Mail, Maximize2, Eye, LogIn, LogOut, Zap
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

import CheckoutManual from '../components/Checkoutmanual'
import Navbar from '../components/layout/Navbar'
import dynamic from 'next/dynamic'
const OrderStatus = dynamic(() => import('../components/OrderStatus'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md"><p style={{color: 'white', fontWeight: 'bold'}}>Loading Status Pesanan...</p></div>
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = globalThis.__supabase || createClient(supabaseUrl, supabaseKey)
if (process.env.NODE_ENV !== 'production') globalThis.__supabase = supabase

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'vinz.official9922@gmail.com'
const isAdminUser = (user) => user && (user.email === ADMIN_EMAIL || user.user_metadata?.is_admin)

const DURATIONS = [
  {
    label: 'Trial 1 Jam', code: '1H', multiplier: 0, color: 'text-[#cd7f32]', bg: 'bg-[#cd7f32]/20', border: 'border-[#cd7f32]/50', tierName: 'Bronze',
    diamondColor: '#cd7f32', diamondGlow: 'rgba(205,127,50,.7)', diamondBg: 'rgba(205,127,50,.15)'
  },
  {
    label: '7 Hari', code: '7D', multiplier: 0.3, color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/50', tierName: 'Silver',
    diamondColor: '#60a5fa', diamondGlow: 'rgba(96,165,250,.7)', diamondBg: 'rgba(96,165,250,.15)'
  },
  {
    label: '14 Hari', code: '14D', multiplier: 0.6, color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/50', tierName: 'Gold',
    diamondColor: '#fbbf24', diamondGlow: 'rgba(251,191,36,.7)', diamondBg: 'rgba(251,191,36,.15)'
  },
  {
    label: '30 Hari', code: '30D', multiplier: 1, color: 'text-pink-400', bg: 'bg-pink-400/20', border: 'border-pink-400/50', tierName: 'Ruby',
    diamondColor: '#f472b6', diamondGlow: 'rgba(244,114,182,.7)', diamondBg: 'rgba(244,114,182,.15)'
  },
]

const DiamondIcon = ({ color = '#60a5fa', glow = 'rgba(96,165,250,.7)', size = 24, animate = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 6px ${glow}) drop-shadow(0 0 12px ${glow})` }}>
    <polygon points="12,2 20,8 20,10 12,22 4,10 4,8" fill={color} opacity="0.9" />
    <polygon points="12,2 20,8 12,10 4,8" fill="white" opacity="0.35" />
    <polygon points="12,10 20,10 12,22" fill={color} opacity="0.6" />
    <polygon points="4,10 12,10 12,22" fill={color} opacity="0.8" />
  </svg>
)

const generateFingerprint = () => {
  if (typeof window === 'undefined') return 'unknown_device'
  const { userAgent, language, hardwareConcurrency, deviceMemory } = window.navigator
  const { colorDepth, width, height } = window.screen
  const data = [userAgent, language, colorDepth, `${width}x${height}`, hardwareConcurrency, deviceMemory].join('|')
  let hash = 0; for (let i = 0; i < data.length; i++) { hash = ((hash << 5) - hash) + data.charCodeAt(i); hash = hash & hash }
  return 'FING-' + Math.abs(hash).toString(16)
}

const getExactTime = () => {
  return new Date().toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

function timeAgo(dateParam) {
  if (!dateParam) return 'Baru saja';
  const date = new Date(dateParam);
  const seconds = Math.round((new Date() - date) / 1000);
  if (seconds < 60) return 'Baru saja';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.round(hours / 24);
  return `${days} hari yang lalu`;
}

const GS = () => (
  <style>{`
    html, body { overflow-x: hidden; }
    body.modal-open { overflow: hidden !important; }
    .mscroll { overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(59,130,246,.4) transparent; }
    .mscroll::-webkit-scrollbar { width: 5px; }
    .mscroll::-webkit-scrollbar-thumb { background: rgba(239,68,68,.6); border-radius: 99px; }
    .m-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0,0,0,.5); backdrop-filter: blur(32px) saturate(180%); -webkit-backdrop-filter: blur(32px) saturate(180%); overflow: hidden; }
    .m-box { position: relative; width: 100%; max-height: 92vh; overflow: hidden; display: flex; flex-direction: column; background: rgba(15,0,20,.35) !important; backdrop-filter: blur(48px) saturate(200%) !important; border: 1px solid rgba(255,255,255,0.15) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2) !important; }
    .glass-nav { background: rgba(5,0,20,.3) !important; backdrop-filter: blur(48px) saturate(200%) !important; -webkit-backdrop-filter: blur(48px) saturate(200%) !important; border-bottom: 1px solid rgba(255,255,255,0.1); }

    @keyframes slowGalaxy { 0% { transform: scale(1.05) rotate(0deg); } 50% { transform: scale(1.12) rotate(0.5deg); } 100% { transform: scale(1.05) rotate(0deg); } }
    .animate-slowGalaxy { animation: slowGalaxy 30s infinite ease-in-out; }
    
    @keyframes rainbowGlow {
      0%   { box-shadow: 0 0 20px rgba(239,68,68,0.9), 0 0 45px rgba(239,68,68,0.5), inset 0 0 15px rgba(239,68,68,0.3); border-color: rgba(239,68,68,0.9); }
      14%  { box-shadow: 0 0 20px rgba(249,115,22,0.9), 0 0 45px rgba(249,115,22,0.5), inset 0 0 15px rgba(249,115,22,0.3); border-color: rgba(249,115,22,0.9); }
      28%  { box-shadow: 0 0 20px rgba(234,179,8,0.9), 0 0 45px rgba(234,179,8,0.5), inset 0 0 15px rgba(234,179,8,0.3); border-color: rgba(234,179,8,0.9); }
      42%  { box-shadow: 0 0 20px rgba(34,197,94,0.9), 0 0 45px rgba(34,197,94,0.5), inset 0 0 15px rgba(34,197,94,0.3); border-color: rgba(34,197,94,0.9); }
      57%  { box-shadow: 0 0 20px rgba(6,182,212,0.9), 0 0 45px rgba(6,182,212,0.5), inset 0 0 15px rgba(6,182,212,0.3); border-color: rgba(6,182,212,0.9); }
      71%  { box-shadow: 0 0 20px rgba(99,102,241,0.9), 0 0 45px rgba(99,102,241,0.5), inset 0 0 15px rgba(99,102,241,0.3); border-color: rgba(99,102,241,0.9); }
      85%  { box-shadow: 0 0 20px rgba(168,85,247,0.9), 0 0 45px rgba(168,85,247,0.5), inset 0 0 15px rgba(168,85,247,0.3); border-color: rgba(168,85,247,0.9); }
      100% { box-shadow: 0 0 20px rgba(239,68,68,0.9), 0 0 45px rgba(239,68,68,0.5), inset 0 0 15px rgba(239,68,68,0.3); border-color: rgba(239,68,68,0.9); }
    }
    @keyframes rainbowText {
      0%   { color: #ef4444; filter: drop-shadow(0 0 8px #ef4444); }
      14%  { color: #f97316; filter: drop-shadow(0 0 8px #f97316); }
      28%  { color: #eab308; filter: drop-shadow(0 0 8px #eab308); }
      42%  { color: #22c55e; filter: drop-shadow(0 0 8px #22c55e); }
      57%  { color: #06b6d4; filter: drop-shadow(0 0 8px #06b6d4); }
      71%  { color: #6366f1; filter: drop-shadow(0 0 8px #6366f1); }
      85%  { color: #a855f7; filter: drop-shadow(0 0 8px #a855f7); }
      100% { color: #ef4444; filter: drop-shadow(0 0 8px #ef4444); }
    }

    .ninja-menu-hover { transition: all 0.3s ease; }
    .ninja-menu-hover:hover { animation: rainbowGlow 2s linear infinite, rainbowText 2s linear infinite !important; background: linear-gradient(135deg, rgba(10,0,20,0.98), rgba(0,0,0,1)) !important; transform: translateX(6px); z-index: 10; }
    .ninja-menu-hover:hover svg { animation: rainbowText 2s linear infinite !important; }

    .ninja-btn-hover { transition: all 0.3s ease; }
    .ninja-btn-hover:hover { animation: rainbowGlow 2s linear infinite !important; color: #ffffff !important; transform: scale(1.06) !important; }

    .ninja-card-hover { transition: all 0.4s ease; border: 1px solid rgba(255,255,255,.1); }
    .ninja-card-hover:hover { animation: rainbowGlow 2s linear infinite !important; transform: translateY(-10px) scale(1.03) !important; z-index: 10; }

    @keyframes fomoSlideIn { 0% { opacity: 0; transform: translateX(-100%) scale(0.9); filter: blur(10px); } 70% { transform: translateX(10px) scale(1.02); filter: blur(0); } 100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); } }
    @keyframes fomoSlideOut { 0% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); } 100% { opacity: 0; transform: translateX(-100%) scale(0.9) translateY(-20px); filter: blur(10px); } }
    .fomo-slide-in { animation: fomoSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .fomo-slide-out { animation: fomoSlideOut 0.5s ease-in forwards; }

    @keyframes fireFlicker { 0%,100%{opacity:1;filter:brightness(1) saturate(1.2)} 25%{opacity:.85;filter:brightness(1.4) saturate(1.5)} 50%{opacity:.95;filter:brightness(1.6) saturate(1.8) hue-rotate(5deg)} 75%{opacity:.8;filter:brightness(1.3) saturate(1.4)} }
    @keyframes fireSweep { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    .fire-bar { background: linear-gradient(90deg,#ff3d00,#ff6a00,#ff9500,#ffcc00,#ff6a00,#ff3d00); background-size: 300% 100%; animation: fireSweep 1.8s ease infinite, fireFlicker .6s ease-in-out infinite; box-shadow: 0 0 8px #ff6a00, 0 0 18px #ff9500, 0 0 32px rgba(255,100,0,.6); }
    .fire-price { text-shadow: 0 0 10px rgba(239,68,68,.9), 0 0 22px rgba(239,68,68,.6), 0 0 40px rgba(239,68,68,.3); }

    .btn-cart { flex:1; font-weight:800; padding:1rem; border-radius:1rem; display:flex; align-items:center; justify-content:center; gap:8px; background: linear-gradient(135deg,rgba(234,179,8,.22),rgba(249,115,22,.18)); border: 1.5px solid rgba(234,179,8,.55); color: #fde68a; box-shadow: 0 0 12px rgba(234,179,8,.15); }
    .btn-buy { flex:1; font-weight:800; padding:1rem; border-radius:1rem; display:flex; align-items:center; justify-content:center; gap:8px; background: linear-gradient(135deg,#991b1b,#7f1d1d); color:#fff; border: 1px solid #ef4444; box-shadow: 0 0 14px rgba(239,68,68,.5), 0 0 28px rgba(239,68,68,.3); }

    @keyframes visitorPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.7;transform:scale(1.05);} }
    .visitor-pulse { animation: visitorPulse 2s ease infinite; }

    @keyframes heartbeat-draw {
      0%   { stroke-dashoffset: 2500; opacity: 0; stroke: #ef4444; }
      5%   { opacity: 1; stroke: #f97316; }
      30%  { stroke-dashoffset: 800; opacity: 1; stroke: #facc15; }
      50%  { stroke-dashoffset: 0; opacity: 1; stroke: #4ade80; }
      75%  { stroke-dashoffset: 0; opacity: 1; stroke: #3b82f6; }
      96%  { stroke-dashoffset: -2500; opacity: 0.5; stroke: #a855f7; }
      100% { stroke-dashoffset: -2500; opacity: 0; stroke: #ef4444; }
    }
    @keyframes heartbeat-glow-anim {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.8)) drop-shadow(0 0 20px rgba(239,68,68,0.9)); }
      50%      { filter: drop-shadow(0 0 15px rgba(255,255,255,1)) drop-shadow(0 0 40px rgba(59,130,246,0.9)) drop-shadow(0 0 70px rgba(168,85,247,0.7)); }
    }
    .heartbeat-line {
      stroke-dasharray: 2500;
      animation: heartbeat-draw 3.2s ease-in-out infinite, heartbeat-glow-anim 1.6s ease-in-out infinite;
    }
    @keyframes hb-pulse-dot { 0%,100%{opacity:0;r:0} 45%,55%{opacity:1;r:6} }
    .hb-pulse-dot { animation: hb-pulse-dot 2.6s ease-in-out infinite; }
    @keyframes testi-glow { 0%,100%{text-shadow:0 0 15px rgba(239,68,68,.8),0 0 30px rgba(239,68,68,.4)} 50%{text-shadow:0 0 25px rgba(239,68,68,1),0 0 50px rgba(239,68,68,.7),0 0 80px rgba(239,68,68,.3)} }
    .testi-glow { animation: testi-glow 2s ease-in-out infinite; }

    @keyframes shootStar { 0%{transform:translateX(-100px) translateY(-100px) rotate(35deg);opacity:1} 100%{transform:translateX(110vw) translateY(110vh) rotate(35deg);opacity:0} }
    .sstar { position:fixed; z-index:1; pointer-events:none; width:2px; border-radius:999px; background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,.95)); }
    .sstar:nth-child(1){height:70px;top:8%;left:15%;animation:shootStar 3.2s linear 0s infinite;}
    .sstar:nth-child(2){height:50px;top:25%;left:65%;animation:shootStar 4.1s linear 1.3s infinite;}
    .sstar:nth-child(3){height:90px;top:55%;left:8%;animation:shootStar 3.7s linear 2.6s infinite;}
    .sstar:nth-child(4){height:60px;top:4%;left:82%;animation:shootStar 5.2s linear 0.8s infinite;}
    .sstar:nth-child(5){height:45px;top:75%;left:45%;animation:shootStar 4.8s linear 3.5s infinite;}
    .sstar:nth-child(6){height:80px;top:40%;left:90%;animation:shootStar 3.9s linear 1.8s infinite;}

    .neb { position:fixed; z-index:0; pointer-events:none; border-radius:50%; }
    .neb1 { width:900px;height:900px;background:radial-gradient(ellipse,rgba(139,0,50,.15) 0%,rgba(80,0,80,.08) 40%,transparent 70%);top:-300px;left:-300px;animation:slowGalaxy 22s ease-in-out infinite; }
    .neb2 { width:700px;height:700px;background:radial-gradient(ellipse,rgba(0,50,139,.12) 0%,rgba(0,60,120,.08) 40%,transparent 70%);bottom:-200px;right:-200px;animation:slowGalaxy 28s ease-in-out 6s infinite reverse; }
    .neb3 { width:550px;height:550px;background:radial-gradient(ellipse,rgba(80,0,100,.11) 0%,rgba(40,0,60,.06) 40%,transparent 70%);top:35%;left:28%;animation:slowGalaxy 38s ease-in-out 12s infinite; }
    .neb4 { width:400px;height:400px;background:radial-gradient(ellipse,rgba(0,100,80,.09) 0%,transparent 70%);top:10%;right:15%;animation:slowGalaxy 45s ease-in-out 3s infinite; }

    video { transform: translate3d(0,0,0); backface-visibility: hidden; perspective: 1000px; -webkit-font-smoothing: subpixel-antialiased; display: block; will-change: transform, opacity; }
  `}</style>
)

const GalaxyCanvas = () => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const stars = Array.from({ length: 400 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color: ['#ffffff', '#ffe8c0', '#c0d8ff', '#ffd0ff', '#c0ffee', '#ffcccc'][Math.floor(Math.random() * 6)]
    }))

    let frame = 0; let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      stars.forEach(s => {
        const tw = 0.4 + 0.6 * Math.sin(frame * s.speed * 60 + s.phase)
        ctx.globalAlpha = 0.4 + tw * 0.6
        ctx.fillStyle = s.color
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
      })
      ctx.globalAlpha = 1
      frame++
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

const HeartbeatDivider = () => (
  <div style={{ position: 'relative', width: '100%', height: '80px', margin: '0 0 3rem 0', overflow: 'visible' }}>
    <svg viewBox="0 0 1400 80" preserveAspectRatio="none" style={{ width: '100%', height: '80px', display: 'block', overflow: 'visible' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="hbGlow" x="-20%" y="-300%" width="140%" height="700%">
          <feGaussianBlur stdDeviation="2.5" result="b1" />
          <feGaussianBlur stdDeviation="6" result="b2" />
          <feGaussianBlur stdDeviation="14" result="b3" />
          <feMerge><feMergeNode in="b3" /><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="hbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0000" stopOpacity="0" />
          <stop offset="8%" stopColor="#ff0000" stopOpacity="1" />
          <stop offset="50%" stopColor="#ff3300" stopOpacity="1" />
          <stop offset="92%" stopColor="#ff0000" stopOpacity="1" />
          <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="heartbeat-line" filter="url(#hbGlow)" fill="none" stroke="url(#hbGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M 0,40 L 80,40 L 110,40 L 120,40 L 128,16 L 138,66 L 148,8 L 158,72 L 168,40 L 200,40 L 260,40 L 270,40 L 278,22 L 288,58 L 298,10 L 308,70 L 318,40 L 350,40 L 430,40 L 440,40 L 448,18 L 458,62 L 468,6 L 478,74 L 488,40 L 520,40 L 600,40 L 610,40 L 618,20 L 628,60 L 638,8 L 648,72 L 658,40 L 690,40 L 780,40 L 790,40 L 798,16 L 808,65 L 818,10 L 828,70 L 838,40 L 870,40 L 960,40 L 970,40 L 978,22 L 988,58 L 998,8 L 1008,72 L 1018,40 L 1050,40 L 1140,40 L 1150,40 L 1158,18 L 1168,62 L 1178,6 L 1188,74 L 1198,40 L 1230,40 L 1320,40 L 1330,40 L 1338,20 L 1348,60 L 1358,10 L 1368,70 L 1378,40 L 1400,40" />
      <circle cx="1400" cy="40" r="5" fill="#ff0000" className="hb-pulse-dot" filter="url(#hbGlow)" />
    </svg>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)', padding: '10px 28px', borderRadius: '999px', border: '1px solid rgba(239,68,68,0.5)', boxShadow: '0 0 30px rgba(220,38,38,0.35)', whiteSpace: 'nowrap', zIndex: 2 }}>
      <Quote size={18} style={{ color: '#ef4444', filter: 'drop-shadow(0 0 8px #ef4444)', fill: '#ef4444' }} />
      <span className="testi-glow" style={{ fontSize: '1.05rem', fontWeight: 900, fontStyle: 'italic', background: 'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#f97316,#ef4444)', backgroundSize: '200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Testimoni VinzSky-shopID</span>
    </div>
  </div>
)

export default function Home() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[3])
  const [showCheckout, setShowCheckout] = useState(false)
  const [payMethod, setPayMethod] = useState('midtrans')
  const [customerName, setCustomerName] = useState('')
  const [customerWA, setCustomerWA] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showReceipt, setShowReceipt] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [historyData, setHistoryData] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showNotif, setShowNotif] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(7200)
  const [isVipMember, setIsVipMember] = useState(false)
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [hasShownExit, setHasShownExit] = useState(false)
  const [hasExitPromo, setHasExitPromo] = useState(false)
  const [isCheckingTrial, setIsCheckingTrial] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [publicReviews, setPublicReviews] = useState([])
  const [isLoadingDB, setIsLoadingDB] = useState(true)
  const [dbError, setDbError] = useState(null)
  const [fullscreenVideo, setFullscreenVideo] = useState(null)

  const [showManualCheckout, setShowManualCheckout] = useState(false)
  const [showOrderStatus, setShowOrderStatus] = useState(false)

  const [fomoQueue, setFomoQueue] = useState([])
  const [activeFomo, setActiveFomo] = useState(null)
  const [fomoLeaving, setFomoLeaving] = useState(false)
  const fomoTimerRef = useRef(null)

  const [visitorCount, setVisitorCount] = useState(0)
  const [viewCounts, setViewCounts] = useState({})
  const visitorIdRef = useRef(null)
  const [authUser, setAuthUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const [userActiveTier, setUserActiveTier] = useState(null)

  const isAnyModalOpen = showCheckout || showManualCheckout || showOrderStatus || selectedProduct !== null || activeMenu !== null || showReceipt !== null || showExitPopup || fullscreenVideo !== null || showAuthModal

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user || null)
      if (session?.user?.email) {
        setCustomerEmail(session.user.email)
        setCustomerName(session.user.user_metadata?.full_name || '')
      } else {
        const shown = sessionStorage.getItem('vs_auth_shown')
        if (!shown) {
          setTimeout(() => { setShowAuthModal(true); sessionStorage.setItem('vs_auth_shown', '1') }, 1500)
        }
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthUser(session?.user || null)
      if (session?.user) {
        setCustomerEmail(session.user.email || '')
        setCustomerName(session.user.user_metadata?.full_name || '')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (authUser?.email) {
      const fetchUserTier = async () => {
        const { data } = await supabase
          .from('user_licenses')
          .select('tier_code, duration_days')
          .eq('user_email', authUser.email)
          .eq('license_status', 'ACTIVE')
          .order('duration_days', { ascending: false })
          .limit(1)

        if (data && data.length > 0) {
          const tier = DURATIONS.find(d => d.code === data[0].tier_code)
          if (tier) setUserActiveTier(tier)
        }
      }
      fetchUserTier()
    } else {
      setUserActiveTier(null)
    }
  }, [authUser])

  const handleGoogleLogin = async () => {
    setAuthLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : 'https://www.vinzsky.shop',
        queryParams: { access_type: 'offline', prompt: 'consent' }
      }
    })
    setAuthLoading(false)
  }
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthUser(null)
    setShowAuthModal(false)
  }

  useEffect(() => {
    document.body.classList.toggle('modal-open', isAnyModalOpen)
    return () => document.body.classList.remove('modal-open')
  }, [isAnyModalOpen])

  useEffect(() => {
    if (!activeFomo && fomoQueue.length > 0 && !isAnyModalOpen) {
      const [next, ...rest] = fomoQueue; setFomoQueue(rest); setActiveFomo(next); setFomoLeaving(false)
      fomoTimerRef.current = setTimeout(() => { setFomoLeaving(true); setTimeout(() => setActiveFomo(null), 500) }, 6000)
    }
    return () => clearTimeout(fomoTimerRef.current)
  }, [activeFomo, fomoQueue, isAnyModalOpen])

  const pushFomo = useCallback((item) => setFomoQueue(q => [...q.slice(-4), item]), [])

  useEffect(() => {
    const handlePurchaseFomo = (e) => {
      pushFomo({
        type: 'purchase',
        title: '🛒 PEMBELIAN BARU',
        name: e.detail.name || 'Guest User',
        avatar: null,
        desc: `Baru saja membeli paket ${e.detail.product}`,
        time: getExactTime()
      });
    };
    const handleReviewFomo = (e) => {
      pushFomo({
        type: 'review',
        title: '🌟 ULASAN BARU',
        name: e.detail.name || 'Sultan User',
        avatar: e.detail.avatar || null,
        desc: `Memberikan ulasan bintang ${e.detail.rating} untuk ${e.detail.product}`,
        time: getExactTime()
      });
    };
    
    window.addEventListener('new_purchase_fomo', handlePurchaseFomo);
    window.addEventListener('new_review_fomo', handleReviewFomo);
    
    return () => {
        window.removeEventListener('new_purchase_fomo', handlePurchaseFomo);
        window.removeEventListener('new_review_fomo', handleReviewFomo);
    };
  }, [pushFomo]);

  useEffect(() => {
    const ck = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    const s = document.createElement('script'); s.src = 'https://app.midtrans.com/snap/snap.js'
    s.setAttribute('data-client-key', ck); s.async = true; document.body.appendChild(s)
    return () => { try { document.body.removeChild(s) } catch (e) { } }
  }, [])

  useEffect(() => {
    ; (async () => {
      setIsLoadingDB(true)
      try {
        const { data: dbP, error: pE } = await supabase.from('products').select('*').order('id', { ascending: true })
        if (pE) throw pE
        setAllProducts((dbP || []).map(p => ({
          id: p.id || Math.random(), name: p.name || 'Produk', category: p.category || 'AI',
          price: p.price || 0, originalPrice: p.originalprice || p.price || 0, stock: p.stock || 99,
          isFlashSale: p.isflashsale || false, image: p.image || '/produk1.jpg',
          desc: p.product_desc || p.desc || p.description || 'Deskripsi eksklusif dari VinzSky-shopID.',
          zipLink: (p.ziplink && p.ziplink !== '#' && p.ziplink !== '') ? p.ziplink : null,
          pdfLink: (p.pdflink && p.pdflink !== '#' && p.pdflink !== '') ? p.pdflink : null,
          isLifetime: p.islifetime || false, videoUrl: p.videourl || '',
          discountPersen: p.discount_persen ?? 0, discountExit: p.discount_exit ?? 10,
          discountVip: p.discount_vip ?? 5, discountFlashsale: p.discount_flashsale ?? 0,
          discountAktif: p.discount_aktif ?? false, discountLabel: p.discount_label || '',
        })))
        const { data: dbR } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
        setPublicReviews(dbR || [])
      } catch (e) { setDbError(e.message) }
      setIsLoadingDB(false)
    })()
  }, [])

  useEffect(() => {
    const track = async () => {
      const fp = generateFingerprint(); visitorIdRef.current = fp
      try {
        await supabase.from('visitors').upsert([{ visitor_id: fp, last_seen: new Date().toISOString(), user_agent: navigator.userAgent }], { onConflict: 'visitor_id' })
        const since = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { count } = await supabase.from('visitors').select('*', { count: 'exact', head: true }).gte('last_seen', since)
        setVisitorCount(count || 1)
      } catch (e) { }
    }
    track()
    const id = setInterval(async () => {
      try {
        await supabase.from('visitors').upsert([{ visitor_id: visitorIdRef.current, last_seen: new Date().toISOString() }], { onConflict: 'visitor_id' })
        const since = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { count } = await supabase.from('visitors').select('*', { count: 'exact', head: true }).gte('last_seen', since)
        setVisitorCount(count || 1)
      } catch (e) { }
    }, 30000)
    return () => clearInterval(id)
  }, [])

  const trackProductView = useCallback(async (productId) => {
    try {
      const fp = generateFingerprint()
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { data: ex } = await supabase.from('product_views').select('id').eq('product_id', productId).eq('visitor_id', fp).gte('created_at', since).single()
      if (!ex) await supabase.from('product_views').insert([{ product_id: productId, visitor_id: fp }])
      const { count } = await supabase.from('product_views').select('*', { count: 'exact', head: true }).eq('product_id', productId)
      setViewCounts(prev => ({ ...prev, [productId]: count || 0 }))
    } catch (e) { }
  }, [])

  useEffect(() => {
    const onML = e => { if (e.clientY <= 0 && !hasShownExit && !isAnyModalOpen) { setShowExitPopup(true); setHasShownExit(true) } }
    const onVC = () => { if (document.hidden && !hasShownExit && !isAnyModalOpen) { setShowExitPopup(true); setHasShownExit(true) } }
    document.addEventListener('mouseleave', onML); document.addEventListener('visibilitychange', onVC)
    return () => { document.removeEventListener('mouseleave', onML); document.removeEventListener('visibilitychange', onVC) }
  }, [hasShownExit, isAnyModalOpen])

  useEffect(() => {
    const onBefore = e => { if (!hasShownExit) { setShowExitPopup(true); setHasShownExit(true) } }
    window.addEventListener('beforeunload', onBefore)
    return () => window.removeEventListener('beforeunload', onBefore)
  }, [hasShownExit])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('opacity-100', 'translate-y-0'); e.target.classList.remove('opacity-0', 'translate-y-20') } }) }, { threshold: 0.08 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [searchQuery, publicReviews, allProducts, isLoadingDB])

  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem('vinzsky_history') || '[]')
      setHistoryData(h)
      if (h.length) { setIsVipMember(true) }
    } catch (e) { setHistoryData([]) }
  }, [])

  useEffect(() => { const id = setInterval(() => setTimeLeft(p => p <= 0 ? 7200 : p - 1), 1000); return () => clearInterval(id) }, [])
  useEffect(() => { if (showNotif) { const t = setTimeout(() => setShowNotif(false), 5500); return () => clearTimeout(t) } }, [showNotif, notifications])

  const fmt = s => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const calcPrice = (basePrice, product = null) => {
    if (!basePrice) return 0
    const p = product; const candidates = []
    if (p) {
      if (p.discountAktif && p.discountPersen > 0) candidates.push(p.discountPersen)
      if (p.isFlashSale) { const fsDisc = p.discountFlashsale > 0 ? p.discountFlashsale : (p.discountAktif ? p.discountPersen : 0); if (fsDisc > 0) candidates.push(fsDisc) }
      if (hasExitPromo && (p.discountExit ?? 10) > 0) candidates.push(p.discountExit ?? 10)
      if (isVipMember && !hasExitPromo && (p.discountVip ?? 5) > 0) candidates.push(p.discountVip ?? 5)
    } else { if (hasExitPromo) candidates.push(10); else if (isVipMember) candidates.push(5) }
    return Math.round(basePrice * (1 - Math.max(...(candidates.length ? candidates : [0])) / 100))
  }

  const handleCloseProduct = () => { if (!hasExitPromo && !hasShownExit) { setShowExitPopup(true); setHasShownExit(true) } else setSelectedProduct(null) }
  const handleCloseCheckout = () => {
    if (cart.length > 0) { if (!hasExitPromo) { setShowExitPopup(true); setHasShownExit(true) } }
    setShowCheckout(false)
  }
  const addNotif = (text) => { setNotifications(p => [{ time: new Date().toLocaleTimeString(), text }, ...p]); setUnreadCount(c => c + 1); setShowNotif(true) }

  const handleProductAction = async (product, duration, type) => {
    if (duration.code === '1H') {
      setIsCheckingTrial(true)
      try {
        const fp = generateFingerprint(); let ip = 'Unknown'
        try { ip = (await (await fetch('https://api.ipify.org?format=json')).json()).ip } catch (e) { }
        const { data: ex } = await supabase.from('trial_usage').select('*').eq('device_fingerprint', fp).single()
        if (ex) { setIsCheckingTrial(false); alert('🚨 TRIAL SUDAH DIGUNAKAN!\n\nUpgrade ke lisensi resmi sekarang!'); return }
        await supabase.from('trial_usage').insert([{ device_fingerprint: fp, ip_address: ip }])
        alert('🎉 TRIAL 1 Jam DIAKTIFKAN!')
      } catch (e) { console.error(e) }
      setIsCheckingTrial(false)
    }
    const fp = calcPrice(product.price, product) * duration.multiplier
    const item = { ...product, finalPrice: fp, durationLabel: duration.label, durationCode: duration.code, ...duration, cartId: Date.now() }
    setCart(c => [...c, item]); setSelectedProduct(null)
    if (type === 'cart') addNotif(`${product.name} masuk keranjang!`)
    else setShowCheckout(true)
  }

  const removeFromCart = i => { const nc = [...cart]; const rm = nc.splice(i, 1)[0]; setCart(nc); if (!nc.length) setShowCheckout(false); addNotif(`${rm.name} dibatalin 🥺`) }
  const clearCart = () => { setCart([]); setShowCheckout(false); addNotif('Keranjang dikosongkan.') }

  const eksekusiPembayaran = async () => {
    if (!customerName || !customerWA || !customerEmail) return alert('Lengkapi Nama, WA, dan Email dulu Bosku!')
    const total = cart.reduce((s, i) => s + i.finalPrice, 0)
    if (total === 0) { setIsSending(true); await prosesPesananLokal('TRIAL AKTIF'); setIsSending(false); return }
    setIsSending(true); const oid = 'TRX-' + Date.now()
    try {
      const res = await fetch('/api/midtrans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: oid, gross_amount: total, customer_details: { first_name: customerName, phone: customerWA, email: customerEmail } }) })
      const data = await res.json()
      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: async r => { await prosesPesananLokal(`LUNAS (MIDTRANS)`, null, oid); setIsSending(false) },
          onPending: () => { alert('Selesaikan pembayaran.'); setIsSending(false) },
          onError: () => { alert('Pembayaran Gagal!'); setIsSending(false) },
          onClose: () => { setShowExitPopup(true); setIsSending(false) },
        })
      } else { alert('Gagal konek Midtrans!'); setIsSending(false) }
    } catch (e) { alert('Gagal menghubungi server.'); setIsSending(false) }
  }

  const prosesPesananLokal = async (status, _file = null, tid = null) => {
    const total = cart.reduce((s, i) => s + i.finalPrice, 0)
    const trxId = tid || 'TRX-' + Date.now()
    const key = 'VINZ-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    
    const isLifetimeOrder = cart.some(c => c.isLifetime || c.durationCode === 'LIFETIME');

    let durationDays = 30;
    if (cart[0].durationCode === '1H') durationDays = 1;
    else if (cart[0].durationCode === '7D') durationDays = 7;
    else if (cart[0].durationCode === '14D') durationDays = 14;
    else if (cart[0].durationCode === '30D') durationDays = 30;
    else if (cart[0].durationCode === 'LIFETIME') durationDays = 36500;
    else durationDays = 36500;

    if (isLifetimeOrder) {
      await supabase.from('lifetime_orders').insert([{
        order_id: trxId,
        email: customerEmail || authUser?.email || null,
        product_name: cart[0].name,
        price: total,
        status: status.includes('LUNAS') || status === 'TRIAL AKTIF' ? 'SUCCESS' : 'PENDING',
        drive_link: cart[0].zipLink || cart[0].pdfLink || 'Link Google Drive Belum Tersedia'
      }])
    } else {
      const hwid = 'MENUNGGU-HWID'; 
      await supabase.from('user_licenses').insert([{
        user_name: customerName || authUser?.user_metadata?.full_name || 'Guest',
        user_email: customerEmail || authUser?.email || null,
        is_guest: !authUser,
        user_wa: customerWA,
        license_key: key,
        hwid: hwid,
        package_name: cart[0].name,
        tier_code: cart[0].durationCode,
        duration_days: durationDays,
        order_status: status.includes('LUNAS') || status === 'TRIAL AKTIF' ? 'SUCCESS' : 'PENDING',
        license_status: status.includes('LUNAS') || status === 'TRIAL AKTIF' ? 'ACTIVE' : 'INACTIVE',
        order_id: trxId
      }])
    }

    const hwidItems = cart.map(c => ({ productName: c.name, duration: c.durationLabel, keyStatus: status.includes('LUNAS') || status === 'TRIAL AKTIF' ? (isLifetimeOrder ? 'LIFETIME ACCESS' : key) : 'Menunggu Verifikasi', isSuccess: status.includes('LUNAS') || status === 'TRIAL AKTIF', ...c }))
    const trx = { id: trxId, date: new Date().toLocaleString(), total, masterHwid: isLifetimeOrder ? 'TANPA-HWID' : 'MENUNGGU-HWID', customerName, customerWA, customerEmail, hwidItems }
    
    const upd = [trx, ...historyData]; setHistoryData(upd); localStorage.setItem('vinzsky_history', JSON.stringify(upd))
    
    if(typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('new_purchase_fomo', { detail: { name: customerName || authUser?.user_metadata?.full_name || 'Guest User', product: cart[0]?.name || 'Produk VIP' } }));
    }

    setIsVipMember(true);
    setCart([]); setShowCheckout(false); setCustomerName(''); setCustomerWA(''); setCustomerEmail('')
    setShowReceipt(trx)
  }

  const handleManualSuccess = (data) => {
    const upd = [data, ...historyData]; 
    setHistoryData(upd); 
    localStorage.setItem('vinzsky_history', JSON.stringify(upd));
    setShowManualCheckout(false); 
    setCart([]); 
    setShowReceipt(data)
  }

  const filtered = allProducts.filter(p => { const s = (searchQuery || '').toLowerCase(); return (p.name || '').toLowerCase().includes(s) || (p.category || '').toLowerCase().includes(s) })

  const renderAvatar = (name, url) => {
    if (url) return <img src={url} className="w-12 h-12 rounded-full border-2 border-red-600 shadow-[0_0_15px_rgba(239,68,68,0.8)] object-cover flex-shrink-0" alt="avatar" />
    return <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-white bg-gradient-to-br from-red-700 to-black border-2 border-red-600 shadow-[0_0_15px_rgba(239,68,68,0.8)] flex-shrink-0">{(name || 'G')[0].toUpperCase()}</div>
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans text-white" style={{ background: 'linear-gradient(135deg, #000008 0%, #050010 30%, #080018 60%, #030010 100%)' }}>
      <GS />

      <GalaxyCanvas />
      <div className="sstar" /><div className="sstar" /><div className="sstar" />
      <div className="sstar" /><div className="sstar" /><div className="sstar" />
      <div className="neb neb1" /><div className="neb neb2" /><div className="neb neb3" /><div className="neb neb4" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,20,0.5) 0%, rgba(5,0,20,0.2) 40%, rgba(5,0,20,0.2) 60%, rgba(0,0,20,0.5) 100%)' }}></div>

      <Navbar
        authUser={authUser}
        userActiveTier={userActiveTier}
        isAdminUser={isAdminUser}
        visitorCount={visitorCount}
        cartCount={cart.length}
        unreadCount={unreadCount}
        showNotif={showNotif}
        setShowNotif={setShowNotif}
        setUnreadCount={setUnreadCount}
        setShowAuthModal={setShowAuthModal}
        setShowCheckout={setShowCheckout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setSearchQuery={setSearchQuery}
        setShowOrderStatus={setShowOrderStatus}
        handleLogout={handleLogout}
        router={router}
        timeLeft={timeLeft}
        fmt={fmt}
      />

      {!isAnyModalOpen && activeFomo && (
        <div className={`fixed z-[95] w-[320px] md:w-[360px] ${fomoLeaving ? 'fomo-slide-out' : 'fomo-slide-in'}`} style={{ top: '85px', left: '16px' }}>
          <div className="relative rounded-2xl p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(20,0,0,0.95), rgba(0,0,0,0.98))', backdropFilter: 'blur(24px)', border: '1px solid rgba(239,68,68,0.5)', boxShadow: '0 0 30px rgba(220,38,38,0.4), inset 0 0 20px rgba(220,38,38,0.2)' }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #ef4444, #b91c1c, transparent)' }} />
            <div className="flex items-center gap-4 relative z-10">
              {renderAvatar(activeFomo.name, activeFomo.avatar)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">{activeFomo.title}</span>
                  {activeFomo.type === 'purchase' && <ShoppingCart size={12} className="text-red-400" />}
                  {activeFomo.type === 'review' && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                </div>
                <p className="text-sm font-black text-white truncate drop-shadow-md">{activeFomo.name}</p>
                <p className="text-[11px] text-gray-300 font-bold truncate mt-0.5">{activeFomo.desc}</p>
                <div className="mt-2 flex items-center gap-1.5 opacity-80">
                  <Clock size={10} className="text-red-500" />
                  <p className="text-[9px] text-red-300 font-mono tracking-wider">{activeFomo.time}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {fullscreenVideo && (
        <div className="video-fullscreen-overlay" onClick={() => setFullscreenVideo(null)}>
          <button onClick={() => setFullscreenVideo(null)} className="absolute top-5 right-5 z-50 bg-red-600 hover:bg-red-500 rounded-full p-3 transition-all ninja-btn-hover"><X size={28} /></button>
          <div className="w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <video src={fullscreenVideo} controls autoPlay playsInline className="max-w-full max-h-full rounded-2xl" style={{ objectFit: 'contain' }} />
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="m-overlay" style={{ zIndex: 99997 }} onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal-in relative w-full max-w-sm rounded-[2rem] overflow-hidden" onClick={e => e.stopPropagation()}
            style={{ background: 'linear-gradient(135deg,rgba(20,0,0,.95),rgba(0,0,0,.98))', backdropFilter: 'blur(48px) saturate(200%)', border: '1px solid rgba(239,68,68,.4)', boxShadow: '0 0 80px rgba(220,38,38,.3), inset 0 0 30px rgba(220,38,38,.1)' }}>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/15 hover:scale-110 ninja-btn-hover" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)' }}><X size={15} /></button>
            <div className="p-8 text-center">
              {authUser ? (
                <div>
                  <div className="relative mx-auto mb-5 w-24 h-24">
                    {authUser.user_metadata?.avatar_url
                      ? <img src={authUser.user_metadata.avatar_url} alt="avatar" className="relative w-24 h-24 rounded-full object-cover" style={{ border: '2.5px solid rgba(239,68,68,.8)', boxShadow: '0 0 20px rgba(239,68,68,.6)' }} />
                      : <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black mx-auto" style={{ background: 'linear-gradient(135deg,#b91c1c,#000000)', border: '2.5px solid rgba(239,68,68,.8)', boxShadow: '0 0 20px rgba(239,68,68,.6)' }}>{(authUser.user_metadata?.full_name || authUser.email || 'U')[0].toUpperCase()}</div>
                    }
                  </div>
                  <h2 className="text-xl font-black text-white mb-0.5">{authUser.user_metadata?.full_name || 'Member VinzSky-shopID'}</h2>
                  <p className="text-xs text-gray-400 mb-2">{authUser.email}</p>
                  
                  <div className="space-y-2 mb-6">
                    {(isAdminUser(authUser) ? [
                      { icon: <ShieldCheck size={20} />, label: 'Admin Portal', sub: 'Dashboard & kelola toko', action: () => { window.open('/admin', '_blank'); setShowAuthModal(false) } },
                      { icon: <Download size={20} />, label: 'Download Software', sub: 'Pusat unduhan tools & panduan', action: () => { window.open('https://www.vinzsky.shop/download', '_blank'); setShowAuthModal(false) } },
                      { icon: <Key size={20} />, label: 'Data Lisensi HWID', sub: 'Cek license key aktif Anda', action: () => { setActiveMenu(null); setShowOrderStatus(true); setShowAuthModal(false) } },
                      { icon: <HardDrive size={20} />, label: 'Tool-Lifetime', sub: 'Akses link Google Drive & Riwayat', action: () => { router.push('/tools-lifetime'); setShowAuthModal(false) } },
                      { icon: <ShoppingCart size={20} />, label: 'Status Pesanan', sub: 'Cek progress & status pembelian', action: () => { setShowOrderStatus(true); setShowAuthModal(false) } }
                    ] : [
                      { icon: <Download size={20} />, label: 'Download Software', sub: 'Pusat unduhan tools & panduan', action: () => { window.open('https://www.vinzsky.shop/download', '_blank'); setShowAuthModal(false) } },
                      { icon: <Key size={20} />, label: 'Data Lisensi HWID', sub: 'Cek license key aktif Anda', action: () => { setActiveMenu(null); setShowOrderStatus(true); setShowAuthModal(false) } },
                      { icon: <HardDrive size={20} />, label: 'Tool-Lifetime', sub: 'Akses link Google Drive & Riwayat', action: () => { router.push('/tools-lifetime'); setShowAuthModal(false) } },
                      { icon: <ShoppingCart size={20} />, label: 'Status Pesanan', sub: 'Cek progress & status pembelian', action: () => { setShowOrderStatus(true); setShowAuthModal(false) } }
                    ]).map((item, i) => (
                      <button key={i} onClick={item.action} className="w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all text-left ninja-menu-hover" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                        <span className="text-xl ninja-icon text-red-400">{item.icon}</span>
                        <div className="flex-1"><p className="text-sm font-black text-white">{item.label}</p><p className="text-[10px] text-gray-500">{item.sub}</p></div>
                        <span className="text-gray-600 text-sm ninja-icon">→</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={handleLogout} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ninja-btn-hover" style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', color: '#f87171' }}><LogOut size={15} />Keluar dari Akun</button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Selamat Datang!</h2>
                  <p className="text-xs text-red-400 mb-1 font-black uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">VinzSky-shopID</p>
                  <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">Login untuk akses riwayat pembelian,<br />lisensi, dan G-Drive Anda</p>
                  <button onClick={handleGoogleLogin} disabled={authLoading} className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all mb-3 disabled:opacity-60 ninja-btn-hover" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)' }}>
                    {authLoading ? <Clock className="animate-spin" size={18} /> : 'Lanjutkan dengan Google'}
                  </button>
                  <button onClick={() => setShowAuthModal(false)} className="w-full py-3 rounded-xl text-[11px] font-bold transition-all ninja-menu-hover" style={{ color: 'rgba(255,255,255,.25)', border: '1px solid rgba(255,255,255,.07)' }}>👤 Lanjut sebagai Guest (checkout tanpa login)</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showNotif && (
        <div className="fixed top-36 right-4 md:right-6 z-[9999] w-72 md:w-80 rounded-[2rem] overflow-hidden" style={{ background: 'linear-gradient(135deg,rgba(20,0,0,.98),rgba(0,0,0,1))', backdropFilter: 'blur(24px)', border: '1px solid rgba(239,68,68,.5)', boxShadow: '0 0 30px rgba(220,38,38,0.4)' }}>
          <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.1)' }}>
            <span className="flex items-center gap-2 text-red-400 font-black text-[10px] uppercase tracking-widest"><Bell size={12} />System Logs VinzSky</span>
            <X size={14} className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setShowNotif(false)} />
          </div>
          <div className="mscroll" style={{ maxHeight: '220px', padding: '1rem' }}>
            {notifications.length === 0 ? <p className="text-xs text-gray-500 text-center py-6 italic font-bold">No recent logs.</p> : notifications.map((n, i) => (
              <div key={i} className="mb-3 p-3 rounded-xl ninja-card-hover" style={{ background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.15)' }}>
                <p className="text-[9px] text-red-500 font-bold mb-1 flex items-center gap-1"><Clock size={10} />{n.time}</p>
                <p className="text-[11px] text-gray-200 font-bold">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto p-4 md:p-6 pt-40 md:pt-36 min-h-screen">
        <div className="reveal opacity-0 translate-y-20 mb-16 rounded-[2rem] overflow-hidden relative shadow-[0_0_50px_rgba(220,38,38,.4)]" style={{ height: '16rem', border: '1px solid rgba(239,68,68,.35)', background: 'rgba(10,0,20,0.2)' }}>
          <Swiper modules={[Autoplay, EffectFade]} effect="fade" autoplay={{ delay: 3500, disableOnInteraction: false }} speed={1000} loop className="h-full w-full">
            {[{ src: '/produk1.jpg', tag: 'UPDATE V2.0', tagC: 'bg-red-700', title: 'UPSCALE ', hi: 'VIDEO 4K', hiC: 'text-red-500' }, { src: '/produk2.jpg', tag: 'AI POWERED', tagC: 'bg-red-800', title: 'ULTRA HIGH ', hi: 'PHOTO', hiC: 'text-red-600' }].map((sl, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full bg-black/80 backdrop-blur-sm">
                  <img src={sl.src} onError={e => { e.target.onerror = null; e.target.src = '/produk1.jpg' }} className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(15,0,0,1) 0%,rgba(15,0,0,.6) 60%,transparent 100%)' }} />
                  <div className="absolute bottom-10 left-10 z-20">
                    <span className={`${sl.tagC} text-white text-[10px] font-black px-4 py-1.5 rounded-full mb-3 inline-block tracking-widest uppercase`}>{sl.tag}</span>
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tight text-white">{sl.title}<span className={`${sl.hiC}`}>{sl.hi}</span></h2>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h2 className="text-2xl font-black flex items-center gap-3 italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"><Star className="text-red-500 fill-red-500" />Exclusive VinzSky-shopID</h2>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full" style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.4)' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <Eye size={14} className="text-red-500" />
            <span className="text-sm font-black text-red-500">{visitorCount}</span>
            <span className="text-[10px] text-red-300 font-black uppercase tracking-widest">Pengguna Aktif</span>
          </div>
        </div>

        {isLoadingDB ? (
          <div className="w-full text-center py-20 flex flex-col items-center"><Clock className="text-red-600 animate-spin mb-4" size={48} /><p className="text-red-500 font-black animate-pulse tracking-widest">MENYIAPKAN BRANKAS VinzSky-shopID...</p></div>
        ) : dbError ? (
          <div className="w-full rounded-3xl p-8 text-center mb-20" style={{ background: 'rgba(120,0,0,.40)', border: '1px solid rgba(220,38,38,.60)' }}><p className="text-red-400 font-black text-xl mb-2">GAGAL TERHUBUNG KE DATABASE!</p><p className="text-red-300 text-sm font-bold">{dbError}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {filtered.length === 0 ? <div className="w-full text-center py-20 col-span-full"><p className="text-red-500 italic font-bold">Belum ada produk.</p></div> : filtered.map(p => {
              const fp = calcPrice(p.price, p); const pvc = viewCounts[p.id] || 0
              return (
                <div key={p.id} className="reveal opacity-0 translate-y-20">
                  <div onClick={() => { 
                      setSelectedProduct(p); 
                      setSelectedDuration(p.isLifetime ? { label: 'Akses Selamanya', code: 'LIFETIME', multiplier: 1, color: 'text-amber-500', bg: 'bg-amber-500/20', border: 'border-amber-500/50', tierName: 'Lifetime', diamondColor: '#f59e0b', diamondGlow: 'rgba(245,158,11,.7)', diamondBg: 'rgba(245,158,11,.15)' } : DURATIONS[3]); 
                      trackProductView(p.id);
                  }} className="group relative rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl flex flex-col h-full ninja-card-hover" style={{ background: 'linear-gradient(135deg, rgba(20,0,10,0.35), rgba(5,0,15,0.25))', backdropFilter: 'blur(20px)', border: '1px solid rgba(239,68,68,.4)' }}>

                    <div className="overflow-hidden relative bg-black" style={{ height: '14rem', borderBottom: '1px solid rgba(239,68,68,0.4)' }}>
                      {p.videoUrl && p.videoUrl !== '' && p.videoUrl !== '#'
                        ? <video key={p.videoUrl} src={p.videoUrl} autoPlay loop muted playsInline preload="metadata" className="w-full h-full object-cover opacity-60 pointer-events-none transition-transform duration-700 group-hover:scale-110 mix-blend-luminosity group-hover:mix-blend-normal" />
                        : <img src={p.image} onError={e => { e.target.onerror = null; e.target.src = '/produk1.jpg' }} className="w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 mix-blend-luminosity group-hover:mix-blend-normal" />
                      }
                      <span className="absolute top-4 right-4 z-20 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,.80)', border: '1px solid rgba(239,68,68,.6)', color: '#fca5a5' }}><Crown size={12} />VIP Engine</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between z-10">
                      <div>
                        <h3 className="text-xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-red-500">{p.name}</h3>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <p className="font-black text-2xl fire-price text-red-500">Rp {fp.toLocaleString()}</p>
                          {(isVipMember || hasExitPromo || p.isFlashSale || (p.discountAktif && p.discountPersen > 0)) && <p className="text-xs text-red-900/80 font-bold line-through">Rp {(p.originalPrice || p.price).toLocaleString()}</p>}
                        </div>
                      </div>
                      <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-red-500/20">
                        <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                          <span className="text-red-500">High Demand</span>
                          <span className="text-white">SISA {p.stock} LISENSI</span>
                        </div>
                        <div className="w-full rounded-full h-2.5 overflow-hidden border border-red-900" style={{ background: 'rgba(0,0,0,1)' }}><div className="fire-bar h-full rounded-full" style={{ width: (p.stock || 50) + '%' }} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="pt-8">
          <HeartbeatDivider />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicReviews.length === 0 ? <div className="w-full text-center py-10 col-span-full rounded-[2rem]" style={{ border: '1px dashed rgba(239,68,68,.4)' }}><p className="text-red-400 italic font-bold">Belum ada ulasan VinzSky-shopID.</p></div> : publicReviews.map((rev, i) => (
              <div key={i} className="reveal opacity-0 translate-y-20">
                <div className="p-8 rounded-[2rem] h-full flex flex-col shadow-2xl ninja-card-hover" style={{ background: 'linear-gradient(135deg, rgba(15,0,10,0.30), rgba(5,0,15,0.20))', backdropFilter: 'blur(20px)', border: '1px solid rgba(239,68,68,.35)' }}>
                  <div className="flex items-center gap-2 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={18} className={j < (rev.rating || 5) ? 'text-yellow-500 fill-yellow-500' : 'text-red-900'} />)}</div>
                  <p className="text-sm text-gray-200 italic mb-4 leading-relaxed font-bold">"{rev.review_text || rev.text || '...'}"</p>
                  <div className="flex justify-between items-end mt-auto pt-4 border-t border-red-500/20">
                    <div>
                      <p className="font-black text-sm text-white">{rev.name || 'Member VinzSky-shopID'}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5 mb-1">{timeAgo(rev.created_at)}</p>
                    </div>
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-16 text-center mt-10" style={{ borderTop: '1px solid rgba(239,68,68,.3)', background: 'rgba(2,0,10,.50)', backdropFilter: 'blur(24px)' }}>
        <p className="text-[11px] text-red-500/60 tracking-[6px] uppercase font-black">Tools By | VinzSky-ShopID Software | software engineer | since 2026</p>
      </footer>

      {selectedProduct && (
        <div className="m-overlay">
          <div className="m-box rounded-[3rem] shadow-[0_0_100px_rgba(220,38,38,.5)]" style={{ maxWidth: '1000px', background: 'rgba(15,0,0,.92)', border: '1px solid rgba(239,68,68,.6)' }}>
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden rounded-[3rem]">
              <div className="media-panel-fill flex-shrink-0 md:w-[48%] relative" style={{ minHeight: '220px', maxHeight: typeof window !== 'undefined' && window.innerWidth >= 768 ? '90vh' : '280px', borderRight: '1px solid rgba(239,68,68,0.3)' }}>
                {selectedProduct.videoUrl && selectedProduct.videoUrl !== '' && selectedProduct.videoUrl !== '#'
                  ? <video key={selectedProduct.videoUrl} src={selectedProduct.videoUrl} controls autoPlay playsInline loop preload="auto" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#000' }} />
                  : <img src={selectedProduct.image} onError={e => { e.target.onerror = null; e.target.src = '/produk1.jpg' }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: .85 }} />
                }
              </div>
              <div className="flex-1 mscroll p-6 md:p-10 flex flex-col relative" style={{ maxHeight: '90vh' }}>
                <button onClick={handleCloseProduct} className="absolute top-6 right-6 rounded-full p-2.5 z-50 transition-colors ninja-btn-hover" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.5)' }}><X size={20} /></button>
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight text-white">{selectedProduct.name}</h2>
                <p className="text-sm text-gray-200 leading-relaxed font-bold mb-6">{selectedProduct.desc}</p>
                {selectedProduct.isLifetime ? (
                  <div className="p-4 rounded-2xl text-center mb-5" style={{ background: 'rgba(245,158,11,.15)', border: '2px solid rgba(245,158,11,.5)' }}><p className="text-amber-500 font-black text-lg uppercase flex justify-center items-center gap-3"><Crown size={24} />LISENSI LIFETIME UNLOCKED</p></div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {DURATIONS.map(d => (
                      <button key={d.code} onClick={() => setSelectedDuration(d)} className={`p-4 rounded-2xl text-xs font-black transition-all flex flex-col items-center gap-2 ${selectedDuration.code === d.code ? 'scale-105 border-2' : 'border ninja-btn-hover'}`}
                        style={selectedDuration.code === d.code ? { background: d.diamondBg, borderColor: d.diamondColor, color: d.diamondColor } : { background: 'rgba(0,0,0,.6)', borderColor: 'rgba(239,68,68,.2)', color: 'rgba(255,255,255,.5)' }}>
                        <span className="font-black tracking-widest uppercase">{d.tierName}</span>
                        <span className="text-[10px] opacity-80 uppercase">{d.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center mb-6 pt-5" style={{ borderTop: '1px solid rgba(239,68,68,.3)' }}>
                  <span className="text-sm font-black text-gray-300 uppercase tracking-widest">Harga Final:</span>
                  <span className="text-3xl md:text-4xl font-black text-red-500">Rp {(calcPrice(selectedProduct.price, selectedProduct) * selectedDuration.multiplier).toLocaleString()}</span>
                </div>
                <div className="flex gap-4 mt-auto">
                  <button onClick={() => handleProductAction(selectedProduct, selectedDuration, 'cart')} disabled={isCheckingTrial} className="btn-cart py-4 text-sm tracking-widest ninja-btn-hover"><ShoppingCart size={20} /><span className="font-black">Masuk Keranjang</span></button>
                  <button onClick={() => handleProductAction(selectedProduct, selectedDuration, 'buy')} disabled={isCheckingTrial} className="btn-buy py-4 text-sm tracking-widest uppercase ninja-btn-hover">Beli Sekarang</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="m-overlay">
          <div className="m-box w-full max-w-md rounded-[2.5rem]" style={{ background: 'rgba(15,0,0,.95)', border: '1px solid rgba(239,68,68,.6)' }}>
            <div className="flex justify-between items-center p-6 pb-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(239,68,68,.3)' }}>
              <h2 className="text-2xl font-black flex gap-3 items-center text-red-500"><ShieldCheck size={28} />Checkout VinzSky</h2>
              <button onClick={handleCloseCheckout} className="rounded-full p-2.5 transition-colors ninja-btn-hover" style={{ background: 'rgba(239,68,68,.2)' }}><X size={20} className="text-white" /></button>
            </div>
            <div className="mscroll p-6 pt-5" style={{ maxHeight: 'calc(92vh - 85px)' }}>
              <div className="p-5 rounded-3xl mb-5" style={{ background: 'rgba(0,0,0,.6)', border: '1px solid rgba(239,68,68,.3)' }}>
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid rgba(239,68,68,.2)' }}>
                    <div className="flex-1 pr-3"><p className="text-sm text-white font-black truncate">{c.name}</p><p className={`text-[10px] font-black uppercase tracking-widest ${c.color} ${c.bg} border ${c.border} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mt-2`}><Crown size={10} />{c.tierName} - {c.durationLabel}</p></div>
                    <div className="flex items-center gap-4"><p className="text-base font-black text-red-400">Rp {c.finalPrice.toLocaleString()}</p><button onClick={() => removeFromCart(i)} className="text-white p-1.5 bg-red-600 rounded-full"><X size={14} /></button></div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 mb-6">
                {[{ icon: <UserCircle size={18} />, ph: 'Nama Lengkap Anda', val: customerName, set: setCustomerName, type: 'text' }, { icon: <Phone size={18} />, ph: 'WhatsApp Aktif', val: customerWA, set: setCustomerWA, type: 'tel' }, { icon: <Mail size={18} />, ph: 'Email Aktif', val: customerEmail, set: setCustomerEmail, type: 'email' }].map((f, i) => (
                  <div key={i} className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">{f.icon}</div><input placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} type={f.type} className="inp text-sm py-4 rounded-2xl border-red-500/30 bg-black/60 pl-12 text-white placeholder-gray-500" /></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[{ key: 'midtrans', icon: <Landmark size={24} />, label: 'Otomatis' }, { key: 'manual', icon: <ShieldCheck size={24} />, label: 'Manual/DANA' }].map(pm => (
                  <button key={pm.key} type="button" onClick={() => setPayMethod(pm.key)} className={`font-black py-4 px-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-[10px] uppercase tracking-widest ${payMethod === pm.key ? 'bg-red-700 text-white border-2 border-red-500' : 'text-red-200 border border-red-500/30 bg-black/60'}`}>{pm.icon}{pm.label}</button>
                ))}
              </div>
              <button type="button" onClick={() => { if (payMethod === 'manual') { setShowCheckout(false); setTimeout(() => setShowManualCheckout(true), 150); } else { eksekusiPembayaran(); } }} disabled={isSending || cart.length === 0} className="w-full py-5 rounded-[1.5rem] font-black text-xl text-white transition-all uppercase tracking-widest ninja-btn-hover" style={{ background: 'linear-gradient(135deg,#991b1b,#ef4444)' }}>
                {isSending ? 'Processing...' : (payMethod === 'manual' ? 'LANJUT TRANSFER MANUAL' : 'BAYAR OTOMATIS')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReceipt && (
        <div className="m-overlay" style={{ zIndex: 99999 }}>
          <div className="bg-white text-black p-8 rounded-lg relative w-full max-w-sm font-mono flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-green-500"><CheckCircle size={32} className="text-green-600" /></div>
            <h2 className="text-2xl font-black mb-1 text-center">VINZSKY-SHOPID</h2>
            <p className="text-[10px] text-gray-500 text-center mb-4 border-b border-dashed border-gray-400 pb-4 w-full uppercase tracking-widest">Order Berhasil Diterima</p>
            <div className="w-full text-xs space-y-2 mb-4 border-b border-dashed border-gray-400 pb-4">
              <div className="flex justify-between"><span className="font-bold">Order ID:</span><span>{showReceipt.id}</span></div>
              <div className="flex justify-between"><span className="font-bold">Tanggal:</span><span>{showReceipt.date}</span></div>
              <div className="flex justify-between"><span className="font-bold">Nama:</span><span>{showReceipt.customerName}</span></div>
            </div>
            <button onClick={() => { setShowReceipt(null); setShowOrderStatus(true); }} className="w-full bg-red-600 text-white font-black py-3 rounded-lg text-sm">TUTUP STRUK</button>
          </div>
        </div>
      )}

      {showExitPopup && (
        <div className="m-overlay" style={{ zIndex: 99998 }}>
          <div className="m-box max-w-sm p-8 text-center rounded-[3rem] bg-[#0a0a0a] border border-red-500/50">
            <button onClick={() => { setShowExitPopup(false); setSelectedProduct(null) }} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X/></button>
            <Percent size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">TUNGGU BOSKU!</h2>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6 animate-pulse">EKSTRA DISKON 10%</p>
            <button onClick={() => { setHasExitPromo(true); setShowExitPopup(false); }} className="w-full bg-red-600 text-white font-black py-4 rounded-xl ninja-btn-hover mb-3">KLAIM DISKON SEKARANG</button>
          </div>
        </div>
      )}

      <CheckoutManual isOpen={showManualCheckout} onClose={() => setShowManualCheckout(false)} cartItems={cart} totalAmount={cart.reduce((s,i)=>s+i.finalPrice,0)} onSuccess={handleManualSuccess} supabase={supabase} />
      <OrderStatus isOpen={showOrderStatus} onClose={() => setShowOrderStatus(false)} userEmail={authUser?.email} supabase={supabase} />
    </div>
  )
}