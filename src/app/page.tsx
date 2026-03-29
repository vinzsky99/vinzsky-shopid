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
  Percent, HeartHandshake, Landmark, Wallet, Mail, Maximize2,
  Eye, TrendingUp, LogIn, LogOut, Zap
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
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
    <line x1="4" y1="8" x2="20" y2="8" stroke="white" strokeWidth="0.5" opacity="0.4" />
    <line x1="4" y1="10" x2="12" y2="2" stroke="white" strokeWidth="0.3" opacity="0.3" />
    <line x1="20" y1="10" x2="12" y2="2" stroke="white" strokeWidth="0.3" opacity="0.3" />
    {animate && <animate attributeName="opacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite" />}
  </svg>
)

const playPop = () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'; osc.frequency.setValueAtTime(400, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1); gain.gain.setValueAtTime(1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1) } catch (e) { } }
const playKaChing = () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const beep = (f, t, d) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = 'square'; o.frequency.setValueAtTime(f, ctx.currentTime + t); g.gain.setValueAtTime(0.3, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + t + d); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + d) }; beep(1200, 0, 0.1); beep(1600, 0.15, 0.3) } catch (e) { } }

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

    /* ═══════════ GALAXY ANIMATION & MOUSE GLOW ═══════════ */
    @keyframes slowGalaxy { 0% { transform: scale(1.05) rotate(0deg); } 50% { transform: scale(1.12) rotate(0.5deg); } 100% { transform: scale(1.05) rotate(0deg); } }
    .animate-slowGalaxy { animation: slowGalaxy 30s infinite ease-in-out; }
    
    .mouse-follower { position: fixed; top: 0; left: 0; width: 12px; height: 12px; border-radius: 50%; pointer-events: none; transform: translate(-50%, -50%); z-index: 999999; animation: rainbowGlowBg 2s linear infinite; mix-blend-mode: screen; transition: opacity 0.3s ease; }
    .mouse-follower::after { content: ''; position: absolute; inset: -40px; border-radius: 50%; background: inherit; filter: blur(30px); opacity: 0.8; }
    @keyframes rainbowGlowBg { 0%{background-color:#ef4444;box-shadow:0 0 20px #ef4444} 14%{background-color:#f97316;box-shadow:0 0 20px #f97316} 28%{background-color:#eab308;box-shadow:0 0 20px #eab308} 42%{background-color:#22c55e;box-shadow:0 0 20px #22c55e} 57%{background-color:#06b6d4;box-shadow:0 0 20px #06b6d4} 71%{background-color:#6366f1;box-shadow:0 0 20px #6366f1} 85%{background-color:#a855f7;box-shadow:0 0 20px #a855f7} 100%{background-color:#ef4444;box-shadow:0 0 20px #ef4444} }


    /* ═══════════ RAINBOW COLORFUL GLOW HOVER ═══════════ */
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

    /* ═══════════ FOMO ═══════════ */
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

    /* ═══════════ HEARTBEAT SVG ANIMASI TERINDAH ═══════════ */
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

    /* ═══════════ SHOOTING STARS ═══════════ */
    @keyframes shootStar { 0%{transform:translateX(-100px) translateY(-100px) rotate(35deg);opacity:1} 100%{transform:translateX(110vw) translateY(110vh) rotate(35deg);opacity:0} }
    .sstar { position:fixed; z-index:1; pointer-events:none; width:2px; border-radius:999px; background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,.95)); }
    .sstar:nth-child(1){height:70px;top:8%;left:15%;animation:shootStar 3.2s linear 0s infinite;}
    .sstar:nth-child(2){height:50px;top:25%;left:65%;animation:shootStar 4.1s linear 1.3s infinite;}
    .sstar:nth-child(3){height:90px;top:55%;left:8%;animation:shootStar 3.7s linear 2.6s infinite;}
    .sstar:nth-child(4){height:60px;top:4%;left:82%;animation:shootStar 5.2s linear 0.8s infinite;}
    .sstar:nth-child(5){height:45px;top:75%;left:45%;animation:shootStar 4.8s linear 3.5s infinite;}
    .sstar:nth-child(6){height:80px;top:40%;left:90%;animation:shootStar 3.9s linear 1.8s infinite;}

    /* ═══════════ NEBULA LAYERS ═══════════ */
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

    const milkyWay = Array.from({ length: 700 }, () => {
      const t = Math.random()
      const bx = W * t
      const by = H * 0.45 + Math.sin(t * Math.PI * 3) * H * 0.15 + (Math.random() - 0.5) * H * 0.2
      return {
        x: bx + (Math.random() - 0.5) * 120,
        y: by + (Math.random() - 0.5) * 60,
        r: Math.random() * 1.4 + 0.15,
        opacity: Math.random() * 0.7 + 0.2,
        color: ['#ffe8c0', '#ffd0e0', '#d0e8ff', '#ffffff', '#ffe0ff'][Math.floor(Math.random() * 5)]
      }
    })

    const nebulas = [
      { x: W * 0.25, y: H * 0.35, rx: 250, ry: 120, color: 'rgba(120,0,60,0.09)', angle: -0.3 },
      { x: W * 0.72, y: H * 0.55, rx: 280, ry: 140, color: 'rgba(0,30,120,0.08)', angle: 0.2 },
      { x: W * 0.5, y: H * 0.25, rx: 180, ry: 100, color: 'rgba(80,0,100,0.07)', angle: 0.1 },
      { x: W * 0.15, y: H * 0.7, rx: 200, ry: 90, color: 'rgba(0,80,80,0.06)', angle: -0.1 },
    ]

    let frame = 0; let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Nebula blobs
      nebulas.forEach(n => {
        ctx.save()
        ctx.translate(n.x, n.y); ctx.rotate(n.angle)
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(n.rx, n.ry))
        g.addColorStop(0, n.color); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.scale(n.rx / Math.max(n.rx, n.ry), n.ry / Math.max(n.rx, n.ry))
        ctx.beginPath(); ctx.arc(0, 0, Math.max(n.rx, n.ry), 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      })

      // Bima Sakti band
      milkyWay.forEach(s => {
        ctx.globalAlpha = s.opacity * (0.5 + 0.5 * Math.sin(frame * 0.004 + s.x * 0.01))
        ctx.fillStyle = s.color
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
      })
      ctx.globalAlpha = 1

      // Normal twinkling stars
      stars.forEach(s => {
        const tw = 0.4 + 0.6 * Math.sin(frame * s.speed * 60 + s.phase)
        ctx.globalAlpha = 0.4 + tw * 0.6
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3)
        grd.addColorStop(0, s.color); grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2); ctx.fill()
        ctx.globalAlpha = Math.min(tw * 1.1, 1)
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 0.5, 0, Math.PI * 2); ctx.fill()
      })
      ctx.globalAlpha = 1

      // Occasional bright star flare
      if (frame % 120 === 0) {
        const bx = Math.random() * W, by = Math.random() * H
        const bg = ctx.createRadialGradient(bx, by, 0, bx, by, 30)
        bg.addColorStop(0, 'rgba(255,255,255,0.9)'); bg.addColorStop(0.3, 'rgba(200,220,255,0.3)'); bg.addColorStop(1, 'transparent')
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(bx, by, 30, 0, Math.PI * 2); ctx.fill()
        // Cross flare
        ctx.globalAlpha = 0.6; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(bx - 40, by); ctx.lineTo(bx + 40, by); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(bx, by - 40); ctx.lineTo(bx, by + 40); ctx.stroke()
        ctx.globalAlpha = 1
      }

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
    <svg viewBox="0 0 1400 80" preserveAspectRatio="none"
      style={{ width: '100%', height: '80px', display: 'block', overflow: 'visible' }} xmlns="http://www.w3.org/2000/svg">
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
      {/* Main heartbeat path - full width left to right */}
      <path className="heartbeat-line" filter="url(#hbGlow)" fill="none"
        stroke="url(#hbGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        d="M 0,40 L 80,40 L 110,40 L 120,40
           L 128,16 L 138,66 L 148,8 L 158,72 L 168,40
           L 200,40 L 260,40
           L 270,40 L 278,22 L 288,58 L 298,10 L 308,70 L 318,40
           L 350,40 L 430,40
           L 440,40 L 448,18 L 458,62 L 468,6 L 478,74 L 488,40
           L 520,40 L 600,40
           L 610,40 L 618,20 L 628,60 L 638,8 L 648,72 L 658,40
           L 690,40 L 780,40
           L 790,40 L 798,16 L 808,65 L 818,10 L 828,70 L 838,40
           L 870,40 L 960,40
           L 970,40 L 978,22 L 988,58 L 998,8 L 1008,72 L 1018,40
           L 1050,40 L 1140,40
           L 1150,40 L 1158,18 L 1168,62 L 1178,6 L 1188,74 L 1198,40
           L 1230,40 L 1320,40
           L 1330,40 L 1338,20 L 1348,60 L 1358,10 L 1368,70 L 1378,40
           L 1400,40"
      />
      {/* Pulse dot at end */}
      <circle cx="1400" cy="40" r="5" fill="#ff0000" className="hb-pulse-dot" filter="url(#hbGlow)" />
    </svg>

    {/* Title pill in center */}
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      display: 'flex', alignItems: 'center', gap: '12px',
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)',
      padding: '10px 28px', borderRadius: '999px',
      border: '1px solid rgba(239,68,68,0.5)',
      boxShadow: '0 0 30px rgba(220,38,38,0.35)',
      whiteSpace: 'nowrap', zIndex: 2,
    }}>
      <Quote size={18} style={{ color: '#ef4444', filter: 'drop-shadow(0 0 8px #ef4444)', fill: '#ef4444' }} />
      <span className="testi-glow" style={{
        fontSize: '1.05rem', fontWeight: 900, fontStyle: 'italic',
        background: 'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#f97316,#ef4444)',
        backgroundSize: '200%',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>Testimoni VinzSky-shopID</span>
    </div>
  </div>
)


export default function Home() {
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[3])
  const [showCheckout, setShowCheckout] = useState(false)
  const [payMethod, setPayMethod] = useState('midtrans')
  const [buktiBayar, setBuktiBayar] = useState(null)
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
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([{ sender: 'cs', text: 'Halo Bosku! Ada yang bisa CS VinzSky-shopID bantu hari ini?' }])
  const [lastUpdateId, setLastUpdateId] = useState(0)
  const [reviewData, setReviewData] = useState(null)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [timeLeft, setTimeLeft] = useState(7200)
  const [isVipMember, setIsVipMember] = useState(false)
  const [vipTierInfo, setVipTierInfo] = useState(null)
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [hasShownExit, setHasShownExit] = useState(false)
  const [hasExitPromo, setHasExitPromo] = useState(false)
  const [isCheckingTrial, setIsCheckingTrial] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [publicReviews, setPublicReviews] = useState([])
  const [isLoadingDB, setIsLoadingDB] = useState(true)
  const [dbError, setDbError] = useState(null)
  const [fullscreenVideo, setFullscreenVideo] = useState(null)

  // 🔥 STATE NOTIFIKASI FOMO DEWA 🔥
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
  const [showOrderStatus, setShowOrderStatus] = useState(false)
  const [orderStatusData, setOrderStatusData] = useState([])

  const receiptCanvasRef = useRef(null)
  const chatEndRef = useRef(null)

  const isAnyModalOpen = showCheckout || selectedProduct !== null || activeMenu !== null || showReceipt !== null || reviewData !== null || showExitPopup || fullscreenVideo !== null || showAuthModal || showOrderStatus

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

  const fetchOrderStatus = useCallback(async () => {
    if (!authUser) return
    try {
      const { data } = await supabase.from('orders').select('*')
        .eq('customer_email', authUser.email)
        .order('created_at', { ascending: false })
      setOrderStatusData(data || [])
    } catch (e) { }
  }, [authUser])

  useEffect(() => { if (authUser) fetchOrderStatus() }, [authUser, fetchOrderStatus])

  useEffect(() => {
    document.body.classList.toggle('modal-open', isAnyModalOpen)
    return () => document.body.classList.remove('modal-open')
  }, [isAnyModalOpen])

  // 🔥 LOGIKA FOMO POPUP SLIDE 🔥
  useEffect(() => {
    if (!activeFomo && fomoQueue.length > 0 && !isAnyModalOpen) {
      const [next, ...rest] = fomoQueue; setFomoQueue(rest); setActiveFomo(next); setFomoLeaving(false)
      // Tahan di layar 5.5 detik
      fomoTimerRef.current = setTimeout(() => { setFomoLeaving(true); setTimeout(() => setActiveFomo(null), 500) }, 5500)
    }
    return () => clearTimeout(fomoTimerRef.current)
  }, [activeFomo, fomoQueue, isAnyModalOpen])

  const pushFomo = useCallback((item) => setFomoQueue(q => [...q.slice(-4), item]), [])

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

  // 🔥 SUPABASE REALTIME MULTI-CHANNEL UNTUK FOMO NOTIFICATION 🔥
  useEffect(() => {
    const ch = supabase.channel('realtime-fomo-super')
      // 1. DETEKSI PEMBELIAN BARU (orders)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        const o = payload.new;
        const buyerName = o.buyer_name || o.customer_name || 'Guest User';
        const productName = o.items?.[0]?.name || 'Produk VIP';
        pushFomo({
          type: 'purchase',
          title: '🛒 PEMBELIAN BARU',
          name: buyerName,
          avatar: o.buyer_avatar || null,
          desc: `Baru saja membeli paket ${productName}`,
          time: getExactTime()
        });
        setNotifications(n => [{ time: new Date().toLocaleTimeString(), text: `🛒 ${buyerName} membeli ${productName}` }, ...n]);
        setUnreadCount(c => c + 1); setShowNotif(true);
      })
      // 2. DETEKSI REVIEW BARU (reviews)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, payload => {
        const r = payload.new;
        const reviewerName = r.name || 'Sultan User';
        pushFomo({
          type: 'review',
          title: '🌟 ULASAN BARU',
          name: reviewerName,
          avatar: r.buyer_avatar || null,
          desc: `Memberikan ulasan bintang ${r.rating} untuk ${r.product}`,
          time: getExactTime()
        });
      })
      // 3. DETEKSI AKTIVASI TOOLS (licenses UPDATE to ACTIVE)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'licenses' }, payload => {
        const l = payload.new;
        const old = payload.old;
        if (l.status === 'ACTIVE' && old.status !== 'ACTIVE') {
          pushFomo({
            type: 'activation',
            title: '⚡ AKTIVASI TOOLS',
            name: 'Member VinzSky-shopID',
            avatar: null,
            desc: `Baru saja mengaktifkan tools (Paket ${l.tier})`,
            time: getExactTime()
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(ch) }
  }, [pushFomo])

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
      if (h.length) { setIsVipMember(true); const t = DURATIONS.find(d => d.label === h[0]?.hwidItems?.[0]?.duration) || DURATIONS[3]; setVipTierInfo(t) }
    } catch (e) { setHistoryData([]) }
  }, [])

  useEffect(() => { const id = setInterval(() => setTimeLeft(p => p <= 0 ? 7200 : p - 1), 1000); return () => clearInterval(id) }, [])
  useEffect(() => { if (showNotif) { const t = setTimeout(() => setShowNotif(false), 5500); return () => clearTimeout(t) } }, [showNotif, notifications])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages, isChatOpen])

  useEffect(() => { fetch('/api/telegram?offset=-1').then(r => r.json()).then(d => { if (d.ok && d.result.length) setLastUpdateId(d.result[0].update_id + 1) }).catch(() => { }) }, [])
  useEffect(() => {
    if (!isChatOpen) return
    const id = setInterval(async () => {
      try {
        const d = await (await fetch(`/api/telegram?offset=${lastUpdateId}`)).json()
        if (d.ok && d.result.length) { let lid = lastUpdateId; const msgs = []; d.result.forEach(u => { lid = u.update_id + 1; if (u.message?.text && !u.message.from.is_bot) msgs.push({ sender: 'cs', text: u.message.text }) }); if (msgs.length) setChatMessages(p => [...p, ...msgs]); setLastUpdateId(lid) }
      } catch (e) { }
    }, 3000)
    return () => clearInterval(id)
  }, [isChatOpen, lastUpdateId])

  useEffect(() => {
    if (!showReceipt || !receiptCanvasRef.current) return
    const cv = receiptCanvasRef.current; const ctx = cv.getContext('2d')
    let w = cv.width = window.innerWidth; let h = cv.height = window.innerHeight
    const cols = ['#22c55e', '#3b82f6', '#eab308', '#ec4899', '#fff']
    const conf = Array.from({ length: 180 }, () => ({ x: Math.random() * w, y: Math.random() * h - h, r: Math.random() * 6 + 2, dx: Math.random() * 4 - 2, dy: Math.random() * 5 + 2, color: cols[Math.floor(Math.random() * 5)], tilt: Math.floor(Math.random() * 10) - 10, tai: (Math.random() * .07) + .05, ta: 0 }))
    const run = () => { ctx.clearRect(0, 0, w, h); conf.forEach(c => { c.ta += c.tai; c.y += (Math.cos(c.ta) + 1 + c.r / 2) / 2; c.x += Math.sin(c.ta) * 2; ctx.beginPath(); ctx.lineWidth = c.r; ctx.strokeStyle = c.color; ctx.moveTo(c.x + c.tilt + c.r, c.y); ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r); ctx.stroke(); if (c.y > h) { c.y = -10; c.x = Math.random() * w } }); requestAnimationFrame(run) }
    run()
  }, [showReceipt])

  const fmt = s => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const safeLink = (url) => url && url !== '#' && url !== '' ? url : null

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
    if (cart.length > 0) { if (window.confirm('Yakin mau batal checkout? Promo VinzSky-shopID masih aktif!')) { setShowCheckout(false); const orig = allProducts.find(p => p.id === cart[0].id) || cart[0]; setSelectedProduct(orig); addNotif('Checkout ditunda.') } }
    else setShowCheckout(false)
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
    playPop(); setCart(c => [...c, item]); setSelectedProduct(null)
    if (type === 'cart') addNotif(`${product.name} masuk keranjang!`)
    else setShowCheckout(true)
  }

  const removeFromCart = i => { const nc = [...cart]; const rm = nc.splice(i, 1)[0]; setCart(nc); if (!nc.length) setShowCheckout(false); addNotif(`${rm.name} dibatalin 🥺`) }
  const clearCart = () => { setCart([]); setShowCheckout(false); setBuktiBayar(null); addNotif('Keranjang dikosongkan.') }

  const eksekusiPembayaran = async () => {
    if (!customerName || !customerWA || !customerEmail) return alert('Lengkapi Nama, WA, dan Email dulu Bosku!')
    const total = cart.reduce((s, i) => s + i.finalPrice, 0)
    if (total === 0) { setIsSending(true); await prosesPesananLokal('TRIAL AKTIF'); setIsSending(false); return }
    if (payMethod === 'paypal') {
      if (!buktiBayar) return alert('Upload bukti bayar PayPal dulu!')
      setIsSending(true)
      const hwid = '744BC690E35B'; const items = cart.map(i => `- ${i.name} (${i.durationLabel})`).join('\n')
      const msg = `💸 *ORDER BARU (PAYPAL)*\n👤 ${customerName}\n📱 ${customerWA}\n📧 ${customerEmail}\n💻 ${hwid}\n💰 Rp ${total.toLocaleString()}\n\n${items}`
      const fd = new FormData(); fd.append('caption', msg); fd.append('photo', buktiBayar); fd.append('parse_mode', 'Markdown')
      try { await fetch('/api/telegram', { method: 'POST', body: fd }) } catch (e) { }
      await prosesPesananLokal('MENUNGGU CEK ADMIN PAYPAL'); setIsSending(false); return
    }
    setIsSending(true); const oid = 'TRX-' + Date.now()
    try {
      const res = await fetch('/api/midtrans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: oid, gross_amount: total, customer_details: { first_name: customerName, phone: customerWA, email: customerEmail } }) })
      const data = await res.json()
      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: async r => { await prosesPesananLokal(`LUNAS (MIDTRANS - ${r.payment_type})`, null, oid); setIsSending(false) },
          onPending: () => { alert('Selesaikan pembayaran.'); setIsSending(false) },
          onError: () => { alert('Pembayaran Gagal!'); setIsSending(false) },
          onClose: () => { alert('Pembayaran belum selesai 🥺'); setIsSending(false) },
        })
      } else { alert('Gagal konek Midtrans!'); setIsSending(false) }
    } catch (e) { alert('Gagal menghubungi server.'); setIsSending(false) }
  }

  const prosesPesananLokal = async (status, _file = null, tid = null) => {
    const hwid = '744BC690E35B'; const total = cart.reduce((s, i) => s + i.finalPrice, 0)
    const trxId = tid || 'TRX-' + Date.now()
    if (status.includes('LUNAS') || status === 'TRIAL AKTIF') {
      const items = cart.map(i => `- ${i.name} (${i.durationLabel})`).join('\n')
      const msg = `✅ *PEMBAYARAN SUKSES*\n💳 ${status}\n👤 ${customerName}\n📱 ${customerWA}\n📧 ${customerEmail}\n💻 ${hwid}\n💰 Rp ${total.toLocaleString()}\n\n${items}`
      try { await fetch('/api/telegram', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: msg, parse_mode: 'Markdown' }) }) } catch (e) { }
    }
    const hwidItems = cart.map(c => ({ productName: c.name, duration: c.durationLabel, keyStatus: c.isLifetime ? 'LIFETIME' : 'Menunggu Key WA', isSuccess: !!c.isLifetime, ...c }))
    const trx = { id: trxId, date: new Date().toLocaleString(), total, masterHwid: hwid, customerName, customerWA, customerEmail, hwidItems }
    const upd = [trx, ...historyData]; setHistoryData(upd); localStorage.setItem('vinzsky_history', JSON.stringify(upd))
    await supabase.from('orders').insert([{
      customer_name: customerName, customer_wa: customerWA, customer_email: customerEmail,
      master_hwid: hwid, total_price: total, items: cart, created_at: new Date().toISOString(),
      order_status: status.includes('LUNAS') || status === 'TRIAL AKTIF' ? 'SUCCESS' : 'PENDING',
      buyer_name: authUser?.user_metadata?.full_name || customerName,
      buyer_email: authUser?.email || customerEmail,
      buyer_avatar: authUser?.user_metadata?.avatar_url || null,
    }])
    const key = 'VINZ-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    let exp = new Date()
    if (cart[0].durationCode === '1H') exp.setHours(exp.getHours() + 1)
    else if (cart[0].durationCode === '7D') exp.setDate(exp.getDate() + 7)
    else if (cart[0].durationCode === '14D') exp.setDate(exp.getDate() + 14)
    else if (cart[0].durationCode === '30D') exp.setDate(exp.getDate() + 30)
    else exp.setFullYear(exp.getFullYear() + 100)
    await supabase.from('licenses').insert([{ license_key: key, master_hwid: hwid, tier: cart[0].durationCode, expires_at: exp.toISOString(), status: status.includes('LUNAS') || status === 'TRIAL AKTIF' ? 'ACTIVE' : 'PENDING' }])
    setIsVipMember(true); setVipTierInfo(DURATIONS.find(d => d.code === cart[0].durationCode) || DURATIONS[3])
    setCart([]); setShowCheckout(false); setBuktiBayar(null); setCustomerName(''); setCustomerWA(''); setCustomerEmail('')
    setShowReceipt(trx); playKaChing()
  }

  const handleKlaimKey = (tid, idx) => {
    const key = window.prompt('Masukkan License Key dari Admin WhatsApp:')
    if (key?.trim()) {
      const nd = [...historyData]; const ti = nd.findIndex(t => t.id === tid)
      if (ti !== -1) { nd[ti].hwidItems[idx].keyStatus = key; nd[ti].hwidItems[idx].isSuccess = true; setHistoryData(nd); localStorage.setItem('vinzsky_history', JSON.stringify(nd)); alert('🎉 License Key Aktif!'); setActiveMenu(null); setReviewData({ trxId: tid, productName: nd[ti].hwidItems[idx].productName, customerName: nd[ti].customerName }) }
    }
  }

  const submitReview = async () => {
    if (!reviewText.trim()) return alert('Tulis dulu ulasannya Bosku!')
    setIsSending(true)
    const rev = { name: reviewData.customerName || 'Guest', product: reviewData.productName || 'AI', rating, review_text: reviewText }
    try {
      await fetch('/api/telegram', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: `🌟 *REVIEW*\n${rev.name}\n${rev.product}\n⭐${rev.rating}/5\n"${rev.review_text}"`, parse_mode: 'Markdown' }) })
      await supabase.from('reviews').insert([{
        ...rev,
        buyer_avatar: authUser?.user_metadata?.avatar_url || null,
        buyer_email: authUser?.email || null,
        tier_code: isVipMember && vipTierInfo ? vipTierInfo.code : '7D',
      }])
      setPublicReviews(p => [rev, ...p]); addNotif('Review berhasil dipublikasi!'); setReviewData(null); setReviewText(''); setRating(5)
    } catch (e) { alert('Gagal kirim review.') }
    setIsSending(false)
  }

  const handleSendChat = async e => {
    e.preventDefault(); if (!chatInput.trim()) return
    const m = { sender: 'user', text: chatInput }; setChatMessages(p => [...p, m]); setChatInput('')
    try { await fetch('/api/telegram', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: `💬 *LIVE CHAT*\n"${m.text}"`, parse_mode: 'Markdown' }) }) } catch (e) { }
  }

  const filtered = allProducts.filter(p => { const s = (searchQuery || '').toLowerCase(); return (p.name || '').toLowerCase().includes(s) || (p.category || '').toLowerCase().includes(s) })

  // Fungsi Render Avatar buat Notifikasi
  const renderAvatar = (name, url) => {
    if (url) return <img src={url} className="w-12 h-12 rounded-full border-2 border-red-600 shadow-[0_0_15px_rgba(239,68,68,0.8)] object-cover flex-shrink-0" alt="avatar" />
    return <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-white bg-gradient-to-br from-red-700 to-black border-2 border-red-600 shadow-[0_0_15px_rgba(239,68,68,0.8)] flex-shrink-0">{(name || 'G')[0].toUpperCase()}</div>
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans text-white" style={{ background: 'linear-gradient(135deg, #000008 0%, #050010 30%, #080018 60%, #030010 100%)' }}>
      <GS />

      {/* 🌌 GALAXY BIMA SAKTI FULL CANVAS + VIDEO 🌌 */}
      <GalaxyCanvas />
      <div className="sstar" /><div className="sstar" /><div className="sstar" />
      <div className="sstar" /><div className="sstar" /><div className="sstar" />
      <div className="neb neb1" /><div className="neb neb2" /><div className="neb neb3" /><div className="neb neb4" />
      <video autoPlay loop muted playsInline className="fixed inset-0 h-full w-full object-cover z-0 opacity-15 scale-105 animate-slowGalaxy pointer-events-none">
        <source src="/galaxy_bg.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,20,0.5) 0%, rgba(5,0,20,0.2) 40%, rgba(5,0,20,0.2) 60%, rgba(0,0,20,0.5) 100%)' }}></div>

      {/* 🔥 KOTAK NOTIFIKASI FOMO (POJOK KIRI ATAS BAWAH NAVBAR) 🔥 */}
      {!isAnyModalOpen && activeFomo && (
        <div className={`fixed z-[95] w-[320px] md:w-[360px] ${fomoLeaving ? 'fomo-slide-out' : 'fomo-slide-in'}`} style={{ top: '85px', left: '16px' }}>
          <div className="relative rounded-2xl p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(20,0,0,0.95), rgba(0,0,0,0.98))', backdropFilter: 'blur(24px)', border: '1px solid rgba(239,68,68,0.5)', boxShadow: '0 0 30px rgba(220,38,38,0.4), inset 0 0 20px rgba(220,38,38,0.2)' }}>
            {/* Efek Garis Menyala Atas */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #ef4444, #b91c1c, transparent)' }} />

            <div className="flex items-center gap-4 relative z-10">
              {renderAvatar(activeFomo.name, activeFomo.avatar)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">{activeFomo.title}</span>
                  {activeFomo.type === 'purchase' && <ShoppingCart size={12} className="text-red-400" />}
                  {activeFomo.type === 'review' && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                  {activeFomo.type === 'activation' && <Zap size={12} className="text-blue-400 fill-blue-400" />}
                </div>
                <p className="text-sm font-black text-white truncate drop-shadow-md">{activeFomo.name}</p>
                <p className="text-[11px] text-gray-300 font-bold truncate mt-0.5">{activeFomo.desc}</p>
                <div className="mt-2 flex items-center gap-1.5 opacity-80">
                  <Clock size={10} className="text-red-500" />
                  <p className="text-[9px] text-red-300 font-mono tracking-wider">{activeFomo.time}</p>
                </div>
              </div>
            </div>

            {/* Animasi Radar Pulse di Belakang */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-red-600/10 blur-xl animate-pulse pointer-events-none" />
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
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(239,68,68,.9),rgba(185,28,28,.7),transparent)' }} />
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/15 hover:scale-110 ninja-btn-hover" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)' }}><X size={15} /></button>
            <div className="p-8 text-center">
              {authUser ? (
                <div>
                  <div className="relative mx-auto mb-5 w-24 h-24">
                    <div className="absolute inset-0 rounded-full avatar-glow" style={{ borderRadius: '50%', boxShadow: '0 0 30px rgba(239,68,68,0.5)' }} />
                    {authUser.user_metadata?.avatar_url
                      ? <img src={authUser.user_metadata.avatar_url} alt="avatar" className="relative w-24 h-24 rounded-full object-cover" style={{ border: '2.5px solid rgba(239,68,68,.8)', boxShadow: '0 0 20px rgba(239,68,68,.6)' }} />
                      : <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black mx-auto" style={{ background: 'linear-gradient(135deg,#b91c1c,#000000)', border: '2.5px solid rgba(239,68,68,.8)', boxShadow: '0 0 20px rgba(239,68,68,.6)' }}>{(authUser.user_metadata?.full_name || authUser.email || 'U')[0].toUpperCase()}</div>
                    }
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center" style={{ border: '2px solid rgba(0,0,0,1)', boxShadow: '0 0 10px #22c55e' }}><div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" /></div>
                  </div>
                  <h2 className="text-xl font-black text-white mb-0.5">{authUser.user_metadata?.full_name || 'Member VinzSky-shopID'}</h2>
                  <p className="text-xs text-gray-400 mb-2">{authUser.email}</p>
                  <div className="flex flex-col items-center gap-3 mb-6">
                    {isAdminUser(authUser) ? (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.4)', boxShadow: '0 0 12px rgba(239,68,68,.3)' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">⚡ ADMIN</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.3)' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">MEMBER AKTIF</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 mb-6">
                    {(isAdminUser(authUser) ? [
                      { icon: <ShieldCheck size={20} />, label: 'Admin Portal', sub: 'Dashboard & kelola toko', action: () => { window.open('/admin', '_blank'); setShowAuthModal(false) } },
                      { icon: <Download size={20} />, label: 'Download Software', sub: 'Pusat unduhan tools & panduan', action: () => { window.open('https://www.vinzsky.shop/download', '_blank'); setShowAuthModal(false) } },
                      { icon: <Key size={20} />, label: 'Data Lisensi HWID', sub: 'Cek license key aktif Anda', action: () => { setActiveMenu('hwid'); setShowAuthModal(false) } },
                      { icon: <History size={20} />, label: 'G-Drive & Riwayat', sub: 'Download software & invoice', action: () => { setActiveMenu('history'); setShowAuthModal(false) } }
                    ] : [
                      { icon: <Download size={20} />, label: 'Download Software', sub: 'Pusat unduhan tools & panduan', action: () => { window.open('https://www.vinzsky.shop/download', '_blank'); setShowAuthModal(false) } },
                      { icon: <Key size={20} />, label: 'Data Lisensi HWID', sub: 'Cek license key aktif Anda', action: () => { setActiveMenu('hwid'); setShowAuthModal(false) } },
                      { icon: <ShoppingCart size={20} />, label: 'Status Pesanan', sub: 'Cek progress & status pembelian', action: () => { setShowOrderStatus(true); setShowAuthModal(false) } },
                      { icon: <History size={20} />, label: 'G-Drive & Riwayat', sub: 'Download software & invoice', action: () => { setActiveMenu('history'); setShowAuthModal(false) } }
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
                  <div className="relative mx-auto mb-5 w-28 h-28">
                    <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg,rgba(220,38,38,.5),rgba(0,0,0,.4))', filter: 'blur(18px)', animation: 'visitorPulse 2s ease infinite' }} />
                    <div className="relative w-28 h-28 rounded-2xl flex flex-col items-center justify-center mx-auto overflow-hidden" style={{ background: 'linear-gradient(135deg,#270000,#000000)', border: '1px solid rgba(239,68,68,.5)', boxShadow: '0 0 30px rgba(220,38,38,.4), inset 0 1px 0 rgba(255,255,255,.15)' }}>
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(220,38,38,.2),rgba(0,0,0,.2))' }} />
                      <div className="relative z-10 flex flex-col items-center">
                        <span className="font-black text-white leading-none" style={{ fontSize: 26, letterSpacing: -1, textShadow: '0 0 20px rgba(239,68,68,.8)' }}>VinzSky</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="h-px flex-1 w-8" style={{ background: 'linear-gradient(90deg,transparent,rgba(239,68,68,.6))' }} />
                          <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: '#fca5a5' }}>shop</span>
                          <span className="text-[9px] font-black tracking-widest" style={{ color: '#ef4444' }}>ID</span>
                          <div className="h-px flex-1 w-8" style={{ background: 'linear-gradient(90deg,rgba(239,68,68,.6),transparent)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Selamat Datang!</h2>
                  <p className="text-xs text-red-400 mb-1 font-black uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">VinzSky-shopID</p>
                  <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">Login untuk akses riwayat pembelian,<br />lisensi, dan G-Drive Anda</p>
                  <button onClick={handleGoogleLogin} disabled={authLoading} className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all mb-3 disabled:opacity-60 ninja-btn-hover" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', boxShadow: '0 4px 20px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.1)' }}>
                    {authLoading ? <Clock className="animate-spin" size={18} /> : (
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    )}
                    {authLoading ? 'Menghubungkan ke Google...' : 'Lanjutkan dengan Google'}
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,.08)' }} />
                    <span className="text-[10px] text-gray-600 font-bold">atau</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,.08)' }} />
                  </div>
                  <button onClick={() => setShowAuthModal(false)} className="w-full py-3 rounded-xl text-[11px] font-bold transition-all ninja-menu-hover" style={{ color: 'rgba(255,255,255,.25)', border: '1px solid rgba(255,255,255,.07)' }}>👤 Lanjut sebagai Guest (checkout tanpa login)</button>
                  <p className="text-[9px] text-gray-700 mt-5 leading-relaxed px-2">Login menggunakan akun Google Anda yang sudah ada.<br />Data aman & tidak dibagikan ke pihak ketiga.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showExitPopup && (
        <div className="m-overlay" style={{ zIndex: 99998 }}>
          <div className="m-box max-w-lg text-center overflow-hidden exit-pop" style={{ borderRadius: '3rem', background: 'rgba(15,0,0,.95)', backdropFilter: 'blur(32px)', border: '1px solid rgba(239,68,68,.5)', boxShadow: '0 0 80px rgba(220,38,38,.5)' }}>
            <div className="mscroll p-10">
              <button onClick={() => { setShowExitPopup(false); setSelectedProduct(null) }} className="absolute top-6 right-6 rounded-full p-2 transition-all hover:bg-white/10 ninja-btn-hover" style={{ background: 'rgba(255,255,255,.07)' }}><X size={18} /></button>
              <div className="relative mx-auto mb-6 w-20 h-20"><div className="absolute inset-0 rounded-full" style={{ background: 'rgba(239,68,68,.2)', boxShadow: '0 0 30px rgba(239,68,68,.6)', animation: 'visitorPulse 1s ease infinite' }} /><div className="absolute inset-0 flex items-center justify-center"><Percent size={44} className="text-red-500" /></div></div>
              <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">TUNGGU BOSKU!</h2>
              <p className="text-sm text-gray-300 mb-3 font-bold">Jangan pergi dulu! Ambil</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6 animate-pulse">EKSTRA DISKON 10%</p>
              <button onClick={() => { setHasExitPromo(true); setShowExitPopup(false); playPop() }} className="w-full py-5 rounded-[1.5rem] font-black text-xl transition-all ninja-btn-hover" style={{ background: 'linear-gradient(135deg,#991b1b,#ef4444)', boxShadow: '0 10px 30px rgba(239,68,68,.55)' }}>KLAIM DISKON SEKARANG 🎁</button>
              <button onClick={() => { setShowExitPopup(false); setSelectedProduct(null) }} className="mt-4 text-[10px] text-gray-600 font-bold uppercase block mx-auto transition-colors ninja-menu-hover">Tidak, saya tidak mau hemat</button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full z-[80] glass-nav">
        <div className="py-1.5 px-4 text-center flex justify-center items-center gap-2" style={{ background: 'linear-gradient(90deg,#7f1d1d,#000000,#7f1d1d)', borderBottom: '1px solid rgba(239,68,68,.4)' }}>
          <Flame size={14} className="text-red-500" style={{ filter: 'drop-shadow(0 0 6px #ef4444)', animation: 'fireFlicker .7s ease infinite' }} />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-red-100">FLASH SALE BERAKHIR DALAM:</span>
          <span className="bg-black/80 px-2 py-0.5 rounded text-[10px] md:text-xs font-mono font-black text-red-400 border border-red-500/50" style={{ textShadow: '0 0 10px #ef4444' }}>{fmt(timeLeft)}</span>
        </div>
        <div className="px-4 md:px-6 py-3 flex justify-between items-center gap-3">
          <div className="text-xl md:text-2xl font-black cursor-pointer tracking-tighter hover:scale-105 transition-transform flex-shrink-0 text-transparent bg-clip-text bg-gradient-to-r from-white to-red-300" onClick={() => window.location.reload()}>VinzSky<span className="text-red-500" style={{ textShadow: '0 0 10px rgba(239,68,68,.8)' }}>-shopID</span></div>
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
                <span className="text-[10px] font-black truncate max-w-[80px]" style={{ color: '#fca5a5' }}>
                  {isAdminUser(authUser) ? 'ADMIN' : authUser.user_metadata?.full_name?.split(' ')[0] || authUser.email?.split('@')[0]}
                </span>
              </> : <><LogIn size={14} className="text-red-400" /><span className="text-[10px] font-black uppercase tracking-widest text-red-200">Login</span></>}
            </button>
            <div className="relative cursor-pointer transition-all ninja-menu-hover p-1 rounded-full" onClick={() => { setShowNotif(!showNotif); setUnreadCount(0) }}>
              <Bell size={22} className={unreadCount > 0 ? 'animate-bounce text-red-500 ninja-icon' : 'ninja-icon text-gray-300'} />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-[9px] font-bold text-red-600 w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.8)]">{unreadCount}</span>}
            </div>
            <div className="relative cursor-pointer transition-all ninja-menu-hover p-1 rounded-full" onClick={() => cart.length ? setShowCheckout(true) : alert('Keranjang kosong!')}>
              <ShoppingCart size={22} className={cart.length ? 'text-red-500 ninja-icon' : 'ninja-icon text-gray-300'} />
              <span className={`absolute -top-1.5 -right-1.5 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center border border-[#000] ${cart.length ? 'bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-gray-600'}`}>{cart.length}</span>
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
                  <button onClick={() => { setActiveMenu('hwid'); setIsMobileMenuOpen(false) }} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold text-gray-300 transition-all ninja-menu-hover">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)' }}><Key size={15} className="text-red-500 ninja-icon" /></div>
                    <div><p className="text-[12px] font-black">Data Lisensi HWID</p><p className="text-[9px] text-gray-500">Cek license key aktif</p></div>
                  </button>
                  <button onClick={() => { setActiveMenu('history'); setIsMobileMenuOpen(false) }} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold text-gray-300 transition-all ninja-menu-hover">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)' }}><History size={15} className="text-red-500 ninja-icon" /></div>
                    <div><p className="text-[12px] font-black">G-Drive & Riwayat</p><p className="text-[9px] text-gray-500">Riwayat file zip & invoice</p></div>
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

      {showNotif && (
        <div className="fixed top-36 right-4 md:right-6 z-[9999] w-72 md:w-80 rounded-[2rem] overflow-hidden" style={{ background: 'linear-gradient(135deg,rgba(20,0,0,.98),rgba(0,0,0,1))', backdropFilter: 'blur(24px)', border: '1px solid rgba(239,68,68,.5)', boxShadow: '0 0 30px rgba(220,38,38,0.4)' }}>
          <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.1)' }}>
            <span className="flex items-center gap-2 text-red-400 font-black text-[10px] uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]"><Bell size={12} />System Logs VinzSky</span>
            <X size={14} className="cursor-pointer text-gray-400 hover:text-white ninja-menu-hover rounded-full p-1" onClick={() => setShowNotif(false)} />
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
        {/* HERO BANNER */}
        <div className="reveal opacity-0 translate-y-20 mb-16 rounded-[2rem] overflow-hidden relative shadow-[0_0_50px_rgba(220,38,38,.4)]" style={{ height: '16rem', border: '1px solid rgba(239,68,68,.35)', background: 'rgba(10,0,20,0.2)', backdropFilter: 'blur(4px)' }}>
          <Swiper modules={[Autoplay, EffectFade]} effect="fade" autoplay={{ delay: 3500, disableOnInteraction: false }} speed={1000} loop className="h-full w-full">
            {[{ src: '/produk1.jpg', tag: 'UPDATE V2.0', tagC: 'bg-red-700 shadow-[0_0_15px_#b91c1c]', title: 'UPSCALE ', hi: 'VIDEO 4K', hiC: 'text-red-500' }, { src: '/produk2.jpg', tag: 'AI POWERED', tagC: 'bg-red-800 shadow-[0_0_15px_#991b1b]', title: 'ULTRA HIGH ', hi: 'PHOTO', hiC: 'text-red-600' }, { src: '/produk3.jpg', tag: 'ADOBE STOCK', tagC: 'bg-black border border-red-500 shadow-[0_0_15px_#ef4444]', title: 'TOOLS ', hi: 'PREMIUM', hiC: 'text-red-400' }].map((sl, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full bg-black/80 backdrop-blur-sm">
                  <img src={sl.src} onError={e => { e.target.onerror = null; e.target.src = '/produk1.jpg' }} className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(15,0,0,1) 0%,rgba(15,0,0,.6) 60%,transparent 100%)' }} />
                  <div className="absolute bottom-10 left-10 z-20">
                    <span className={`${sl.tagC} text-white text-[10px] font-black px-4 py-1.5 rounded-full mb-3 inline-block tracking-widest uppercase`}>{sl.tag}</span>
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tight text-white drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">{sl.title}<span className={`${sl.hiC} drop-shadow-[0_0_20px_currentColor]`}>{sl.hi}</span></h2>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h2 className="text-2xl font-black flex items-center gap-3 italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]"><Star className="text-red-500 fill-red-500" style={{ filter: 'drop-shadow(0 0 10px #ef4444)' }} />Exclusive VinzSky-shopID</h2>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full" style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.4)', boxShadow: '0 0 20px rgba(220,38,38,.3)' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" style={{ boxShadow: '0 0 10px #ef4444' }} />
            <Eye size={14} className="text-red-500" />
            <span className="text-sm font-black text-red-500">{visitorCount}</span>
            <span className="text-[10px] text-red-300 font-black uppercase tracking-widest">Pengguna Aktif</span>
          </div>
        </div>

        {isLoadingDB ? (
          <div className="w-full text-center py-20 flex flex-col items-center"><Clock className="text-red-600 animate-spin mb-4" size={48} /><p className="text-red-500 font-black animate-pulse tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">MENYIAPKAN BRANKAS VinzSky-shopID...</p></div>
        ) : dbError ? (
          <div className="w-full rounded-3xl p-8 text-center mb-20" style={{ background: 'rgba(120,0,0,.40)', border: '1px solid rgba(220,38,38,.60)' }}><p className="text-red-400 font-black text-xl mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">GAGAL TERHUBUNG KE DATABASE!</p><p className="text-red-300 text-sm font-bold">{dbError}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {filtered.length === 0 ? <div className="w-full text-center py-20 col-span-full"><p className="text-red-500 italic font-bold">Belum ada produk.</p></div> : filtered.map(p => {
              const fp = calcPrice(p.price, p); const pvc = viewCounts[p.id] || 0
              return (
                <div key={p.id} className="reveal opacity-0 translate-y-20">
                  {/* INI KARTU PRODUK DENGAN NINJA AURA HOVER */}
                  <div onClick={() => { setSelectedProduct(p); setSelectedDuration(DURATIONS[3]); trackProductView(p.id) }} className="group relative rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl flex flex-col h-full ninja-card-hover" style={{ background: 'linear-gradient(135deg, rgba(20,0,10,0.35), rgba(5,0,15,0.25))', backdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(239,68,68,.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>

                    <div className="overflow-hidden relative bg-black" style={{ height: '14rem', borderBottom: '1px solid rgba(239,68,68,0.4)' }}>
                      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top,rgba(15,0,0,1) 0%,rgba(15,0,0,.2) 60%,transparent 100%)' }} />
                      {p.videoUrl && p.videoUrl !== '' && p.videoUrl !== '#'
                        ? <video src={p.videoUrl} autoPlay loop muted playsInline preload="metadata" className="w-full h-full object-cover opacity-60 pointer-events-none transition-transform duration-700 group-hover:scale-110 mix-blend-luminosity group-hover:mix-blend-normal" style={{ willChange: 'transform', transform: 'translateZ(0)' }} onCanPlay={e => e.target.play().catch(() => { })} onError={e => { const parent = e.target.parentNode; const img = document.createElement('img'); img.src = p.image || '/produk1.jpg'; img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;opacity:.5;mix-blend-mode:luminosity;transition:all 0.7s;'; parent.appendChild(img); e.target.style.display = 'none'; }} />
                        : <img src={p.image} onError={e => { e.target.onerror = null; e.target.src = '/produk1.jpg' }} className="w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 mix-blend-luminosity group-hover:mix-blend-normal" />
                      }
                      <span className="absolute top-4 right-4 z-20 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,.80)', backdropFilter: 'blur(12px)', border: '1px solid rgba(239,68,68,.6)', color: '#fca5a5', boxShadow: '0 0 15px rgba(239,68,68,0.8)' }}><Crown size={12} />VIP Engine</span>
                      {p.isFlashSale && <span className="absolute top-4 left-4 z-20 bg-red-700 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase animate-pulse shadow-lg" style={{ boxShadow: '0 0 20px rgba(220,38,38,1)', border: '1px solid #f87171' }}>⚡ Flash Sale</span>}
                      {pvc > 0 && <span className="absolute bottom-4 left-4 z-20 flex items-center gap-1 text-[9px] font-black px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(239,68,68,.4)' }}><Eye size={12} className="text-red-500" /><span className="text-red-400">{pvc} Views</span></span>}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between z-10">
                      <div>
                        <h3 className="text-xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all group-hover:from-white group-hover:to-red-400">{p.name}</h3>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <p className="font-black text-2xl fire-price text-red-500">Rp {fp.toLocaleString()}</p>
                          {(isVipMember || hasExitPromo || p.isFlashSale || (p.discountAktif && p.discountPersen > 0)) && <p className="text-xs text-red-900/80 font-bold line-through">Rp {(p.originalPrice || p.price).toLocaleString()}</p>}
                        </div>
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {isVipMember && !hasExitPromo && <span className="text-[9px] px-2.5 py-1 rounded-full font-black flex items-center gap-1 shadow-inner" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.5)', color: '#fca5a5', textShadow: '0 0 5px #ef4444' }}><Crown size={10} />VIP -{p.discountVip || 5}%</span>}
                          {hasExitPromo && <span className="text-[9px] px-2.5 py-1 rounded-full font-black shadow-inner" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.5)', color: '#fca5a5', textShadow: '0 0 5px #ef4444' }}>EXIT -{p.discountExit || 10}%</span>}
                          {p.discountAktif && p.discountLabel && <span className="text-[9px] px-2.5 py-1 rounded-full font-black shadow-inner" style={{ background: 'rgba(220,38,38,.3)', border: '1px solid rgba(220,38,38,.6)', color: '#fff', textShadow: '0 0 8px #dc2626' }}>{p.discountLabel}</span>}
                        </div>
                      </div>
                      <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.1)]">
                        <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                          <span className="flex items-center gap-1 text-red-500" style={{ textShadow: '0 0 8px rgba(239,68,68,0.8)' }}><Flame size={12} style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }} />High Demand</span>
                          <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">SISA {p.stock} LISENSI</span>
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
                <div className="p-8 rounded-[2rem] h-full flex flex-col shadow-2xl ninja-card-hover" style={{ background: 'linear-gradient(135deg, rgba(15,0,10,0.30), rgba(5,0,15,0.20))', backdropFilter: 'blur(20px) saturate(200%)', border: '1px solid rgba(239,68,68,.35)', boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={18} className={j < (rev.rating || 5) ? 'text-yellow-500 fill-yellow-500' : 'text-red-900'} style={j < (rev.rating || 5) ? { filter: 'drop-shadow(0 0 8px #eab308)' } : {}} />)}</div>
                  <p className="text-sm text-gray-200 italic mb-6 leading-relaxed font-bold">"{rev.review_text || rev.text || '...'}"</p>
                  <div className="flex justify-between items-end mt-auto pt-4 border-t border-red-500/20">
                    <div className="flex items-center gap-3">
                      {rev.buyer_avatar
                        ? <img src={rev.buyer_avatar} alt="av" className="w-10 h-10 rounded-full object-cover flex-shrink-0" style={{ border: '2px solid rgba(239,68,68,.8)', boxShadow: '0 0 15px rgba(239,68,68,.5)' }} />
                        : <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: 'linear-gradient(135deg,#991b1b,#000000)', border: '2px solid rgba(239,68,68,.8)', boxShadow: '0 0 15px rgba(239,68,68,.5)' }}>
                          {(rev.name || 'G')[0].toUpperCase()}
                        </div>
                      }
                      <div>
                        <p className="font-black text-sm text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{rev.name || 'Member VinzSky-shopID'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {(() => {
                            const t = DURATIONS.find(d => d.code === (rev.tier_code || '7D')) || DURATIONS[1]; return (
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: t.diamondBg || 'rgba(239,68,68,.15)', border: `1px solid ${t.diamondColor || '#ef4444'}50` }}>
                                <DiamondIcon color={t.diamondColor || '#ef4444'} glow={t.diamondGlow || 'rgba(239,68,68,.6)'} size={10} />
                                <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: t.diamondColor || '#ef4444' }}>{t.tierName}</span>
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mb-1" style={{ filter: 'drop-shadow(0 0 8px #22c55e)' }} />
                      <span className="text-[8px] text-green-400 font-bold uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-16 text-center mt-10" style={{ borderTop: '1px solid rgba(239,68,68,.3)', background: 'rgba(2,0,10,.50)', backdropFilter: 'blur(24px)' }}>
        <p className="text-[11px] text-red-500/60 tracking-[6px] uppercase font-black hover:text-red-400 transition-colors cursor-default drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">Tools By | VinzSky-shopID | software engineer | since 2026</p>
        <p className="text-[9px] text-red-700 mt-2 font-bold tracking-widest">NINJA AURA EDITION</p>
      </footer>

      {/* --- MODAL DETAIL PRODUK --- */}
      {selectedProduct && (
        <div className="m-overlay">
          <div className="m-box rounded-[3rem] shadow-[0_0_100px_rgba(220,38,38,.5)]" style={{ maxWidth: '1000px', background: 'rgba(15,0,0,.92)', backdropFilter: 'blur(32px) saturate(200%)', border: '1px solid rgba(239,68,68,.6)', display: 'flex', flexDirection: 'column' }}>
            <div className="absolute inset-0 z-[-1] rounded-[3rem] bg-gradient-to-br from-red-900/40 via-black to-black pointer-events-none"></div>
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden rounded-[3rem]">
              <div className="media-panel-fill flex-shrink-0 md:w-[48%] relative" style={{ minHeight: '220px', maxHeight: typeof window !== 'undefined' && window.innerWidth >= 768 ? '90vh' : '280px', borderRight: '1px solid rgba(239,68,68,0.3)' }}>
                {selectedProduct.videoUrl && selectedProduct.videoUrl !== '' && selectedProduct.videoUrl !== '#'
                  ? <video key={selectedProduct.videoUrl} src={selectedProduct.videoUrl} controls autoPlay playsInline loop preload="auto" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#000', transform: 'translateZ(0)' }} onLoadStart={e => { e.target.style.opacity = '.5' }} onCanPlay={e => { e.target.style.opacity = '1'; e.target.play().catch(() => { }) }} onError={e => { e.target.style.display = 'none'; const img = document.createElement('img'); img.src = selectedProduct.image || '/produk1.jpg'; img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;opacity:.7'; e.target.parentNode.appendChild(img) }} />
                  : <img src={selectedProduct.image} onError={e => { e.target.onerror = null; e.target.src = '/produk1.jpg' }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: .85 }} />
                }
                {selectedProduct.videoUrl && selectedProduct.videoUrl !== '' && selectedProduct.videoUrl !== '#' && (
                  <button onClick={() => setFullscreenVideo(selectedProduct.videoUrl)} className="absolute bottom-6 right-6 z-30 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest rounded-xl px-4 py-3 transition-all hover:scale-105 ninja-btn-hover" style={{ background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(239,68,68,.5)', boxShadow: '0 0 20px rgba(239,68,68,.8)' }}>
                    <Maximize2 size={16} />Full Screen
                  </button>
                )}
                <div className="absolute inset-y-0 right-0 w-16 pointer-events-none hidden md:block" style={{ background: 'linear-gradient(to right,transparent,rgba(15,0,0,.95))' }} />
                <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none md:hidden" style={{ background: 'linear-gradient(to top,rgba(15,0,0,1),transparent)' }} />
              </div>
              <div className="flex-1 mscroll p-6 md:p-10 flex flex-col relative" style={{ maxHeight: '90vh' }}>
                <button onClick={handleCloseProduct} className="absolute top-6 right-6 rounded-full p-2.5 z-50 transition-colors shadow-xl ninja-btn-hover" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.5)' }}><X size={20} /></button>
                <div className="flex items-center gap-3 mb-4 mt-2 md:mt-0 flex-wrap">
                  <span className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ background: 'rgba(239,68,68,.25)', color: 'white', border: '1px solid rgba(239,68,68,.8)' }}>AI Exclusive VinzSky-shopID</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-black animate-pulse bg-red-900/40 px-3 py-1.5 rounded-full border border-red-500/60" style={{ color: '#fca5a5', textShadow: '0 0 8px rgba(248,113,113,.8)' }}><Users size={14} />{(viewCounts[selectedProduct.id] || 0) + Math.floor(Math.random() * 5) + 8} Orang melihat ini</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-red-300 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">{selectedProduct.name}</h2>
                <div className="mb-4 p-4 rounded-2xl" style={{ background: 'rgba(0,0,0,.7)', border: '1px solid rgba(239,68,68,.3)', boxShadow: 'inset 0 0 20px rgba(220,38,38,.2)' }}>
                  <div className="flex justify-between text-[10px] font-black mb-2.5 uppercase tracking-widest">
                    <span className="flex items-center gap-1 text-red-500" style={{ textShadow: '0 0 10px rgba(239,68,68,.9)' }}><Flame size={14} style={{ filter: 'drop-shadow(0 0 5px #ef4444)' }} />Sangat Diminati</span>
                    <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">SISA {selectedProduct.stock} LISENSI</span>
                  </div>
                  <div className="w-full rounded-full h-3 overflow-hidden border border-red-900" style={{ background: 'rgba(0,0,0,1)' }}><div className="fire-bar h-full rounded-full" style={{ width: (selectedProduct.stock || 99) + '%' }} /></div>
                </div>
                <div className="mb-6 p-5 rounded-2xl shadow-inner" style={{ background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.2)' }}>
                  <p className="text-[11px] font-black text-red-400 uppercase tracking-widest mb-2.5 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">Deskripsi Produk VinzSky-shopID</p>
                  <p className="text-sm text-gray-200 leading-relaxed font-bold">{selectedProduct.desc}</p>
                </div>
                {selectedProduct.isLifetime ? (
                  <div className="p-4 rounded-2xl text-center mb-5" style={{ background: 'rgba(0,80,40,.30)', border: '2px solid rgba(34,197,94,.5)' }}><p className="text-green-400 font-black text-lg uppercase flex justify-center items-center gap-3 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]"><CheckCircle size={24} style={{ filter: 'drop-shadow(0 0 8px #4ade80)' }} />LISENSI LIFETIME UNLOCKED</p></div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {DURATIONS.map(d => (
                      <button key={d.code} onClick={() => setSelectedDuration(d)} className={`p-4 rounded-2xl text-xs font-black transition-all flex flex-col items-center gap-2 ${selectedDuration.code === d.code ? 'scale-105 border-2' : 'border ninja-btn-hover'}`}
                        style={selectedDuration.code === d.code ? { background: d.diamondBg, borderColor: d.diamondColor, boxShadow: `0 0 20px ${d.diamondGlow}`, color: d.diamondColor } : { background: 'rgba(0,0,0,.6)', borderColor: 'rgba(239,68,68,.2)', color: 'rgba(255,255,255,.5)' }}>
                        <DiamondIcon color={selectedDuration.code === d.code ? d.diamondColor : 'rgba(255,255,255,.3)'} glow={selectedDuration.code === d.code ? d.diamondGlow : 'transparent'} size={24} animate={selectedDuration.code === d.code} />
                        <span className="font-black tracking-widest uppercase">{d.tierName}</span>
                        <span className="text-[10px] opacity-80 uppercase">{d.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center mb-6 pt-5" style={{ borderTop: '1px solid rgba(239,68,68,.3)' }}>
                  <span className="text-sm font-black text-gray-300 uppercase tracking-widest drop-shadow-md">Harga Final:</span>
                  <div className="text-right">
                    {(isVipMember || hasExitPromo || selectedProduct.isFlashSale || (selectedProduct.discountAktif && selectedProduct.discountPersen > 0)) && <p className="text-sm text-red-800 line-through mb-1 font-bold">Rp {(selectedProduct.originalPrice || selectedProduct.price).toLocaleString()}</p>}
                    <span className={`text-3xl md:text-4xl font-black ${hasExitPromo ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 animate-pulse' : 'fire-price text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]'}`}>
                      Rp {(calcPrice(selectedProduct.price, selectedProduct) * selectedDuration.multiplier).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-auto">
                  <button onClick={() => handleProductAction(selectedProduct, selectedDuration, 'cart')} disabled={isCheckingTrial} className="btn-cart disabled:opacity-50 py-4 text-sm tracking-widest ninja-btn-hover" style={{ background: 'linear-gradient(135deg,rgba(234,179,8,.3),rgba(239,68,68,.3))', border: '1px solid #f59e0b', color: '#fde68a' }}>
                    {isCheckingTrial ? <Clock className="animate-spin" size={20} /> : <ShoppingCart size={20} />}<span className="font-black">Masuk Keranjang</span>
                  </button>
                  <button onClick={() => handleProductAction(selectedProduct, selectedDuration, 'buy')} disabled={isCheckingTrial} className="btn-buy disabled:opacity-50 py-4 text-sm tracking-widest uppercase ninja-btn-hover">{isCheckingTrial ? 'Memproses...' : 'Beli Sekarang'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CHECKOUT --- */}
      {showCheckout && (
        <div className="m-overlay">
          <div className="m-box w-full max-w-md rounded-[2.5rem]" style={{ background: 'rgba(15,0,0,.95)', backdropFilter: 'blur(32px) saturate(200%)', border: '1px solid rgba(239,68,68,.6)', boxShadow: '0 0 80px rgba(220,38,38,.4)' }}>
            <div className="flex justify-between items-center p-6 pb-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(239,68,68,.3)' }}>
              <h2 className="text-2xl font-black flex gap-3 items-center text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"><ShieldCheck size={28} />Checkout VinzSky</h2>
              <button onClick={handleCloseCheckout} className="rounded-full p-2.5 transition-colors shadow-lg ninja-btn-hover" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.5)' }}><X size={20} className="text-white" /></button>
            </div>
            <div className="mscroll p-6 pt-5" style={{ maxHeight: 'calc(92vh - 85px)' }}>
              <p className="text-xs text-red-300 italic mb-5 text-center font-bold tracking-wide">"Langkah terakhir menuju produktivitas tanpa batas. Selesaikan sekarang Bosku!"</p>
              {!authUser && (
                <div className="mb-5 p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] ninja-card-hover" onClick={() => setShowAuthModal(true)} style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.5)' }}>
                  <LogIn size={24} className="text-red-500 flex-shrink-0 drop-shadow-md" />
                  <div><p className="text-xs font-black text-red-300 uppercase tracking-wide">Login untuk checkout instan</p><p className="text-[10px] text-gray-400 mt-1">Email & nama otomatis terisi dari akun Google</p></div>
                </div>
              )}
              <div className="p-5 rounded-3xl mb-5 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]" style={{ background: 'rgba(0,0,0,.6)', border: '1px solid rgba(239,68,68,.3)' }}>
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between items-center mb-4 pb-4 rounded-xl transition-colors last:mb-0 last:pb-0 last:border-0" style={{ borderBottom: '1px solid rgba(239,68,68,.2)' }}>
                    <div className="flex-1 pr-3"><p className="text-sm text-white font-black truncate">{c.name}</p><p className={`text-[10px] font-black uppercase tracking-widest ${c.color} ${c.bg} border ${c.border} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mt-2`}><Crown size={10} />{c.tierName} - {c.durationLabel}</p></div>
                    <div className="flex items-center gap-4"><p className="text-base font-black text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">Rp {c.finalPrice.toLocaleString()}</p><button onClick={() => removeFromCart(i)} className="text-white transition-all p-1.5 bg-red-600 rounded-full ninja-btn-hover shadow-[0_0_10px_rgba(239,68,68,0.8)]"><X size={14} /></button></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-6 p-5 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg,rgba(239,68,68,.2),rgba(0,0,0,.6))', border: '1px solid rgba(239,68,68,.5)' }}>
                <span className="text-xs text-red-200 font-black uppercase tracking-widest">Total Tagihan</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">Rp {cart.reduce((s, i) => s + i.finalPrice, 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="space-y-4 mb-6">
                {[{ icon: <UserCircle size={18} />, ph: 'Nama Lengkap Anda', val: customerName, set: setCustomerName, type: 'text' }, { icon: <Phone size={18} />, ph: 'WhatsApp Aktif', val: customerWA, set: setCustomerWA, type: 'tel' }, { icon: <Mail size={18} />, ph: 'Email Aktif', val: customerEmail, set: setCustomerEmail, type: 'email' }].map((f, i) => (
                  <div key={i} className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none drop-shadow-md">{f.icon}</div><input placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} type={f.type} className="inp text-sm py-4 rounded-2xl border-red-500/30 bg-black/60 pl-12 text-white focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,.5)] placeholder-gray-500" /></div>
                ))}
              </div>
              {cart.reduce((s, i) => s + i.finalPrice, 0) > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {[{ key: 'midtrans', icon: <Landmark size={24} />, label: 'QRIS / VA / E-Wallet' }, { key: 'paypal', icon: <Wallet size={24} />, label: 'PayPal' }].map(pm => (
                      <button key={pm.key} onClick={() => setPayMethod(pm.key)} className={`font-black py-4 px-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest shadow-lg ${payMethod === pm.key ? 'bg-red-700 text-white border-2 border-red-500 scale-[1.03] shadow-[0_0_20px_rgba(239,68,68,.8)]' : 'text-red-200 border border-red-500/30 bg-black/60 ninja-btn-hover'}`}>{pm.icon}{pm.label}</button>
                    ))}
                  </div>
                  <div className="rounded-3xl p-6 mb-5 text-center shadow-inner" style={{ background: 'rgba(0,0,0,.6)', border: '1px solid rgba(239,68,68,.3)' }}>
                    {payMethod === 'midtrans' && <div className="flex flex-col items-center"><ShieldCheck size={48} className="text-emerald-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,.8)]" /><p className="text-[11px] text-white mb-2 font-black uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">Secure Auto-Payment</p><p className="text-sm text-gray-300 leading-relaxed font-bold">QRIS, Virtual Account, atau E-Wallet pilihan Anda.</p></div>}
                    {payMethod === 'paypal' && <div className="flex flex-col items-center"><Wallet size={48} className="text-blue-400 mb-4 drop-shadow-[0_0_15px_rgba(96,165,250,.6)]" /><p className="text-[11px] text-white mb-2 font-black uppercase tracking-widest">Send Payment To:</p><p className="text-xl font-black tracking-widest mb-5 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">@moh.bashory1992</p><a href={`https://paypal.me/mohbashory1992/${Math.ceil(cart.reduce((s, i) => s + i.finalPrice, 0) / 15500)}USD`} target="_blank" className="bg-[#0070ba] text-white text-sm font-black py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-lg ninja-btn-hover border border-[#003087]">Buka Aplikasi PayPal</a><p className="text-[9px] text-gray-500 mt-5 italic font-bold">*Screenshot bukti transfer setelah bayar</p></div>}
                  </div>
                  {payMethod === 'paypal' && <div className="mb-5 p-5 rounded-2xl group shadow-inner ninja-card-hover" style={{ background: 'rgba(0,0,0,.6)', border: '1px dashed rgba(239,68,68,.8)' }}><label htmlFor="file-upload" className="flex items-center justify-center cursor-pointer"><div className="flex items-center gap-3 text-sm text-red-500 group-hover:text-red-400 transition-colors font-black uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]"><Upload size={24} />{buktiBayar ? <span className="text-emerald-400 truncate max-w-[200px]">{buktiBayar.name}</span> : 'Upload Bukti Bayar'}</div></label><input id="file-upload" type="file" accept="image/*" className="hidden" onChange={e => setBuktiBayar(e.target.files[0])} /></div>}
                </>
              )}
              <button onClick={eksekusiPembayaran} disabled={isSending || cart.length === 0} className="w-full py-5 rounded-[1.5rem] font-black text-xl text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.03] uppercase tracking-widest shadow-2xl ninja-btn-hover" style={{ background: 'linear-gradient(135deg,#991b1b,#ef4444)', boxShadow: '0 10px 30px rgba(239,68,68,.6)' }}>
                {isSending ? <Clock className="animate-spin" size={24} /> : <Send size={24} />}
                {isSending ? 'Processing...' : (cart.reduce((s, i) => s + i.finalPrice, 0) > 0 ? (payMethod === 'midtrans' ? 'BAYAR OTOMATIS' : 'KONFIRMASI PAYPAL') : 'KLAIM TRIAL GRATIS')}
              </button>
              <button onClick={clearCart} className="w-full mt-5 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 text-white transition-all uppercase tracking-widest border border-red-600 ninja-btn-hover" style={{ background: 'rgba(220,38,38,0.2)' }}><Trash2 size={16} />Kosongkan Semua Keranjang</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL HWID LISENSI --- */}
      {activeMenu === 'hwid' && (
        <div className="m-overlay"><div className="m-box w-full max-w-2xl rounded-[2.5rem]" style={{ background: 'rgba(15,0,0,.92)', backdropFilter: 'blur(28px)', border: '1px solid rgba(239,68,68,.5)', boxShadow: '0 0 80px rgba(220,38,38,.4)' }}>
          <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(239,68,68,.3)' }}><h2 className="text-2xl font-black flex gap-3 items-center text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"><Key />Data Lisensi HWID</h2><button className="rounded-full p-2 hover:bg-white/10 ninja-btn-hover" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.5)' }} onClick={() => setActiveMenu(null)}><X size={18} /></button></div>
          <div className="mscroll p-6 space-y-6" style={{ maxHeight: 'calc(92vh - 72px)' }}>
            {historyData.length === 0 ? <div className="text-center py-20"><Key size={48} className="mx-auto text-red-900 mb-4" /><p className="text-red-500 font-black italic">BELUM ADA DATA LISENSI</p></div> : historyData.map(trx => (
              <div key={trx.id} className="p-6 rounded-[2rem] ninja-card-hover" style={{ background: 'rgba(0,0,0,.6)', border: '1px solid rgba(239,68,68,.3)' }}>
                <div className="p-5 rounded-2xl text-center mb-5 shadow-[inset_0_0_15px_rgba(220,38,38,0.2)]" style={{ background: 'rgba(20,0,0,.80)', border: '1px solid rgba(239,68,68,.5)' }}><p className="text-[10px] text-red-400 font-bold mb-2 uppercase tracking-widest">Master HWID Device:</p><code className="text-2xl md:text-3xl font-black tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{trx.masterHwid}</code></div>
                {trx.hwidItems.map((hw, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-2xl mb-2" style={{ background: 'rgba(0,0,0,.8)', border: `1px solid ${hw.isSuccess ? 'rgba(34,197,94,.5)' : 'rgba(239,68,68,.3)'}` }}>
                    <div className="flex flex-col"><span className="text-sm font-black text-gray-200">{hw.productName}</span><span className={`text-[10px] ${hw.color || 'text-gray-500'} ${hw.bg || ''} border ${hw.border || 'border-red-500/30'} w-fit px-2 py-0.5 rounded mt-1 flex items-center gap-1`}><Crown size={10} />{hw.tierName || 'Standard'} - {hw.duration}</span></div>
                    {hw.isLifetime ? <div className="text-right"><p className="text-[8px] text-green-500 font-black uppercase mb-1 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">AKTIF</p><code className="text-xs font-black text-green-400 px-3 py-1 rounded-lg" style={{ background: 'rgba(34,197,94,.10)', border: '1px solid rgba(34,197,94,.5)' }}>LIFETIME</code></div> : hw.isSuccess ? <div className="text-right"><p className="text-[8px] text-green-500 font-black uppercase mb-1 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">AKTIF</p><code className="text-sm font-black text-green-400 px-3 py-1 rounded-lg" style={{ background: 'rgba(34,197,94,.10)', border: '1px solid rgba(34,197,94,.5)' }}>{hw.keyStatus}</code></div> : <button onClick={() => handleKlaimKey(trx.id, idx)} className="text-[10px] bg-red-700 text-white px-4 py-2 rounded-xl font-black uppercase transition-all ninja-btn-hover border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]">Klaim Key</button>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div></div>
      )}

      {activeMenu === 'history' && (
        <div className="m-overlay"><div className="m-box w-full max-w-2xl rounded-[2.5rem]" style={{ background: 'rgba(15,0,0,.92)', backdropFilter: 'blur(28px)', border: '1px solid rgba(239,68,68,.5)', boxShadow: '0 0 80px rgba(220,38,38,.4)' }}>
          <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(239,68,68,.3)' }}><h2 className="text-2xl font-black flex gap-3 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"><History />G-Drive & Riwayat</h2><button className="rounded-full p-2 hover:bg-white/10 ninja-btn-hover" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.5)' }} onClick={() => setActiveMenu(null)}><X size={18} /></button></div>
          <div className="mscroll p-6 space-y-4" style={{ maxHeight: 'calc(92vh - 72px)' }}>
            {historyData.length === 0 ? <div className="text-center py-20"><Download size={48} className="mx-auto text-red-900 mb-4" /><p className="text-red-500 font-black italic">BELUM ADA RIWAYAT TRANSAKSI</p></div> : historyData.map(trx => (
              <div key={trx.id} className="p-6 rounded-[2rem] ninja-card-hover" style={{ background: 'rgba(0,0,0,.6)', border: '1px solid rgba(239,68,68,.3)' }}>
                <div className="flex justify-between text-[10px] text-red-300 mb-4 font-bold uppercase tracking-widest p-2 rounded-lg" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.4)' }}><span>ID: {trx.id}</span><span>{trx.date}</span></div>
                {trx.hwidItems.map((h, i) => {
                  const liveProduct = allProducts.find(p => p.name === h.productName || p.id === h.id)
                  const zipUrl = safeLink(liveProduct?.zipLink) || safeLink(h.zipLink) || null
                  const pdfUrl = safeLink(liveProduct?.pdfLink) || safeLink(h.pdfLink) || null
                  return (<div key={i} className="mb-4 pt-4" style={{ borderTop: '1px solid rgba(239,68,68,.2)' }}>
                    <p className="font-black text-sm mb-3 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{h.productName}</p>
                    {zipUrl ? (
                      <><div className="flex gap-2 mb-3"><input readOnly value={zipUrl} className="flex-1 p-3 text-xs text-red-400 outline-none font-mono rounded-xl" style={{ background: 'rgba(0,0,0,.8)', border: '1px solid rgba(239,68,68,.4)' }} /><button onClick={() => { navigator.clipboard.writeText(zipUrl); alert('Link Disalin!') }} className="bg-red-700 text-white border border-red-500 px-4 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all ninja-btn-hover shadow-[0_0_10px_rgba(239,68,68,0.8)]"><Copy size={12} />COPY</button></div>
                        <div className="flex gap-3"><a href={zipUrl} target="_blank" rel="noopener noreferrer" className="flex-1 p-3 rounded-xl text-center text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 text-white ninja-btn-hover" style={{ background: 'linear-gradient(135deg, #991b1b, #ef4444)', border: '1px solid #f87171', boxShadow: '0 0 15px rgba(239,68,68,0.6)' }}><HardDrive size={14} />BUKA G-DRIVE</a>
                          {pdfUrl ? <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1 p-3 rounded-xl text-center text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 text-white ninja-btn-hover" style={{ background: 'linear-gradient(135deg, #7e22ce, #d946ef)', border: '1px solid #f472b6', boxShadow: '0 0 15px rgba(217,70,239,0.6)' }}><FileText size={14} />PDF PANDUAN</a> : <div className="flex-1 p-3 rounded-xl text-center text-[10px] font-black uppercase flex items-center justify-center gap-2 text-gray-500" style={{ background: 'rgba(0,0,0,.8)', border: '1px solid rgba(255,255,255,.1)' }}><FileText size={14} />PDF Belum Ada</div>}</div></>
                    ) : (
                      <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(239,68,68,.1)', border: '1px dashed rgba(239,68,68,.5)' }}><p className="text-[11px] text-red-400 font-bold drop-shadow-md">⏳ Link G-Drive belum tersedia</p><p className="text-[9px] text-gray-400 mt-1">Admin akan kirimkan link via WhatsApp setelah verifikasi.</p>{pdfUrl && <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-[10px] font-black text-purple-400 hover:text-purple-300 transition-colors drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]"><FileText size={12} />Download PDF</a>}</div>
                    )}
                  </div>)
                })}
              </div>
            ))}
            {historyData.length > 0 && <button onClick={() => { if (window.confirm('Hapus semua riwayat?')) { setHistoryData([]); setIsVipMember(false); setVipTierInfo(null); localStorage.removeItem('vinzsky_history') } }} className="w-full mt-4 p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-white transition-all ninja-btn-hover" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.5)' }}><Trash2 size={12} />Bersihkan Data Perangkat</button>}
          </div>
        </div></div>
      )}

      {/* ══════════════════════════════════════════════════════
          LIVE CHAT
      ══════════════════════════════════════════════════════ */}
      {!isAnyModalOpen && (
        <div className="fixed bottom-6 right-6 z-[500] flex flex-col items-end">
          {isChatOpen && (
            <div className="mb-4 w-80 sm:w-96 rounded-[2rem] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.5)]" style={{ background: 'rgba(15,0,0,.98)', backdropFilter: 'blur(32px)', border: '1px solid rgba(239,68,68,.6)' }}>
              <div className="p-5 flex justify-between items-center" style={{ background: 'linear-gradient(to right,rgba(220,38,38,.4),rgba(0,0,0,0))', borderBottom: '1px solid rgba(239,68,68,.3)' }}>
                <div><h3 className="font-black text-base text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">CS VinzSky-shopID</h3><p className="text-[10px] text-green-500 flex items-center gap-1.5 font-bold tracking-widest mt-0.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" style={{ boxShadow: '0 0 8px #22c55e' }} />ONLINE 24/7</p></div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 rounded-full transition-all hover:scale-110 ninja-btn-hover" style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.5)' }}><X size={20} className="text-white" /></button>
              </div>
              <div className="h-72 p-5 flex flex-col gap-3 mscroll shadow-inner" style={{ background: 'rgba(0,0,0,.8)' }}>
                {chatMessages.map((m, i) => (<div key={i} className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-md font-bold ${m.sender === 'user' ? 'bg-red-700 text-white self-end rounded-br-sm border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'self-start rounded-bl-sm text-gray-200 border border-gray-700'}`} style={m.sender !== 'user' ? { background: 'rgba(20,20,20,.95)' } : {}}>{m.text}</div>))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendChat} className="p-4 flex gap-3" style={{ background: 'rgba(20,0,0,1)', borderTop: '1px solid rgba(239,68,68,.3)' }}>
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ketik pesan Bosku..." className="flex-1 px-5 py-3.5 outline-none text-sm rounded-2xl font-bold transition-all focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,.5)]" style={{ background: 'rgba(0,0,0,.8)', border: '1px solid rgba(239,68,68,.4)', color: 'white' }} />
                <button type="submit" disabled={!chatInput.trim()} className="bg-red-700 border border-red-500 disabled:opacity-50 text-white p-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(239,68,68,.8)] ninja-btn-hover"><Send size={20} /></button>
              </form>
            </div>
          )}
          <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all z-50 ninja-btn-hover ${!isChatOpen ? 'animate-bounce' : ''}`} style={{ background: 'linear-gradient(135deg,#b91c1c,#ef4444)', boxShadow: '0 0 30px rgba(239,68,68,.8),0 0 50px rgba(239,68,68,.4)', border: '2px solid #fca5a5' }}>
            {isChatOpen ? <X size={28} /> : <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>}
          </button>
        </div>
      )}
    </div>
  )
}