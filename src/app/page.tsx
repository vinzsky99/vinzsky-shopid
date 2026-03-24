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
  Eye, TrendingUp, LogIn, LogOut
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'vinz.official9922@gmail.com'
const isAdminUser = (user) => user && (user.email === ADMIN_EMAIL || user.user_metadata?.is_admin)

const DURATIONS = [
  { label: 'Trial 1 Jam', code: '1H',  multiplier: 0,   color: 'text-[#cd7f32]', bg: 'bg-[#cd7f32]/20', border: 'border-[#cd7f32]/50', tierName: 'Bronze',
    diamondColor:'#cd7f32', diamondGlow:'rgba(205,127,50,.7)', diamondBg:'rgba(205,127,50,.15)' },
  { label: '7 Hari',      code: '7D',  multiplier: 0.3, color: 'text-blue-400',   bg: 'bg-blue-400/20',   border: 'border-blue-400/50',   tierName: 'Silver',
    diamondColor:'#60a5fa', diamondGlow:'rgba(96,165,250,.7)',  diamondBg:'rgba(96,165,250,.15)' },
  { label: '14 Hari',     code: '14D', multiplier: 0.6, color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/50', tierName: 'Gold',
    diamondColor:'#fbbf24', diamondGlow:'rgba(251,191,36,.7)',  diamondBg:'rgba(251,191,36,.15)' },
  { label: '30 Hari',     code: '30D', multiplier: 1,   color: 'text-pink-400',   bg: 'bg-pink-400/20',   border: 'border-pink-400/50',   tierName: 'Ruby',
    diamondColor:'#f472b6', diamondGlow:'rgba(244,114,182,.7)', diamondBg:'rgba(244,114,182,.15)' },
]

const DiamondIcon = ({ color='#60a5fa', glow='rgba(96,165,250,.7)', size=24, animate=false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{filter:`drop-shadow(0 0 6px ${glow}) drop-shadow(0 0 12px ${glow})`}}>
    <polygon points="12,2 20,8 20,10 12,22 4,10 4,8" fill={color} opacity="0.9"/>
    <polygon points="12,2 20,8 12,10 4,8" fill="white" opacity="0.35"/>
    <polygon points="12,10 20,10 12,22" fill={color} opacity="0.6"/>
    <polygon points="4,10 12,10 12,22" fill={color} opacity="0.8"/>
    <line x1="4" y1="8" x2="20" y2="8" stroke="white" strokeWidth="0.5" opacity="0.4"/>
    <line x1="4" y1="10" x2="12" y2="2" stroke="white" strokeWidth="0.3" opacity="0.3"/>
    <line x1="20" y1="10" x2="12" y2="2" stroke="white" strokeWidth="0.3" opacity="0.3"/>
    {animate && <animate attributeName="opacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite"/>}
  </svg>
)

const playPop = () => { try { const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.type='sine';osc.frequency.setValueAtTime(400,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(40,ctx.currentTime+0.1);gain.gain.setValueAtTime(1,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.1);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.1) }catch(e){} }
const playKaChing = () => { try { const ctx=new(window.AudioContext||window.webkitAudioContext)();const beep=(f,t,d)=>{const o=ctx.createOscillator();const g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='square';o.frequency.setValueAtTime(f,ctx.currentTime+t);g.gain.setValueAtTime(0.3,ctx.currentTime+t);g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+t+d);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+d)};beep(1200,0,0.1);beep(1600,0.15,0.3) }catch(e){} }

const generateFingerprint = () => {
  if (typeof window==='undefined') return 'unknown_device'
  const { userAgent,language,hardwareConcurrency,deviceMemory } = window.navigator
  const { colorDepth,width,height } = window.screen
  const data = [userAgent,language,colorDepth,`${width}x${height}`,hardwareConcurrency,deviceMemory].join('|')
  let hash=0; for(let i=0;i<data.length;i++){hash=((hash<<5)-hash)+data.charCodeAt(i);hash=hash&hash}
  return 'FING-'+Math.abs(hash).toString(16)
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return new Date().toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'})
  return new Date(dateStr).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'})
}

const GS = () => (
  <style>{`
    html, body { overflow-x: hidden; }
    body.modal-open { overflow: hidden !important; }
    .mscroll { overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(59,130,246,.4) transparent; }
    .mscroll::-webkit-scrollbar { width: 3px; }
    .mscroll::-webkit-scrollbar-thumb { background: rgba(59,130,246,.4); border-radius: 99px; }
    .m-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0,4,18,.85); backdrop-filter: blur(18px) saturate(140%); -webkit-backdrop-filter: blur(18px) saturate(140%); overflow: hidden; }
    .m-box { position: relative; width: 100%; max-height: 92vh; overflow: hidden; display: flex; flex-direction: column; }
    .glass-nav { background: rgba(3,7,20,.72) !important; backdrop-filter: blur(32px) saturate(200%) !important; -webkit-backdrop-filter: blur(32px) saturate(200%) !important; }
    @keyframes fomoIn  { from { opacity:0; transform:translateX(-60px) scale(.9); } to { opacity:1; transform:translateX(0) scale(1); } }
    @keyframes fomoOut { from { opacity:1; transform:translateX(0) scale(1); }     to { opacity:0; transform:translateX(-60px) scale(.9); } }
    .fomo-in  { animation: fomoIn  .5s cubic-bezier(.34,1.56,.64,1) forwards; }
    .fomo-out { animation: fomoOut .4s ease forwards; }
    @keyframes purchaseIn  { from { opacity:0; transform:translateX(-80px) scale(.85); } to { opacity:1; transform:translateX(0) scale(1); } }
    @keyframes purchaseOut { from { opacity:1; transform:translateX(0) scale(1); }       to { opacity:0; transform:translateX(-80px) scale(.85); } }
    .purchase-in  { animation: purchaseIn  .55s cubic-bezier(.34,1.56,.64,1) forwards; }
    .purchase-out { animation: purchaseOut .45s ease forwards; }
    .reveal { transition: opacity 1s, transform 1s; }
    .inp { width:100%; padding:.95rem 1rem .95rem 2.8rem; border-radius:1rem; background: rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.09); outline:none; font-weight:700; font-size:.82rem; color:#fff; transition: border-color .2s, box-shadow .2s; }
    .inp:focus { border-color:rgba(59,130,246,.7); box-shadow:0 0 0 3px rgba(59,130,246,.15); }
    .neon-card { transition: transform .35s, box-shadow .35s, border-color .35s; border: 1px solid rgba(255,255,255,.06); }
    .neon-card:hover { transform: translateY(-6px); border-color: rgba(59,130,246,.6) !important; box-shadow: 0 0 12px rgba(59,130,246,.5), 0 0 28px rgba(59,130,246,.35), 0 0 55px rgba(59,130,246,.18), 0 20px 40px rgba(0,0,0,.5) !important; }
    @keyframes fireFlicker { 0%,100%{opacity:1;filter:brightness(1) saturate(1.2)} 25%{opacity:.85;filter:brightness(1.4) saturate(1.5)} 50%{opacity:.95;filter:brightness(1.6) saturate(1.8) hue-rotate(5deg)} 75%{opacity:.8;filter:brightness(1.3) saturate(1.4)} }
    @keyframes fireSweep { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    .fire-bar { background: linear-gradient(90deg,#ff3d00,#ff6a00,#ff9500,#ffcc00,#ff6a00,#ff3d00); background-size: 300% 100%; animation: fireSweep 1.8s ease infinite, fireFlicker .6s ease-in-out infinite; box-shadow: 0 0 8px #ff6a00, 0 0 18px #ff9500, 0 0 32px rgba(255,100,0,.6); }
    .fire-price { text-shadow: 0 0 10px rgba(59,130,246,.9), 0 0 22px rgba(59,130,246,.6), 0 0 40px rgba(59,130,246,.3); }
    .fire-discount { text-shadow: 0 0 8px rgba(168,85,247,.9), 0 0 18px rgba(168,85,247,.5); }
    .video-fullscreen-overlay { position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,.97); display: flex; align-items: center; justify-content: center; }
    .media-panel-fill { position: relative; overflow: hidden; background: #000; }
    .media-panel-fill video, .media-panel-fill img { width:100%; height:100%; object-fit:cover; display:block; }
    .btn-cart { flex:1; font-weight:800; padding:1rem; border-radius:1rem; display:flex; align-items:center; justify-content:center; gap:8px; transition: all .25s; background: linear-gradient(135deg,rgba(234,179,8,.22),rgba(249,115,22,.18)); border: 1.5px solid rgba(234,179,8,.55); color: #fde68a; box-shadow: 0 0 12px rgba(234,179,8,.15); }
    .btn-cart:hover { background: linear-gradient(135deg,rgba(234,179,8,.38),rgba(249,115,22,.28)); transform: scale(1.04); box-shadow: 0 0 20px rgba(234,179,8,.5), 0 0 40px rgba(249,115,22,.25); }
    .btn-buy { flex:1; font-weight:800; padding:1rem; border-radius:1rem; display:flex; align-items:center; justify-content:center; gap:8px; background: linear-gradient(135deg,#1d4ed8,#4f46e5); color:#fff; transition: all .25s; box-shadow: 0 0 14px rgba(37,99,235,.5), 0 0 28px rgba(79,70,229,.3); }
    .btn-buy:hover { background: linear-gradient(135deg,#1e40af,#3730a3); transform: scale(1.04); box-shadow: 0 0 22px rgba(37,99,235,.7), 0 0 44px rgba(79,70,229,.4); }
    @keyframes exitPop { from { opacity:0; transform:scale(.8) translateY(30px); } to { opacity:1; transform:scale(1) translateY(0); } }
    .exit-pop { animation: exitPop .5s cubic-bezier(.34,1.56,.64,1) forwards; }
    @keyframes visitorPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.7;transform:scale(1.05);} }
    .visitor-pulse { animation: visitorPulse 2s ease infinite; }
    @keyframes authModalIn { from{opacity:0;transform:scale(.92) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
    .auth-modal-in { animation: authModalIn .45s cubic-bezier(.34,1.56,.64,1) forwards; }
    @keyframes avatarGlow { 0%,100%{box-shadow:0 0 20px rgba(59,130,246,.4)} 50%{box-shadow:0 0 40px rgba(59,130,246,.7),0 0 60px rgba(168,85,247,.3)} }
    .avatar-glow { animation: avatarGlow 2s ease infinite; }
    video { transform: translateZ(0); -webkit-transform: translateZ(0); backface-visibility: hidden; -webkit-backface-visibility: hidden; will-change: transform; }
    @media (max-width: 768px) { video { object-fit: cover !important; } }
    @media (prefers-reduced-motion: reduce) { video { animation: none !important; } }
  `}</style>
)

export default function Home() {
  const [cart, setCart]                         = useState([])
  const [selectedProduct, setSelectedProduct]   = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[3])
  const [showCheckout, setShowCheckout]         = useState(false)
  const [payMethod, setPayMethod]               = useState('midtrans')
  const [buktiBayar, setBuktiBayar]             = useState(null)
  const [customerName, setCustomerName]         = useState('')
  const [customerWA, setCustomerWA]             = useState('')
  const [customerEmail, setCustomerEmail]       = useState('')
  const [isSending, setIsSending]               = useState(false)
  const [showReceipt, setShowReceipt]           = useState(null)
  const [activeMenu, setActiveMenu]             = useState(null)
  const [historyData, setHistoryData]           = useState([])
  const [notifications, setNotifications]       = useState([])
  const [showNotif, setShowNotif]               = useState(false)
  const [unreadCount, setUnreadCount]           = useState(0)
  const [searchQuery, setSearchQuery]           = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen]             = useState(false)
  const [chatInput, setChatInput]               = useState('')
  const [chatMessages, setChatMessages]         = useState([{ sender:'cs', text:'Halo Bosku! Ada yang bisa CS VinzSky-shopID bantu hari ini?' }])
  const [lastUpdateId, setLastUpdateId]         = useState(0)
  const [reviewData, setReviewData]             = useState(null)
  const [rating, setRating]                     = useState(5)
  const [reviewText, setReviewText]             = useState('')
  const [timeLeft, setTimeLeft]                 = useState(7200)
  const [isVipMember, setIsVipMember]           = useState(false)
  const [vipTierInfo, setVipTierInfo]           = useState(null)
  const [showExitPopup, setShowExitPopup]       = useState(false)
  const [hasShownExit, setHasShownExit]         = useState(false)
  const [hasExitPromo, setHasExitPromo]         = useState(false)
  const [isCheckingTrial, setIsCheckingTrial]   = useState(false)
  const [allProducts, setAllProducts]           = useState([])
  const [publicReviews, setPublicReviews]       = useState([])
  const [isLoadingDB, setIsLoadingDB]           = useState(true)
  const [dbError, setDbError]                   = useState(null)
  const [fullscreenVideo, setFullscreenVideo]   = useState(null)
  const [fomoQueue, setFomoQueue]               = useState([])
  const [activeFomo, setActiveFomo]             = useState(null)
  const [fomoLeaving, setFomoLeaving]           = useState(false)
  const fomoTimerRef = useRef(null)
  const [purchasePopups, setPurchasePopups]         = useState([])
  const [activePurchasePopup, setActivePurchasePopup] = useState(null)
  const [purchaseLeaving, setPurchaseLeaving]       = useState(false)
  const purchaseTimerRef = useRef(null)
  const [visitorCount, setVisitorCount] = useState(0)
  const [viewCounts, setViewCounts]     = useState({})
  const visitorIdRef = useRef(null)
  const [authUser, setAuthUser]           = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authLoading, setAuthLoading]     = useState(false)
  const [showOrderStatus, setShowOrderStatus] = useState(false)
  const [orderStatusData, setOrderStatusData] = useState([])

  const canvasRef        = useRef(null)
  const receiptCanvasRef = useRef(null)
  const chatEndRef       = useRef(null)

  const isAnyModalOpen = showCheckout || selectedProduct!==null || activeMenu!==null || showReceipt!==null || reviewData!==null || showExitPopup || fullscreenVideo!==null || showAuthModal || showOrderStatus

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user || null)
      if (session?.user?.email) {
        setCustomerEmail(session.user.email)
        setCustomerName(session.user.user_metadata?.full_name || '')
      } else {
        const shown = sessionStorage.getItem('vs_auth_shown')
        if (!shown) {
          setTimeout(() => { setShowAuthModal(true); sessionStorage.setItem('vs_auth_shown','1') }, 1500)
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
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    setAuthLoading(false)
  }
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthUser(null)
    setShowAuthModal(false)
  }

  /* ── FETCH ORDER STATUS ── */
  const fetchOrderStatus = useCallback(async () => {
    if (!authUser) return
    try {
      const { data } = await supabase.from('orders').select('*')
        .eq('customer_email', authUser.email)
        .order('created_at', { ascending: false })
      setOrderStatusData(data || [])
    } catch(e) {}
  }, [authUser])

  useEffect(() => { if(authUser) fetchOrderStatus() }, [authUser, fetchOrderStatus])

  useEffect(() => {
    document.body.classList.toggle('modal-open', isAnyModalOpen)
    return () => document.body.classList.remove('modal-open')
  }, [isAnyModalOpen])

  useEffect(() => {
    if (!activeFomo && fomoQueue.length>0 && !isAnyModalOpen) {
      const [next,...rest]=fomoQueue; setFomoQueue(rest); setActiveFomo(next); setFomoLeaving(false)
      fomoTimerRef.current=setTimeout(()=>{ setFomoLeaving(true); setTimeout(()=>setActiveFomo(null),500) },5000)
    }
    return ()=>clearTimeout(fomoTimerRef.current)
  }, [activeFomo,fomoQueue,isAnyModalOpen])
  const pushFomo = useCallback((item)=>setFomoQueue(q=>[...q.slice(-4),item]),[])

  useEffect(() => {
    if (!activePurchasePopup && purchasePopups.length>0 && !isAnyModalOpen) {
      const [next,...rest]=purchasePopups; setPurchasePopups(rest); setActivePurchasePopup(next); setPurchaseLeaving(false)
      purchaseTimerRef.current=setTimeout(()=>{ setPurchaseLeaving(true); setTimeout(()=>setActivePurchasePopup(null),500) },5000)
    }
    return ()=>clearTimeout(purchaseTimerRef.current)
  }, [activePurchasePopup,purchasePopups,isAnyModalOpen])
  const pushPurchasePopup = useCallback((order)=>setPurchasePopups(q=>[...q.slice(-3),order]),[])

  useEffect(() => {
    const ck=process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    const s=document.createElement('script'); s.src='https://app.midtrans.com/snap/snap.js'
    s.setAttribute('data-client-key',ck); s.async=true; document.body.appendChild(s)
    return ()=>{ try{document.body.removeChild(s)}catch(e){} }
  }, [])

  useEffect(() => {
    ;(async()=>{
      setIsLoadingDB(true)
      try {
        const{data:dbP,error:pE}=await supabase.from('products').select('*').order('id',{ascending:true})
        if(pE) throw pE
        setAllProducts((dbP||[]).map(p=>({
          id:p.id||Math.random(), name:p.name||'Produk', category:p.category||'AI',
          price:p.price||0, originalPrice:p.originalprice||p.price||0, stock:p.stock||99,
          isFlashSale:p.isflashsale||false, image:p.image||'/produk1.jpg',
          desc:p.product_desc||p.desc||p.description||'Deskripsi eksklusif dari VinzSky-shopID.',
          zipLink:(p.ziplink&&p.ziplink!=='#'&&p.ziplink!=='')?p.ziplink:null,
          pdfLink:(p.pdflink&&p.pdflink!=='#'&&p.pdflink!=='')?p.pdflink:null,
          isLifetime:p.islifetime||false, videoUrl:p.videourl||'',
          discountPersen:p.discount_persen??0, discountExit:p.discount_exit??10,
          discountVip:p.discount_vip??5, discountFlashsale:p.discount_flashsale??0,
          discountAktif:p.discount_aktif??false, discountLabel:p.discount_label||'',
        })))
        const{data:dbR}=await supabase.from('reviews').select('*').order('created_at',{ascending:false})
        setPublicReviews(dbR||[])
      }catch(e){ setDbError(e.message) }
      setIsLoadingDB(false)
    })()
  }, [])

  useEffect(() => {
    const track=async()=>{
      const fp=generateFingerprint(); visitorIdRef.current=fp
      try{
        await supabase.from('visitors').upsert([{visitor_id:fp,last_seen:new Date().toISOString(),user_agent:navigator.userAgent}],{onConflict:'visitor_id'})
        const since=new Date(Date.now()-5*60*1000).toISOString()
        const{count}=await supabase.from('visitors').select('*',{count:'exact',head:true}).gte('last_seen',since)
        setVisitorCount(count||1)
      }catch(e){}
    }
    track()
    const id=setInterval(async()=>{
      try{
        await supabase.from('visitors').upsert([{visitor_id:visitorIdRef.current,last_seen:new Date().toISOString()}],{onConflict:'visitor_id'})
        const since=new Date(Date.now()-5*60*1000).toISOString()
        const{count}=await supabase.from('visitors').select('*',{count:'exact',head:true}).gte('last_seen',since)
        setVisitorCount(count||1)
      }catch(e){}
    },30000)
    return ()=>clearInterval(id)
  }, [])

  const trackProductView=useCallback(async(productId)=>{
    try{
      const fp=generateFingerprint()
      const since=new Date(Date.now()-60*60*1000).toISOString()
      const{data:ex}=await supabase.from('product_views').select('id').eq('product_id',productId).eq('visitor_id',fp).gte('created_at',since).single()
      if(!ex) await supabase.from('product_views').insert([{product_id:productId,visitor_id:fp}])
      const{count}=await supabase.from('product_views').select('*',{count:'exact',head:true}).eq('product_id',productId)
      setViewCounts(prev=>({...prev,[productId]:count||0}))
    }catch(e){}
  },[])

  useEffect(() => {
    const ch=supabase.channel('realtime-orders')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'orders'},payload=>{
        const o=payload.new
        const item={name:o.customer_name||'Pembeli Baru',product:o.items?.[0]?.name||'AI Product',createdAt:o.created_at||new Date().toISOString(),isReal:true}
        pushFomo(item); pushPurchasePopup(item)
        setNotifications(n=>[{time:new Date().toLocaleTimeString(),text:`🛒 ${item.name} baru saja membeli ${item.product}!`},...n])
        setUnreadCount(c=>c+1); setShowNotif(true)
      }).subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  }, [pushFomo,pushPurchasePopup])

  useEffect(() => {
    const ch=supabase.channel('realtime-visitors')
      .on('postgres_changes',{event:'*',schema:'public',table:'visitors'},async()=>{
        const since=new Date(Date.now()-5*60*1000).toISOString()
        const{count}=await supabase.from('visitors').select('*',{count:'exact',head:true}).gte('last_seen',since)
        setVisitorCount(count||1)
      }).subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  }, [])

  useEffect(() => {
    const onML=e=>{ if(e.clientY<=0&&!hasShownExit&&!isAnyModalOpen){setShowExitPopup(true);setHasShownExit(true)} }
    const onVC=()=>{ if(document.hidden&&!hasShownExit&&!isAnyModalOpen){setShowExitPopup(true);setHasShownExit(true)} }
    document.addEventListener('mouseleave',onML); document.addEventListener('visibilitychange',onVC)
    return ()=>{ document.removeEventListener('mouseleave',onML); document.removeEventListener('visibilitychange',onVC) }
  }, [hasShownExit,isAnyModalOpen])

  useEffect(() => {
    const onBefore=e=>{ if(!hasShownExit){setShowExitPopup(true);setHasShownExit(true)} }
    window.addEventListener('beforeunload',onBefore)
    return ()=>window.removeEventListener('beforeunload',onBefore)
  }, [hasShownExit])

  useEffect(() => {
    const obs=new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('opacity-100','translate-y-0');e.target.classList.remove('opacity-0','translate-y-20')} }) },{threshold:0.08})
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el))
    return ()=>obs.disconnect()
  }, [searchQuery,publicReviews,allProducts,isLoadingDB])

  useEffect(() => {
    try{
      const h=JSON.parse(localStorage.getItem('vinzsky_history')||'[]')
      setHistoryData(h)
      if(h.length){ setIsVipMember(true); const t=DURATIONS.find(d=>d.label===h[0]?.hwidItems?.[0]?.duration)||DURATIONS[3]; setVipTierInfo(t) }
    }catch(e){ setHistoryData([]) }
  }, [])

  useEffect(() => { const id=setInterval(()=>setTimeLeft(p=>p<=0?7200:p-1),1000); return ()=>clearInterval(id) }, [])
  useEffect(() => { if(showNotif){const t=setTimeout(()=>setShowNotif(false),5500);return ()=>clearTimeout(t)} }, [showNotif,notifications])
  useEffect(() => { chatEndRef.current?.scrollIntoView({behavior:'smooth'}) }, [chatMessages,isChatOpen])

  useEffect(() => { fetch('/api/telegram?offset=-1').then(r=>r.json()).then(d=>{ if(d.ok&&d.result.length) setLastUpdateId(d.result[0].update_id+1) }).catch(()=>{}) }, [])
  useEffect(() => {
    if(!isChatOpen) return
    const id=setInterval(async()=>{
      try{
        const d=await(await fetch(`/api/telegram?offset=${lastUpdateId}`)).json()
        if(d.ok&&d.result.length){ let lid=lastUpdateId;const msgs=[];d.result.forEach(u=>{lid=u.update_id+1;if(u.message?.text&&!u.message.from.is_bot)msgs.push({sender:'cs',text:u.message.text})});if(msgs.length)setChatMessages(p=>[...p,...msgs]);setLastUpdateId(lid) }
      }catch(e){}
    },3000)
    return ()=>clearInterval(id)
  }, [isChatOpen,lastUpdateId])

  useEffect(() => {
    if(!canvasRef.current) return
    const cv=canvasRef.current;const ctx=cv.getContext('2d')
    let w=cv.width=window.innerWidth;let h=cv.height=window.innerHeight
    let animId;const shoots=[];let shootT=0
    const stars=Array.from({length:600},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2.2+.12,a:Math.random()*.85+.08,da:(Math.random()*.014+.003)*(Math.random()>.5?1:-1),col:['rgba(200,220,255,','rgba(255,245,210,','rgba(180,200,255,','rgba(255,255,255,','rgba(210,230,255,','rgba(255,230,200,'][Math.floor(Math.random()*6)]}))
    const drawNebula=()=>{ const grd=ctx.createLinearGradient(w*.05,h*.1,w*.95,h*.92);grd.addColorStop(0,'rgba(8,18,60,0)');grd.addColorStop(.18,'rgba(20,12,55,.15)');grd.addColorStop(.35,'rgba(45,18,90,.25)');grd.addColorStop(.5,'rgba(18,45,110,.30)');grd.addColorStop(.65,'rgba(55,22,80,.20)');grd.addColorStop(.82,'rgba(12,30,75,.16)');grd.addColorStop(1,'rgba(5,10,30,0)');ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);[[w*.12,h*.28,w*.42,'rgba(25,45,170,.14)','rgba(55,18,130,.09)'],[w*.78,h*.52,w*.36,'rgba(130,18,75,.13)','rgba(70,8,100,.07)'],[w*.3,h*.78,w*.30,'rgba(0,70,120,.12)','rgba(0,45,90,.06)'],[w*.88,h*.85,w*.24,'rgba(120,60,10,.10)','rgba(0,0,0,0)'],[w*.5,h*.2,w*.5,'rgba(40,10,90,.10)','rgba(0,0,0,0)']].forEach(([x,y,r,c0,c1])=>{ const n=ctx.createRadialGradient(x,y,0,x,y,r);n.addColorStop(0,c0);n.addColorStop(1,c1);ctx.fillStyle=n;ctx.fillRect(0,0,w,h) }) }
    const spawnShoot=()=>shoots.push({x:Math.random()*w*.75,y:Math.random()*h*.35,len:Math.random()*120+50,spd:Math.random()*12+6,a:1,angle:Math.PI/4+(Math.random()-.5)*.5,width:Math.random()*1.8+0.8})
    const animate=()=>{
      ctx.clearRect(0,0,w,h);drawNebula()
      stars.forEach(s=>{ s.a+=s.da;if(s.a>.88||s.a<.04)s.da*=-1;if(s.r>1.0){const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*5.5);g.addColorStop(0,s.col+(s.a*.7)+')');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(s.x-s.r*5.5,s.y-s.r*5.5,s.r*11,s.r*11)};ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=s.col+s.a+')';ctx.fill();if(s.r>1.4){ctx.strokeStyle=s.col+(s.a*.4)+')';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(s.x-s.r*4.5,s.y);ctx.lineTo(s.x+s.r*4.5,s.y);ctx.moveTo(s.x,s.y-s.r*4.5);ctx.lineTo(s.x,s.y+s.r*4.5);ctx.stroke()} })
      shootT++;if(shootT>80&&Math.random()>.88){spawnShoot();shootT=0};if(Math.random()>.995)spawnShoot()
      for(let i=shoots.length-1;i>=0;i--){const sh=shoots[i];ctx.save();ctx.translate(sh.x,sh.y);ctx.rotate(sh.angle);const sg=ctx.createLinearGradient(0,0,sh.len,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.6,`rgba(200,220,255,${sh.a*.6})`);sg.addColorStop(1,`rgba(255,255,255,${sh.a})`);ctx.strokeStyle=sg;ctx.lineWidth=sh.width;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(sh.len,0);ctx.stroke();const sg2=ctx.createLinearGradient(0,-3,sh.len,3);sg2.addColorStop(0,'rgba(120,180,255,0)');sg2.addColorStop(1,`rgba(120,180,255,${sh.a*.3})`);ctx.strokeStyle=sg2;ctx.lineWidth=sh.width*3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(sh.len,0);ctx.stroke();ctx.restore();sh.x+=Math.cos(sh.angle)*sh.spd;sh.y+=Math.sin(sh.angle)*sh.spd;sh.a-=.022;if(sh.a<=0)shoots.splice(i,1)}
      animId=requestAnimationFrame(animate)
    }
    animate()
    const resize=()=>{w=cv.width=window.innerWidth;h=cv.height=window.innerHeight}
    window.addEventListener('resize',resize)
    return ()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',resize)}
  }, [])

  useEffect(() => {
    if(!showReceipt||!receiptCanvasRef.current) return
    const cv=receiptCanvasRef.current;const ctx=cv.getContext('2d')
    let w=cv.width=window.innerWidth;let h=cv.height=window.innerHeight
    const cols=['#22c55e','#3b82f6','#eab308','#ec4899','#fff']
    const conf=Array.from({length:180},()=>({x:Math.random()*w,y:Math.random()*h-h,r:Math.random()*6+2,dx:Math.random()*4-2,dy:Math.random()*5+2,color:cols[Math.floor(Math.random()*5)],tilt:Math.floor(Math.random()*10)-10,tai:(Math.random()*.07)+.05,ta:0}))
    const run=()=>{ctx.clearRect(0,0,w,h);conf.forEach(c=>{c.ta+=c.tai;c.y+=(Math.cos(c.ta)+1+c.r/2)/2;c.x+=Math.sin(c.ta)*2;ctx.beginPath();ctx.lineWidth=c.r;ctx.strokeStyle=c.color;ctx.moveTo(c.x+c.tilt+c.r,c.y);ctx.lineTo(c.x+c.tilt,c.y+c.tilt+c.r);ctx.stroke();if(c.y>h){c.y=-10;c.x=Math.random()*w}});requestAnimationFrame(run)}
    run()
  }, [showReceipt])

  const fmt=s=>`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const safeLink=(url)=>url&&url!=='#'&&url!==''?url:null

  const calcPrice=(basePrice,product=null)=>{
    if(!basePrice) return 0
    const p=product;const candidates=[]
    if(p){
      if(p.discountAktif&&p.discountPersen>0) candidates.push(p.discountPersen)
      if(p.isFlashSale){const fsDisc=p.discountFlashsale>0?p.discountFlashsale:(p.discountAktif?p.discountPersen:0);if(fsDisc>0)candidates.push(fsDisc)}
      if(hasExitPromo&&(p.discountExit??10)>0) candidates.push(p.discountExit??10)
      if(isVipMember&&!hasExitPromo&&(p.discountVip??5)>0) candidates.push(p.discountVip??5)
    }else{ if(hasExitPromo)candidates.push(10);else if(isVipMember)candidates.push(5) }
    return Math.round(basePrice*(1-Math.max(...(candidates.length?candidates:[0]))/100))
  }

  const handleCloseProduct=()=>{ if(!hasExitPromo&&!hasShownExit){setShowExitPopup(true);setHasShownExit(true)}else setSelectedProduct(null) }
  const handleCloseCheckout=()=>{
    if(cart.length>0){if(window.confirm('Yakin mau batal checkout? Promo SULTAN masih aktif!')){setShowCheckout(false);const orig=allProducts.find(p=>p.id===cart[0].id)||cart[0];setSelectedProduct(orig);addNotif('Checkout ditunda.')}}
    else setShowCheckout(false)
  }
  const addNotif=(text)=>{ setNotifications(p=>[{time:new Date().toLocaleTimeString(),text},...p]);setUnreadCount(c=>c+1);setShowNotif(true) }

  const handleProductAction=async(product,duration,type)=>{
    if(duration.code==='1H'){
      setIsCheckingTrial(true)
      try{
        const fp=generateFingerprint();let ip='Unknown'
        try{ip=(await(await fetch('https://api.ipify.org?format=json')).json()).ip}catch(e){}
        const{data:ex}=await supabase.from('trial_usage').select('*').eq('device_fingerprint',fp).single()
        if(ex){setIsCheckingTrial(false);alert('🚨 TRIAL SUDAH DIGUNAKAN!\n\nUpgrade ke lisensi resmi sekarang!');return}
        await supabase.from('trial_usage').insert([{device_fingerprint:fp,ip_address:ip}])
        alert('🎉 TRIAL 1 Jam DIAKTIFKAN!')
      }catch(e){console.error(e)}
      setIsCheckingTrial(false)
    }
    const fp=calcPrice(product.price,product)*duration.multiplier
    const item={...product,finalPrice:fp,durationLabel:duration.label,durationCode:duration.code,...duration,cartId:Date.now()}
    playPop();setCart(c=>[...c,item]);setSelectedProduct(null)
    if(type==='cart')addNotif(`${product.name} masuk keranjang!`)
    else setShowCheckout(true)
  }

  const removeFromCart=i=>{const nc=[...cart];const rm=nc.splice(i,1)[0];setCart(nc);if(!nc.length)setShowCheckout(false);addNotif(`${rm.name} dibatalin 🥺`)}
  const clearCart=()=>{setCart([]);setShowCheckout(false);setBuktiBayar(null);addNotif('Keranjang dikosongkan.')}

  const eksekusiPembayaran=async()=>{
    if(!customerName||!customerWA||!customerEmail) return alert('Lengkapi Nama, WA, dan Email dulu Bosku!')
    const total=cart.reduce((s,i)=>s+i.finalPrice,0)
    if(total===0){setIsSending(true);await prosesPesananLokal('TRIAL AKTIF');setIsSending(false);return}
    if(payMethod==='paypal'){
      if(!buktiBayar) return alert('Upload bukti bayar PayPal dulu!')
      setIsSending(true)
      const hwid='744BC690E35B';const items=cart.map(i=>`- ${i.name} (${i.durationLabel})`).join('\n')
      const msg=`💸 *ORDER BARU (PAYPAL)*\n👤 ${customerName}\n📱 ${customerWA}\n📧 ${customerEmail}\n💻 ${hwid}\n💰 Rp ${total.toLocaleString()}\n\n${items}`
      const fd=new FormData();fd.append('caption',msg);fd.append('photo',buktiBayar);fd.append('parse_mode','Markdown')
      try{await fetch('/api/telegram',{method:'POST',body:fd})}catch(e){}
      await prosesPesananLokal('MENUNGGU CEK ADMIN PAYPAL');setIsSending(false);return
    }
    setIsSending(true);const oid='TRX-'+Date.now()
    try{
      const res=await fetch('/api/midtrans',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({order_id:oid,gross_amount:total,customer_details:{first_name:customerName,phone:customerWA,email:customerEmail}})})
      const data=await res.json()
      if(data.token){
        window.snap.pay(data.token,{
          onSuccess:async r=>{await prosesPesananLokal(`LUNAS (MIDTRANS - ${r.payment_type})`,null,oid);setIsSending(false)},
          onPending:()=>{alert('Selesaikan pembayaran.');setIsSending(false)},
          onError:()=>{alert('Pembayaran Gagal!');setIsSending(false)},
          onClose:()=>{alert('Pembayaran belum selesai 🥺');setIsSending(false)},
        })
      }else{alert('Gagal konek Midtrans!');setIsSending(false)}
    }catch(e){alert('Gagal menghubungi server.');setIsSending(false)}
  }

  const prosesPesananLokal=async(status,_file=null,tid=null)=>{
    const hwid='744BC690E35B';const total=cart.reduce((s,i)=>s+i.finalPrice,0)
    const trxId=tid||'TRX-'+Date.now()
    if(status.includes('LUNAS')||status==='TRIAL AKTIF'){
      const items=cart.map(i=>`- ${i.name} (${i.durationLabel})`).join('\n')
      const msg=`✅ *PEMBAYARAN SUKSES*\n💳 ${status}\n👤 ${customerName}\n📱 ${customerWA}\n📧 ${customerEmail}\n💻 ${hwid}\n💰 Rp ${total.toLocaleString()}\n\n${items}`
      try{await fetch('/api/telegram',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:msg,parse_mode:'Markdown'})})}catch(e){}
    }
    const hwidItems=cart.map(c=>({productName:c.name,duration:c.durationLabel,keyStatus:c.isLifetime?'LIFETIME':'Menunggu Key WA',isSuccess:!!c.isLifetime,...c}))
    const trx={id:trxId,date:new Date().toLocaleString(),total,masterHwid:hwid,customerName,customerWA,customerEmail,hwidItems}
    const upd=[trx,...historyData];setHistoryData(upd);localStorage.setItem('vinzsky_history',JSON.stringify(upd))
    await supabase.from('orders').insert([{
      customer_name:customerName,customer_wa:customerWA,customer_email:customerEmail,
      master_hwid:hwid,total_price:total,items:cart,created_at:new Date().toISOString(),
      order_status: status.includes('LUNAS')||status==='TRIAL AKTIF'?'SUCCESS':'PENDING',
      buyer_name: authUser?.user_metadata?.full_name||customerName,
      buyer_email: authUser?.email||customerEmail,
      buyer_avatar: authUser?.user_metadata?.avatar_url||null,
    }])
    const key='VINZ-'+Math.random().toString(36).substring(2,10).toUpperCase()
    let exp=new Date()
    if(cart[0].durationCode==='1H')exp.setHours(exp.getHours()+1)
    else if(cart[0].durationCode==='7D')exp.setDate(exp.getDate()+7)
    else if(cart[0].durationCode==='14D')exp.setDate(exp.getDate()+14)
    else if(cart[0].durationCode==='30D')exp.setDate(exp.getDate()+30)
    else exp.setFullYear(exp.getFullYear()+100)
    await supabase.from('licenses').insert([{license_key:key,master_hwid:hwid,tier:cart[0].durationCode,expires_at:exp.toISOString(),status:status.includes('LUNAS')||status==='TRIAL AKTIF'?'ACTIVE':'PENDING'}])
    setIsVipMember(true);setVipTierInfo(DURATIONS.find(d=>d.code===cart[0].durationCode)||DURATIONS[3])
    setCart([]);setShowCheckout(false);setBuktiBayar(null);setCustomerName('');setCustomerWA('');setCustomerEmail('')
    setShowReceipt(trx);playKaChing()
  }

  const handleKlaimKey=(tid,idx)=>{
    const key=window.prompt('Masukkan License Key dari Admin WhatsApp:')
    if(key?.trim()){
      const nd=[...historyData];const ti=nd.findIndex(t=>t.id===tid)
      if(ti!==-1){nd[ti].hwidItems[idx].keyStatus=key;nd[ti].hwidItems[idx].isSuccess=true;setHistoryData(nd);localStorage.setItem('vinzsky_history',JSON.stringify(nd));alert('🎉 License Key Aktif!');setActiveMenu(null);setReviewData({trxId:tid,productName:nd[ti].hwidItems[idx].productName,customerName:nd[ti].customerName})}
    }
  }

  const submitReview=async()=>{
    if(!reviewText.trim()) return alert('Tulis dulu ulasannya Bosku!')
    setIsSending(true)
    const rev={name:reviewData.customerName||'Guest',product:reviewData.productName||'AI',rating,review_text:reviewText}
    try{
      await fetch('/api/telegram',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:`🌟 *REVIEW*\n${rev.name}\n${rev.product}\n⭐${rev.rating}/5\n"${rev.review_text}"`,parse_mode:'Markdown'})})
      await supabase.from('reviews').insert([{
        ...rev,
        buyer_avatar: authUser?.user_metadata?.avatar_url||null,
        buyer_email: authUser?.email||null,
        tier_code: isVipMember&&vipTierInfo?vipTierInfo.code:'7D',
      }])
      setPublicReviews(p=>[rev,...p]);addNotif('Review berhasil dipublikasi!');setReviewData(null);setReviewText('');setRating(5)
    }catch(e){alert('Gagal kirim review.')}
    setIsSending(false)
  }

  const handleSendChat=async e=>{
    e.preventDefault();if(!chatInput.trim()) return
    const m={sender:'user',text:chatInput};setChatMessages(p=>[...p,m]);setChatInput('')
    try{await fetch('/api/telegram',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:`💬 *LIVE CHAT*\n"${m.text}"`,parse_mode:'Markdown'})})}catch(e){}
  }

  const filtered=allProducts.filter(p=>{const s=(searchQuery||'').toLowerCase();return(p.name||'').toLowerCase().includes(s)||(p.category||'').toLowerCase().includes(s)})

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans bg-[#020610] text-white">
      <GS/>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{opacity:.94}}/>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{background:'radial-gradient(ellipse 80% 50% at 15% 25%,rgba(18,12,60,.44) 0%,transparent 70%),radial-gradient(ellipse 60% 40% at 80% 60%,rgba(55,8,40,.34) 0%,transparent 65%)'}}/>

      {fullscreenVideo&&(
        <div className="video-fullscreen-overlay" onClick={()=>setFullscreenVideo(null)}>
          <button onClick={()=>setFullscreenVideo(null)} className="absolute top-5 right-5 z-50 bg-red-600 hover:bg-red-500 rounded-full p-3 transition-all"><X size={28}/></button>
          <div className="w-full h-full flex items-center justify-center p-4" onClick={e=>e.stopPropagation()}>
            <video src={fullscreenVideo} controls autoPlay playsInline className="max-w-full max-h-full rounded-2xl" style={{objectFit:'contain'}}/>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="m-overlay" style={{zIndex:99997}} onClick={()=>setShowAuthModal(false)}>
          <div className="auth-modal-in relative w-full max-w-sm rounded-[2rem] overflow-hidden" onClick={e=>e.stopPropagation()}
            style={{background:'rgba(5,9,25,.65)',backdropFilter:'blur(48px) saturate(200%)',WebkitBackdropFilter:'blur(48px) saturate(200%)',border:'1px solid rgba(255,255,255,.12)',boxShadow:'0 0 80px rgba(37,99,235,.2), 0 0 0 1px rgba(255,255,255,.06), inset 0 1px 0 rgba(255,255,255,.1)'}}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(59,130,246,.9),rgba(168,85,247,.7),transparent)'}}/>
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(168,85,247,.5),transparent)'}}/>
            <button onClick={()=>setShowAuthModal(false)} className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/15 hover:scale-110" style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)'}}><X size={15}/></button>
            <div className="p-8 text-center">
              {authUser ? (
                <div>
                  <div className="relative mx-auto mb-5 w-24 h-24">
                    <div className="absolute inset-0 rounded-full avatar-glow" style={{borderRadius:'50%'}}/>
                    {authUser.user_metadata?.avatar_url
                      ? <img src={authUser.user_metadata.avatar_url} alt="avatar" className="relative w-24 h-24 rounded-full object-cover" style={{border:'2.5px solid rgba(59,130,246,.6)',boxShadow:'0 0 20px rgba(59,130,246,.4)'}}/>
                      : <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black mx-auto" style={{background:'linear-gradient(135deg,#1d4ed8,#7c3aed)',border:'2.5px solid rgba(59,130,246,.6)',boxShadow:'0 0 20px rgba(59,130,246,.4)'}}>{(authUser.user_metadata?.full_name||authUser.email||'U')[0].toUpperCase()}</div>
                    }
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center" style={{border:'2px solid rgba(5,9,25,1)',boxShadow:'0 0 8px #22c55e'}}><div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"/></div>
                  </div>
                  <h2 className="text-xl font-black text-white mb-0.5">{authUser.user_metadata?.full_name || 'Member VinzSky'}</h2>
                  <p className="text-xs text-gray-400 mb-2">{authUser.email}</p>
                  <div className="flex flex-col items-center gap-3 mb-6">
                    {isAdminUser(authUser) ? (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{background:'rgba(239,68,68,.15)',border:'1px solid rgba(239,68,68,.4)',boxShadow:'0 0 12px rgba(239,68,68,.3)'}}>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>
                        <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">⚡ ADMIN</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.3)'}}>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">MEMBER AKTIF</span>
                      </div>
                    )}
                    {isAdminUser(authUser) ? (
                      /* ── GOD TIER ADMIN ── */
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl w-full justify-center"
                          style={{background:'linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,140,0,.08),rgba(255,20,147,.08))',border:'1px solid rgba(255,215,0,.45)',boxShadow:'0 0 20px rgba(255,215,0,.25),0 0 40px rgba(255,140,0,.1)'}}>
                          {/* Angel SVG */}
                          <svg width="30" height="30" viewBox="0 0 48 48" fill="none" style={{filter:'drop-shadow(0 0 6px rgba(255,215,0,.8))'}}>
                            <ellipse cx="24" cy="5" rx="9" ry="2.5" stroke="#FFD700" strokeWidth="2" fill="none"/>
                            <path d="M13 22 Q2 15 5 26 Q7 33 15 29" fill="#FFD700" opacity="0.75"/>
                            <path d="M13 22 Q1 19 3 30 Q6 37 14 32" fill="white" opacity="0.25"/>
                            <path d="M35 22 Q46 15 43 26 Q41 33 33 29" fill="#FFD700" opacity="0.75"/>
                            <path d="M35 22 Q47 19 45 30 Q42 37 34 32" fill="white" opacity="0.25"/>
                            <path d="M19 29 Q17 39 19 45 L24 43 L29 45 Q31 39 29 29 Z" fill="#FFD700" opacity="0.55"/>
                            <circle cx="24" cy="17" r="7" fill="#FFE4B5" stroke="#FFD700" strokeWidth="1.2"/>
                            <circle cx="22" cy="16" r="1.2" fill="#8B4513"/>
                            <circle cx="26" cy="16" r="1.2" fill="#8B4513"/>
                            <path d="M21 20 Q24 23 27 20" stroke="#FF69B4" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                            <line x1="6" y1="34" x2="30" y2="22" stroke="#FFD700" strokeWidth="1.5"/>
                            <polygon points="30,22 25,20 27,25" fill="#FFD700"/>
                            <path d="M6 34 Q4 36 6 38" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
                          </svg>
                          <div>
                            <p className="font-black text-[13px] uppercase tracking-widest" style={{background:'linear-gradient(90deg,#FFD700,#FF8C00,#FF1493)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',filter:'drop-shadow(0 0 4px rgba(255,215,0,.5))'}}>⚡ GOD MODE</p>
                            <p className="text-[9px] font-bold text-yellow-600">Full Access • All Tiers Unlocked</p>
                          </div>
                        </div>
                        {/* All tiers row */}
                        <div className="flex items-end justify-center gap-3 mt-1">
                          {DURATIONS.map((d,i)=>(
                            <div key={d.code} className="flex flex-col items-center gap-0.5">
                              <DiamondIcon color={d.diamondColor} glow={d.diamondGlow} size={i===3?20:14+i*2} animate={i===3}/>
                              <span className="text-[7px] font-black uppercase tracking-wide" style={{color:d.diamondColor}}>{d.tierName}</span>
                            </div>
                          ))}
                          {/* GOD Diamond */}
                          <div className="flex flex-col items-center gap-0.5">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{filter:'drop-shadow(0 0 6px rgba(255,215,0,1)) drop-shadow(0 0 12px rgba(255,140,0,.8))'}}>
                              <defs><linearGradient id="gd" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFD700"/><stop offset="50%" stopColor="#FF8C00"/><stop offset="100%" stopColor="#FF1493"/></linearGradient></defs>
                              <polygon points="12,2 20,8 20,10 12,22 4,10 4,8" fill="url(#gd)" opacity="0.95"/>
                              <polygon points="12,2 20,8 12,10 4,8" fill="white" opacity="0.4"/>
                              <polygon points="12,10 20,10 12,22" fill="url(#gd)" opacity="0.65"/>
                              <polygon points="4,10 12,10 12,22" fill="url(#gd)" opacity="0.8"/>
                              <line x1="4" y1="8" x2="20" y2="8" stroke="white" strokeWidth="0.5" opacity="0.5"/>
                            </svg>
                            <span className="text-[7px] font-black uppercase tracking-wide" style={{color:'#FFD700'}}>GOD</span>
                          </div>
                        </div>
                      </div>
                    ) : isVipMember && vipTierInfo ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{background:vipTierInfo.diamondBg||'rgba(251,191,36,.15)',border:`1px solid ${vipTierInfo.diamondColor||'#fbbf24'}60`,boxShadow:`0 0 16px ${vipTierInfo.diamondGlow||'rgba(251,191,36,.3)'}`}}>
                        <DiamondIcon color={vipTierInfo.diamondColor||'#fbbf24'} glow={vipTierInfo.diamondGlow||'rgba(251,191,36,.5)'} size={20} animate/>
                        <div><p className="text-[11px] font-black uppercase tracking-widest" style={{color:vipTierInfo.diamondColor||'#fbbf24'}}>{vipTierInfo.tierName} Member</p><p className="text-[9px] text-gray-500">Tier aktif Anda</p></div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{background:'rgba(205,127,50,.15)',border:'1px solid rgba(205,127,50,.4)',boxShadow:'0 0 16px rgba(205,127,50,.2)'}}>
                        <DiamondIcon color="#cd7f32" glow="rgba(205,127,50,.5)" size={20}/>
                        <div><p className="text-[11px] font-black uppercase tracking-widest" style={{color:'#cd7f32'}}>Bronze Member</p><p className="text-[9px] text-gray-500">Upgrade untuk unlock diskon lebih besar</p></div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 mb-6">
                    {(isAdminUser(authUser)?[{icon:'🛡️',label:'Admin Panel',sub:'Dashboard & kelola toko',action:()=>{window.open('/admin','_blank');setShowAuthModal(false)}},{icon:'🔑',label:'Data Lisensi HWID',sub:'Cek license key aktif Anda',action:()=>{setActiveMenu('hwid');setShowAuthModal(false)}},{icon:'📁',label:'G-Drive & Riwayat',sub:'Download software & invoice',action:()=>{setActiveMenu('history');setShowAuthModal(false)}}]:[{icon:'🔑',label:'Data Lisensi HWID',sub:'Cek license key aktif Anda',action:()=>{setActiveMenu('hwid');setShowAuthModal(false)}},{icon:'📦',label:'Status Pesanan',sub:'Cek progress & status pembelian',action:()=>{setShowOrderStatus(true);setShowAuthModal(false)}},{icon:'📁',label:'G-Drive & Riwayat',sub:'Download software & invoice',action:()=>{setActiveMenu('history');setShowAuthModal(false)}}]).map((item,i)=>(
                      <button key={i} onClick={item.action} className="w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] text-left" style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)'}}>
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1"><p className="text-sm font-black text-white">{item.label}</p><p className="text-[10px] text-gray-500">{item.sub}</p></div>
                        <span className="text-gray-600 text-sm">→</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={handleLogout} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',color:'#f87171'}}><LogOut size={15}/>Keluar dari Akun</button>
                </div>
              ) : (
                <div>
                  <div className="relative mx-auto mb-5 w-28 h-28">
                    <div className="absolute inset-0 rounded-2xl" style={{background:'linear-gradient(135deg,rgba(37,99,235,.5),rgba(168,85,247,.4))',filter:'blur(18px)',animation:'visitorPulse 2s ease infinite'}}/>
                    <div className="relative w-28 h-28 rounded-2xl flex flex-col items-center justify-center mx-auto overflow-hidden" style={{background:'linear-gradient(135deg,#0f1729,#1a1040)',border:'1px solid rgba(255,255,255,.15)',boxShadow:'0 0 30px rgba(37,99,235,.4), inset 0 1px 0 rgba(255,255,255,.15)'}}>
                      <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(29,78,216,.3),rgba(124,58,237,.2))'}}/>
                      <div className="relative z-10 flex flex-col items-center">
                        <span className="font-black text-white leading-none" style={{fontSize:26,letterSpacing:-1,textShadow:'0 0 20px rgba(96,165,250,.8)'}}>VinzSky</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="h-px flex-1 w-8" style={{background:'linear-gradient(90deg,transparent,rgba(96,165,250,.6))'}}/>
                          <span className="text-[9px] font-black tracking-widest uppercase" style={{color:'#93c5fd'}}>shop</span>
                          <span className="text-[9px] font-black tracking-widest" style={{color:'#f472b6'}}>ID</span>
                          <div className="h-px flex-1 w-8" style={{background:'linear-gradient(90deg,rgba(244,114,182,.6),transparent)'}}/>
                        </div>
                      </div>
                      <div className="absolute top-2 right-3 w-1 h-1 rounded-full bg-blue-300 animate-pulse"/>
                      <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-pink-300 animate-pulse" style={{animationDelay:'.5s'}}/>
                      <div className="absolute top-4 left-4 w-0.5 h-0.5 rounded-full bg-yellow-300 animate-pulse" style={{animationDelay:'1s'}}/>
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Selamat Datang!</h2>
                  <p className="text-xs text-blue-400 mb-1 font-black uppercase tracking-widest">VinzSky-shopID</p>
                  <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">Login untuk akses riwayat pembelian,<br/>lisensi, dan G-Drive Anda</p>
                  <div className="flex justify-center gap-3 mb-6">
                    {DURATIONS.map(d=>(
                      <div key={d.code} className="flex flex-col items-center gap-1">
                        <div className="relative"><div className="absolute inset-0" style={{filter:`blur(6px)`,background:d.diamondColor,opacity:.4,borderRadius:'50%'}}/><DiamondIcon color={d.diamondColor} glow={d.diamondGlow} size={22}/></div>
                        <span className="text-[8px] font-black uppercase tracking-wider" style={{color:d.diamondColor}}>{d.tierName}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleGoogleLogin} disabled={authLoading} className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] mb-3 disabled:opacity-60" style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.2)',boxShadow:'0 4px 20px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.1)'}}>
                    {authLoading ? <Clock className="animate-spin" size={18}/> : (
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    {authLoading ? 'Menghubungkan ke Google...' : 'Lanjutkan dengan Google'}
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px" style={{background:'rgba(255,255,255,.08)'}}/>
                    <span className="text-[10px] text-gray-600 font-bold">atau</span>
                    <div className="flex-1 h-px" style={{background:'rgba(255,255,255,.08)'}}/>
                  </div>
                  <button onClick={()=>setShowAuthModal(false)} className="w-full py-3 rounded-xl text-[11px] font-bold transition-all hover:bg-white/5" style={{color:'rgba(255,255,255,.25)',border:'1px solid rgba(255,255,255,.07)'}}>👤 Lanjut sebagai Guest (checkout tanpa login)</button>
                  <p className="text-[9px] text-gray-700 mt-5 leading-relaxed px-2">Login menggunakan akun Google Anda yang sudah ada.<br/>Data aman & tidak dibagikan ke pihak ketiga.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showExitPopup&&(
        <div className="m-overlay" style={{zIndex:99998}}>
          <div className="m-box max-w-lg text-center overflow-hidden exit-pop" style={{borderRadius:'3rem',background:'rgba(8,5,28,.90)',backdropFilter:'blur(32px)',border:'1px solid rgba(168,85,247,.5)',boxShadow:'0 0 60px rgba(168,85,247,.3)'}}>
            <div className="mscroll p-10">
              <button onClick={()=>{setShowExitPopup(false);setSelectedProduct(null)}} className="absolute top-6 right-6 rounded-full p-2 transition-all hover:bg-white/10" style={{background:'rgba(255,255,255,.07)'}}><X size={18}/></button>
              <div className="relative mx-auto mb-6 w-20 h-20"><div className="absolute inset-0 rounded-full" style={{background:'rgba(168,85,247,.2)',boxShadow:'0 0 30px rgba(168,85,247,.6)',animation:'visitorPulse 1s ease infinite'}}/><div className="absolute inset-0 flex items-center justify-center"><Percent size={44} className="text-purple-400"/></div></div>
              <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">TUNGGU BOSKU!</h2>
              <p className="text-sm text-gray-300 mb-3 font-bold">Jangan pergi dulu! Ambil</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6 animate-pulse">EKSTRA DISKON 10%</p>
              <button onClick={()=>{setHasExitPromo(true);setShowExitPopup(false);playPop()}} className="w-full py-5 rounded-[1.5rem] font-black text-xl transition-all hover:scale-105" style={{background:'linear-gradient(135deg,#7c3aed,#ec4899)',boxShadow:'0 10px 30px rgba(168,85,247,.55)'}}>KLAIM DISKON SEKARANG 🎁</button>
              <button onClick={()=>{setShowExitPopup(false);setSelectedProduct(null)}} className="mt-4 text-[10px] text-gray-600 font-bold uppercase hover:text-gray-300 block mx-auto transition-colors">Tidak, saya tidak mau hemat</button>
            </div>
          </div>
        </div>
      )}

      {!isAnyModalOpen&&activePurchasePopup&&(
        <div className={`fixed bottom-24 left-4 md:left-6 z-[9000] max-w-[300px] ${purchaseLeaving?'purchase-out':'purchase-in'}`}>
          <div className="rounded-2xl p-4 relative overflow-hidden" style={{background:'linear-gradient(135deg,rgba(4,10,30,.95),rgba(2,8,22,.98))',backdropFilter:'blur(24px)',border:'1px solid rgba(34,197,94,.5)',boxShadow:'0 0 20px rgba(34,197,94,.3),0 0 50px rgba(34,197,94,.12),0 8px 30px rgba(0,0,0,.6)'}}>
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{background:'linear-gradient(90deg,transparent,#22c55e,#10b981,transparent)'}}/>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'rgba(34,197,94,.2)',border:'1px solid rgba(34,197,94,.5)',boxShadow:'0 0 12px rgba(34,197,94,.3)'}}><CheckCircle size={20} className="text-green-400"/></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1"><span className="text-[9px] font-black text-green-400 uppercase tracking-widest">✅ BARU DIBELI</span><span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold border border-green-500/30">VERIFIED</span></div>
                <p className="text-xs font-black text-white truncate">{activePurchasePopup.name}</p>
                <p className="text-[10px] text-blue-300 font-bold truncate mt-0.5">📦 {activePurchasePopup.product}</p>
                <p className="text-[9px] text-gray-500 mt-1.5 font-mono">🕐 {formatDateTime(activePurchasePopup.createdAt)}</p>
              </div>
              <button onClick={()=>{setPurchaseLeaving(true);setTimeout(()=>setActivePurchasePopup(null),400)}} className="text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0 -mt-1"><X size={14}/></button>
            </div>
          </div>
        </div>
      )}

      {!isAnyModalOpen&&activeFomo&&(
        <div className={`fixed z-[90] max-w-xs ${fomoLeaving?'fomo-out':'fomo-in'}`} style={{top:'90px',left:'16px'}}>
          <div className="rounded-2xl p-4 flex items-center gap-3" style={{background:'rgba(6,12,30,.90)',backdropFilter:'blur(22px)',border:'1px solid rgba(234,179,8,.35)',boxShadow:'0 0 20px rgba(234,179,8,.2),0 8px 30px rgba(0,0,0,.5)'}}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{background:'rgba(234,179,8,.15)',border:'1px solid rgba(234,179,8,.4)',boxShadow:'0 0 12px rgba(234,179,8,.3)'}}><Crown size={18} className="text-yellow-400" style={{filter:'drop-shadow(0 0 4px rgba(234,179,8,.8))'}}/></div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">🛒 PEMBELIAN BARU</span>
              <p className="text-xs font-bold text-white truncate">{activeFomo.name}</p>
              <p className="text-[10px] text-blue-300 font-bold truncate">{activeFomo.product}</p>
              <p className="text-[8px] text-gray-500 mt-1 font-mono">{formatDateTime(activeFomo.createdAt)}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full z-[80] glass-nav" style={{borderBottom:'1px solid rgba(255,255,255,.07)',boxShadow:'0 4px 24px rgba(0,0,0,.6)'}}>
        <div className="py-1.5 px-4 text-center flex justify-center items-center gap-2" style={{background:'linear-gradient(90deg,#7f1d1d,#c2410c,#7f1d1d)',borderBottom:'1px solid rgba(255,100,50,.25)'}}>
          <Flame size={14} className="text-yellow-300" style={{filter:'drop-shadow(0 0 4px #fbbf24)',animation:'fireFlicker .7s ease infinite'}}/>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">FLASH SALE BERAKHIR DALAM:</span>
          <span className="bg-black/50 px-2 py-0.5 rounded text-[10px] md:text-xs font-mono font-black text-yellow-300 border border-white/20" style={{textShadow:'0 0 8px #fbbf24'}}>{fmt(timeLeft)}</span>
        </div>
        <div className="px-4 md:px-6 py-3 flex justify-between items-center gap-3">
          <div className="text-xl md:text-2xl font-black cursor-pointer tracking-tighter hover:scale-105 transition-transform flex-shrink-0" onClick={()=>window.location.reload()}>VinzSky<span className="text-blue-400" style={{textShadow:'0 0 10px rgba(96,165,250,.8)'}}>-shopID</span></div>
          <div className="hidden md:flex flex-1 max-w-md rounded-full px-4 py-2 transition-all focus-within:shadow-[0_0_0_2px_rgba(59,130,246,.5)]" style={{background:'rgba(0,0,0,.38)',border:'1px solid rgba(255,255,255,.09)'}}>
            <Search size={18} className="text-blue-400 mr-2 flex-shrink-0"/>
            <input type="text" placeholder="Cari software..." className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500" onChange={e=>setSearchQuery(e.target.value)}/>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full visitor-pulse" style={{background:'rgba(34,197,94,.08)',border:'1px solid rgba(34,197,94,.25)',boxShadow:'0 0 10px rgba(34,197,94,.12)'}}>
            <Eye size={12} className="text-green-400" style={{filter:'drop-shadow(0 0 3px #22c55e)'}}/>
            <span className="text-[10px] font-black text-green-400">{visitorCount}</span>
            <span className="text-[9px] text-green-600 uppercase font-bold">Online</span>
          </div>
          <div className="flex gap-2 md:gap-3 items-center flex-shrink-0">
            {authUser && isAdminUser(authUser) && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition-transform"
                style={{background:'linear-gradient(135deg,rgba(255,215,0,.18),rgba(255,100,0,.1))',border:'1px solid rgba(255,215,0,.5)',boxShadow:'0 0 12px rgba(255,215,0,.2)'}}>
                <span style={{fontSize:11}}>⚡</span>
                <span className="text-[10px] font-black" style={{background:'linear-gradient(90deg,#FFD700,#FF8C00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:1}}>GOD MODE</span>
              </div>
            )}
            {authUser && !isAdminUser(authUser) && isVipMember && vipTierInfo && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full hover:scale-105 transition-transform"
                style={{background:vipTierInfo.diamondBg||'rgba(251,191,36,.15)',border:`1px solid ${vipTierInfo.diamondColor||'#fbbf24'}60`}}>
                <DiamondIcon color={vipTierInfo.diamondColor||'#fbbf24'} glow={vipTierInfo.diamondGlow||'rgba(251,191,36,.5)'} size={15} animate/>
                <span className="text-[10px] font-black uppercase" style={{color:vipTierInfo.diamondColor||'#fbbf24'}}>{vipTierInfo.tierName}</span>
              </div>
            )}
            <button onClick={()=>setShowAuthModal(true)} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={authUser
                ? {background:isAdminUser(authUser)?'rgba(239,68,68,.15)':'rgba(34,197,94,.12)',border:isAdminUser(authUser)?'1px solid rgba(239,68,68,.4)':'1px solid rgba(34,197,94,.3)'}
                : {background:'rgba(59,130,246,.12)',border:'1px solid rgba(59,130,246,.28)',color:'#93c5fd'}}>
              {authUser ? <>
                {authUser.user_metadata?.avatar_url
                  ? <img src={authUser.user_metadata.avatar_url} className="w-6 h-6 rounded-full object-cover flex-shrink-0" style={{border:isAdminUser(authUser)?'1.5px solid rgba(239,68,68,.6)':'1.5px solid rgba(34,197,94,.5)'}} alt="av"/>
                  : <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{background:isAdminUser(authUser)?'linear-gradient(135deg,#dc2626,#7c3aed)':'linear-gradient(135deg,#1d4ed8,#7c3aed)'}}>{(authUser.user_metadata?.full_name||authUser.email||'U')[0].toUpperCase()}</div>
                }
                <span className="text-[10px] font-black truncate max-w-[80px]" style={{color:isAdminUser(authUser)?'#f87171':'#4ade80'}}>
                  {isAdminUser(authUser)?'ADMIN':authUser.user_metadata?.full_name?.split(' ')[0]||authUser.email?.split('@')[0]}
                </span>
              </> : <><LogIn size={14}/><span className="text-[10px] font-black">Login</span></>}
            </button>
            <div className="relative cursor-pointer hover:scale-110 hover:text-blue-400 text-gray-300 transition-all" onClick={()=>{setShowNotif(!showNotif);setUnreadCount(0)}}>
              <Bell size={22} className={unreadCount>0?'animate-bounce text-blue-400':''}/>
              {unreadCount>0&&<span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
            </div>
            <div className="relative cursor-pointer hover:scale-110 hover:text-blue-400 text-gray-300 transition-all" onClick={()=>cart.length?setShowCheckout(true):alert('Keranjang kosong!')}>
              <ShoppingCart size={22} className={cart.length?'text-blue-400':''}/>
              <span className={`absolute -top-1.5 -right-1.5 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center border border-[#020610] ${cart.length?'bg-blue-600':'bg-gray-600'}`}>{cart.length}</span>
            </div>
            <div className="relative py-2">
              <MoreVertical size={24} className={`cursor-pointer transition-colors ${isMobileMenuOpen?'text-white':'text-gray-300 hover:text-white'}`} onClick={()=>setIsMobileMenuOpen(!isMobileMenuOpen)}/>
              {isMobileMenuOpen&&<div className="fixed inset-0 z-[400]" onClick={()=>setIsMobileMenuOpen(false)}/>}
              <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden z-[500] transition-all shadow-[0_10px_60px_rgba(0,0,0,.95)] ${isMobileMenuOpen?'opacity-100 visible translate-y-0':'opacity-0 invisible -translate-y-2'}`}
                style={{background:'rgba(4,8,24,.98)',backdropFilter:'blur(32px)',border:'1px solid rgba(255,255,255,.09)'}}>
                <div className="p-4" style={{background:isAdminUser(authUser)?'linear-gradient(135deg,rgba(239,68,68,.12),rgba(124,58,237,.08))':'linear-gradient(135deg,rgba(37,99,235,.1),rgba(124,58,237,.06))',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                  {authUser ? (
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        {authUser.user_metadata?.avatar_url
                          ? <img src={authUser.user_metadata.avatar_url} className="w-11 h-11 rounded-full object-cover" style={{border:isAdminUser(authUser)?'2px solid rgba(239,68,68,.7)':'2px solid rgba(34,197,94,.6)'}} alt="av"/>
                          : <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-black" style={{background:isAdminUser(authUser)?'linear-gradient(135deg,#dc2626,#7c3aed)':'linear-gradient(135deg,#1d4ed8,#7c3aed)',border:isAdminUser(authUser)?'2px solid rgba(239,68,68,.6)':'2px solid rgba(34,197,94,.5)'}}>{(authUser.user_metadata?.full_name||authUser.email||'U')[0].toUpperCase()}</div>
                        }
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#040818] animate-pulse" style={{background:isAdminUser(authUser)?'#f87171':'#4ade80'}}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white font-black truncate">{authUser.user_metadata?.full_name||authUser.email?.split('@')[0]||'Member'}</p>
                        <p className="text-[10px] truncate mt-0.5" style={{color:'rgba(255,255,255,.4)'}}>{authUser.email}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {isAdminUser(authUser)
                            ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black" style={{background:'rgba(239,68,68,.15)',border:'1px solid rgba(239,68,68,.4)',color:'#f87171'}}>⚡ ADMIN</span>
                            : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black" style={{background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.3)',color:'#4ade80'}}>● Member Aktif</span>
                          }
                          {!isAdminUser(authUser)&&isVipMember&&vipTierInfo&&(
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black" style={{background:vipTierInfo.diamondBg,border:`1px solid ${vipTierInfo.diamondColor}50`,color:vipTierInfo.diamondColor}}>
                              <DiamondIcon color={vipTierInfo.diamondColor} glow={vipTierInfo.diamondGlow} size={9}/>
                              {vipTierInfo.tierName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{background:'rgba(59,130,246,.15)',border:'1px solid rgba(59,130,246,.3)'}}><UserCircle size={22} className="text-blue-400"/></div>
                      <div><p className="text-[12px] font-black text-blue-400">Guest Mode</p><p className="text-[10px] mt-0.5" style={{color:'rgba(255,255,255,.3)'}}>Login untuk akses semua fitur</p></div>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-2.5 pt-2" style={{borderTop:'1px solid rgba(255,255,255,.05)'}}><Eye size={10} className="text-green-400"/><span className="text-[9px] text-green-400 font-black">{visitorCount} Online Sekarang</span></div>
                </div>
                <div className="p-1.5">
                  <button onClick={()=>{setShowAuthModal(true);setIsMobileMenuOpen(false)}} className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-xl flex items-center gap-3 font-bold text-gray-300 hover:text-white transition-all">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(59,130,246,.15)',border:'1px solid rgba(59,130,246,.2)'}}><LogIn size={15} className="text-blue-400"/></div>
                    <div><p className="text-[12px] font-black">{authUser?'Profil & Akun':'Login / Daftar'}</p><p className="text-[9px]" style={{color:'rgba(255,255,255,.3)'}}>{authUser?'Lihat detail akun':'Masuk dengan Google'}</p></div>
                  </button>
                  {isAdminUser(authUser)&&(
                    <button onClick={()=>{window.open('/admin','_blank');setIsMobileMenuOpen(false)}} className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 font-bold transition-all" style={{background:'rgba(239,68,68,.06)',margin:'2px 0'}}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(239,68,68,.2)',border:'1px solid rgba(239,68,68,.4)'}}>🛡️</div>
                      <div className="flex-1"><p className="text-[12px] font-black" style={{color:'#fca5a5'}}>Admin Portal</p><p className="text-[9px]" style={{color:'rgba(239,68,68,.5)'}}>Dashboard & kelola toko</p></div>
                      <span className="text-[8px] px-2 py-0.5 rounded-full font-black" style={{background:'rgba(239,68,68,.2)',color:'#f87171',border:'1px solid rgba(239,68,68,.3)'}}>OPEN</span>
                    </button>
                  )}
                  <button onClick={()=>{setActiveMenu('hwid');setIsMobileMenuOpen(false)}} className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-xl flex items-center gap-3 font-bold text-gray-300 hover:text-white transition-all">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(234,179,8,.12)',border:'1px solid rgba(234,179,8,.2)'}}><Key size={15} className="text-yellow-500"/></div>
                    <div><p className="text-[12px] font-black">Data Lisensi HWID</p><p className="text-[9px]" style={{color:'rgba(255,255,255,.3)'}}>Cek license key aktif</p></div>
                  </button>
                  <button onClick={()=>{setActiveMenu('history');setIsMobileMenuOpen(false)}} className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-xl flex items-center gap-3 font-bold text-gray-300 hover:text-white transition-all">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.2)'}}><History size={15} className="text-emerald-500"/></div>
                    <div><p className="text-[12px] font-black">G-Drive & Riwayat</p><p className="text-[9px]" style={{color:'rgba(255,255,255,.3)'}}>Download software & invoice</p></div>
                  </button>
                  <button onClick={()=>{setShowOrderStatus(true);setIsMobileMenuOpen(false)}} className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-xl flex items-center gap-3 font-bold text-gray-300 hover:text-white transition-all">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(59,130,246,.12)',border:'1px solid rgba(59,130,246,.2)'}}><ShoppingCart size={15} className="text-blue-400"/></div>
                    <div><p className="text-[12px] font-black">Status Pesanan</p><p className="text-[9px]" style={{color:'rgba(255,255,255,.3)'}}>Cek progress pembelian</p></div>
                  </button>
                  {authUser&&<>
                    <div style={{height:1,background:'rgba(255,255,255,.06)',margin:'6px 4px'}}/>
                    <button onClick={()=>{handleLogout();setIsMobileMenuOpen(false)}} className="w-full text-left px-3 py-2.5 hover:bg-red-500/10 rounded-xl flex items-center gap-3 font-bold text-red-400 hover:text-red-300 transition-all">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}><LogOut size={15} className="text-red-400"/></div>
                      <div><p className="text-[12px] font-black">Keluar dari Akun</p><p className="text-[9px]" style={{color:'rgba(239,68,68,.4)'}}>Sign out Google</p></div>
                    </button>
                  </>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <div className="flex rounded-full px-4 py-2" style={{background:'rgba(0,0,0,.38)',border:'1px solid rgba(255,255,255,.09)'}}>
            <Search size={16} className="text-blue-400 mr-2 flex-shrink-0"/>
            <input type="text" placeholder="Cari software..." className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500" onChange={e=>setSearchQuery(e.target.value)}/>
          </div>
        </div>
      </nav>

      {showNotif&&(
        <div className="fixed top-36 right-4 md:right-6 z-[9999] w-72 md:w-80 rounded-[2rem] overflow-hidden" style={{background:'rgba(8,15,35,.95)',backdropFilter:'blur(24px)',border:'1px solid rgba(59,130,246,.22)'}}>
          <div className="p-4 flex justify-between items-center" style={{borderBottom:'1px solid rgba(255,255,255,.08)',background:'rgba(37,99,235,.1)'}}>
            <span className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase"><Bell size={12}/>System Logs</span>
            <X size={14} className="cursor-pointer text-gray-400 hover:text-white" onClick={()=>setShowNotif(false)}/>
          </div>
          <div className="mscroll" style={{maxHeight:'220px',padding:'1rem'}}>
            {notifications.length===0?<p className="text-xs text-gray-600 text-center py-6 italic font-bold">No recent logs.</p>:notifications.map((n,i)=>(
              <div key={i} className="mb-3 p-3 rounded-xl" style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.04)'}}>
                <p className="text-[9px] text-blue-400 font-bold mb-1 flex items-center gap-1"><Clock size={10}/>{n.time}</p>
                <p className="text-[11px] text-gray-200">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto p-4 md:p-6 pt-40 md:pt-36 min-h-screen">
        <div className="reveal opacity-0 translate-y-20 mb-12 rounded-[2rem] overflow-hidden relative shadow-[0_0_60px_rgba(0,0,0,.8)]" style={{height:'14rem',border:'1px solid rgba(255,255,255,.07)'}}>
          <Swiper modules={[Autoplay,EffectFade]} effect="fade" autoplay={{delay:3500,disableOnInteraction:false}} speed={1000} loop className="h-full w-full">
            {[{src:'/produk1.jpg',tag:'UPDATE V2.0',tagC:'bg-blue-600',title:'UPSCALE ',hi:'VIDEO 4K',hiC:'text-blue-400'},{src:'/produk2.jpg',tag:'AI POWERED',tagC:'bg-purple-600',title:'ULTRA HIGH ',hi:'PHOTO',hiC:'text-purple-400'},{src:'/produk3.jpg',tag:'ADOBE STOCK',tagC:'bg-orange-600',title:'TOOLS ',hi:'PREMIUM',hiC:'text-orange-400'}].map((sl,i)=>(
              <SwiperSlide key={i}>
                <div className="relative w-full h-full bg-[#020610]">
                  <img src={sl.src} onError={e=>{e.target.onerror=null;e.target.src='/produk1.jpg'}} className="w-full h-full object-cover opacity-45"/>
                  <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(2,6,16,1) 0%,rgba(2,6,16,.5) 50%,transparent 100%)'}}/>
                  <div className="absolute bottom-8 left-8 z-20">
                    <span className={`${sl.tagC} text-white text-[10px] font-bold px-3 py-1 rounded-full mb-2 inline-block`}>{sl.tag}</span>
                    <h2 className="text-2xl md:text-4xl font-black italic text-white tracking-wide">{sl.title}<span className={sl.hiC}>{sl.hi}</span></h2>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-black flex items-center gap-3 italic"><Star className="text-blue-500 fill-blue-500"/>Exclusive Tools</h2>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{background:'rgba(34,197,94,.08)',border:'1px solid rgba(34,197,94,.22)',boxShadow:'0 0 12px rgba(34,197,94,.1)'}}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{boxShadow:'0 0 6px #22c55e'}}/>
            <Eye size={13} className="text-green-400"/>
            <span className="text-xs font-black text-green-400">{visitorCount}</span>
            <span className="text-[10px] text-green-600 font-bold">pengunjung aktif sekarang</span>
          </div>
        </div>

        {isLoadingDB?(
          <div className="w-full text-center py-20 flex flex-col items-center"><Clock className="text-blue-500 animate-spin mb-4" size={48}/><p className="text-blue-400 font-black animate-pulse tracking-widest">MENYIAPKAN DATABASE SULTAN...</p></div>
        ):dbError?(
          <div className="w-full rounded-3xl p-8 text-center mb-20" style={{background:'rgba(120,0,0,.22)',border:'1px solid rgba(220,38,38,.35)'}}><p className="text-red-400 font-black text-xl mb-2">GAGAL TERHUBUNG KE DATABASE!</p><p className="text-red-300 text-sm">{dbError}</p></div>
        ):(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filtered.length===0?<div className="w-full text-center py-20 col-span-full"><p className="text-gray-500 italic">Belum ada produk.</p></div>:filtered.map(p=>{
              const fp=calcPrice(p.price,p); const pvc=viewCounts[p.id]||0
              return(
                <div key={p.id} className="reveal opacity-0 translate-y-20">
                  <div onClick={()=>{setSelectedProduct(p);setSelectedDuration(DURATIONS[3]);trackProductView(p.id)}} className="neon-card relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl flex flex-col h-full" style={{background:'rgba(6,10,28,.75)',backdropFilter:'blur(20px) saturate(160%)'}}>
                    <div className="overflow-hidden relative bg-black" style={{height:'12rem'}}>
                      <div className="absolute inset-0 z-10" style={{background:'linear-gradient(to top,rgba(6,10,28,1) 0%,rgba(6,10,28,.15) 55%,transparent 100%)'}}/>
                      {p.videoUrl&&p.videoUrl!==''&&p.videoUrl!=='#'
                        ?<video src={p.videoUrl} autoPlay loop muted playsInline preload="metadata" className="w-full h-full object-cover opacity-85 pointer-events-none" style={{willChange:'transform',transform:'translateZ(0)'}} onCanPlay={e=>e.target.play().catch(()=>{})} onError={e=>{const parent=e.target.parentNode;const img=document.createElement('img');img.src=p.image||'/produk1.jpg';img.style.cssText='width:100%;height:100%;object-fit:cover;position:absolute;inset:0;opacity:.7';parent.appendChild(img);e.target.style.display='none';}}/>
                        :<img src={p.image} onError={e=>{e.target.onerror=null;e.target.src='/produk1.jpg'}} className="w-full h-full object-cover opacity-75"/>
                      }
                      <span className="absolute top-3 right-3 z-20 text-[9px] font-bold px-2.5 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1" style={{background:'rgba(0,0,0,.55)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,.12)'}}><Percent size={10}/>AI Power</span>
                      {p.isFlashSale&&<span className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full uppercase animate-pulse" style={{boxShadow:'0 0 12px rgba(239,68,68,.6)'}}>⚡ Flash Sale</span>}
                      {pvc>0&&<span className="absolute bottom-3 left-3 z-20 flex items-center gap-1 text-[8px] font-bold px-2 py-1 rounded-full" style={{background:'rgba(0,0,0,.6)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,.1)'}}><Eye size={9} className="text-blue-300"/><span className="text-blue-300">{pvc}</span></span>}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-black mb-2">{p.name}</h3>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-black text-xl fire-price text-blue-300">Rp {fp.toLocaleString()}</p>
                          {(isVipMember||hasExitPromo||p.isFlashSale||(p.discountAktif&&p.discountPersen>0))&&<p className="text-xs text-gray-500 line-through">Rp {(p.originalPrice||p.price).toLocaleString()}</p>}
                        </div>
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {isVipMember&&!hasExitPromo&&<span className="text-[8px] px-2 py-0.5 rounded font-black flex items-center gap-1 fire-discount" style={{background:'rgba(168,85,247,.15)',border:'1px solid rgba(168,85,247,.4)',color:'#c084fc'}}><Crown size={8}/>VIP -{p.discountVip||5}%</span>}
                          {hasExitPromo&&<span className="text-[8px] px-2 py-0.5 rounded font-black fire-discount" style={{background:'rgba(168,85,247,.15)',border:'1px solid rgba(168,85,247,.4)',color:'#c084fc'}}>EXIT -{p.discountExit||10}%</span>}
                          {p.discountAktif&&p.discountLabel&&<span className="text-[8px] px-2 py-0.5 rounded font-black" style={{background:'rgba(239,68,68,.15)',border:'1px solid rgba(239,68,68,.4)',color:'#f87171',textShadow:'0 0 6px rgba(239,68,68,.6)'}}>{p.discountLabel}</span>}
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-[9px] font-bold mb-1.5 uppercase tracking-widest">
                          <span className="flex items-center gap-1 text-orange-400" style={{textShadow:'0 0 6px rgba(249,115,22,.7)'}}><Flame size={10} style={{filter:'drop-shadow(0 0 3px #f97316)'}}/>Sangat Diminati</span>
                          <span className="text-red-400" style={{textShadow:'0 0 6px rgba(239,68,68,.6)'}}>Sisa {p.stock} LISENSI</span>
                        </div>
                        <div className="w-full rounded-full h-2 overflow-hidden" style={{background:'rgba(255,255,255,.06)'}}><div className="fire-bar h-full rounded-full" style={{width:(p.stock||50)+'%'}}/></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="pt-10" style={{borderTop:'1px solid rgba(255,255,255,.07)'}}>
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic justify-center"><Quote className="text-yellow-500 fill-yellow-500"/>VinzSky-shopID Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publicReviews.length===0?<div className="w-full text-center py-10 col-span-full rounded-[2rem]" style={{border:'1px dashed rgba(255,255,255,.08)'}}><p className="text-gray-500 italic font-bold">Belum ada review.</p></div>:publicReviews.map((rev,i)=>(
              <div key={i} className="reveal opacity-0 translate-y-20">
                <div className="neon-card p-6 rounded-[2rem] h-full flex flex-col" style={{background:'rgba(6,10,26,.75)',backdropFilter:'blur(18px) saturate(150%)'}}>
                  <div className="flex items-center gap-2 mb-3">{[...Array(5)].map((_,j)=><Star key={j} size={16} className={j<(rev.rating||5)?'text-yellow-500 fill-yellow-500':'text-gray-600'} style={j<(rev.rating||5)?{filter:'drop-shadow(0 0 4px #eab308)'}:{}}/>)}</div>
                  <p className="text-sm text-gray-300 italic mb-4 leading-relaxed">"{rev.review_text||rev.text||'...'}"</p>
                  <div className="flex justify-between items-end mt-auto">
                    <div className="flex items-center gap-2">
                      {/* Avatar */}
                      {rev.buyer_avatar
                        ? <img src={rev.buyer_avatar} alt="av" className="w-8 h-8 rounded-full object-cover flex-shrink-0" style={{border:'1.5px solid rgba(59,130,246,.4)'}}/>
                        : <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{background:'linear-gradient(135deg,#1d4ed8,#7c3aed)',border:'1.5px solid rgba(59,130,246,.4)'}}>
                            {(rev.name||'G')[0].toUpperCase()}
                          </div>
                      }
                      <div>
                        <p className="font-black text-sm">{rev.name||'Pelanggan'}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {/* Tier badge */}
                          {(()=>{const t=DURATIONS.find(d=>d.code===(rev.tier_code||'7D'))||DURATIONS[1];return(
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{background:t.diamondBg||'rgba(96,165,250,.15)',border:`1px solid ${t.diamondColor||'#60a5fa'}40`}}>
                              <DiamondIcon color={t.diamondColor||'#60a5fa'} glow={t.diamondGlow||'rgba(96,165,250,.5)'} size={10}/>
                              <span className="text-[8px] font-black uppercase" style={{color:t.diamondColor||'#60a5fa'}}>{t.tierName}</span>
                            </div>
                          )})()}
                          <p className="text-[9px] text-blue-400 uppercase font-bold">{rev.product||'Produk'}</p>
                        </div>
                      </div>
                    </div>
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" style={{filter:'drop-shadow(0 0 4px #22c55e)'}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-16 text-center mt-10" style={{borderTop:'1px solid rgba(255,255,255,.06)',background:'rgba(2,6,16,.75)',backdropFilter:'blur(20px)'}}>
        <p className="text-[11px] text-gray-500 tracking-[5px] uppercase font-black hover:text-blue-400 transition-colors cursor-default">Tools By | VinzSky-shopID | software engineer | since 2026</p>
      </footer>

      {selectedProduct&&(
        <div className="m-overlay">
          <div className="m-box rounded-[2rem] shadow-[0_0_80px_rgba(37,99,235,.3)]" style={{maxWidth:'960px',background:'rgba(5,9,25,.82)',backdropFilter:'blur(28px) saturate(170%)',border:'1px solid rgba(59,130,246,.25)',display:'flex',flexDirection:'column'}}>
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden rounded-[2rem]">
              <div className="media-panel-fill flex-shrink-0 md:w-[48%] relative" style={{minHeight:'220px',maxHeight:typeof window!=='undefined'&&window.innerWidth>=768?'90vh':'260px'}}>
                {selectedProduct.videoUrl&&selectedProduct.videoUrl!==''&&selectedProduct.videoUrl!=='#'
                  ?<video key={selectedProduct.videoUrl} src={selectedProduct.videoUrl} controls autoPlay playsInline loop preload="auto" style={{width:'100%',height:'100%',objectFit:'cover',display:'block',background:'#000',transform:'translateZ(0)'}} onLoadStart={e=>{e.target.style.opacity='.5'}} onCanPlay={e=>{e.target.style.opacity='1';e.target.play().catch(()=>{})}} onError={e=>{e.target.style.display='none';const img=document.createElement('img');img.src=selectedProduct.image||'/produk1.jpg';img.style.cssText='width:100%;height:100%;object-fit:cover;position:absolute;inset:0;opacity:.7';e.target.parentNode.appendChild(img)}}/>
                  :<img src={selectedProduct.image} onError={e=>{e.target.onerror=null;e.target.src='/produk1.jpg'}} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',opacity:.78}}/>
                }
                {selectedProduct.videoUrl&&selectedProduct.videoUrl!==''&&selectedProduct.videoUrl!=='#'&&(
                  <button onClick={()=>setFullscreenVideo(selectedProduct.videoUrl)} className="absolute bottom-4 right-4 z-30 flex items-center gap-2 text-white font-black text-[11px] uppercase tracking-widest rounded-xl px-3 py-2.5 transition-all hover:scale-105" style={{background:'rgba(0,0,0,.75)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,.28)',boxShadow:'0 4px 20px rgba(0,0,0,.7)'}}>
                    <Maximize2 size={14}/>Full Screen
                  </button>
                )}
                <div className="absolute inset-y-0 right-0 w-10 pointer-events-none hidden md:block" style={{background:'linear-gradient(to right,transparent,rgba(5,9,25,.88))'}}/>
                <div className="absolute inset-x-0 bottom-0 h-14 pointer-events-none md:hidden" style={{background:'linear-gradient(to top,rgba(5,9,25,1),transparent)'}}/>
              </div>
              <div className="flex-1 mscroll p-5 md:p-7 flex flex-col relative" style={{maxHeight:'90vh'}}>
                <button onClick={handleCloseProduct} className="absolute top-4 right-4 rounded-full p-2 z-50 transition-colors hover:bg-white/10" style={{background:'rgba(255,255,255,.07)'}}><X size={18}/></button>
                <div className="flex items-center gap-3 mb-3 mt-1 md:mt-0 flex-wrap">
                  <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest" style={{background:'rgba(37,99,235,.18)',color:'rgba(147,197,253,1)',border:'1px solid rgba(59,130,246,.25)'}}>AI Exclusive</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold animate-pulse" style={{color:'#f87171',textShadow:'0 0 6px rgba(248,113,113,.5)'}}><Users size={12}/>{(viewCounts[selectedProduct.id]||0)+Math.floor(Math.random()*5)+8} Orang melihat ini</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black mb-3 leading-tight">{selectedProduct.name}</h2>
                <div className="mb-3 p-3 rounded-xl" style={{background:'rgba(0,0,0,.35)',border:'1px solid rgba(255,255,255,.06)'}}>
                  <div className="flex justify-between text-[9px] font-bold mb-2 uppercase tracking-widest">
                    <span className="flex items-center gap-1 text-orange-400" style={{textShadow:'0 0 6px rgba(249,115,22,.7)'}}><Flame size={12} style={{filter:'drop-shadow(0 0 3px #f97316)'}}/>Sangat Diminati</span>
                    <span className="text-red-400" style={{textShadow:'0 0 6px rgba(239,68,68,.5)'}}>SISA {selectedProduct.stock} LISENSI</span>
                  </div>
                  <div className="w-full rounded-full h-2.5 overflow-hidden" style={{background:'rgba(255,255,255,.07)'}}><div className="fire-bar h-full rounded-full" style={{width:(selectedProduct.stock||99)+'%'}}/></div>
                </div>
                <div className="mb-3 p-3 rounded-xl" style={{background:'rgba(0,0,0,.25)',border:'1px solid rgba(255,255,255,.05)'}}>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">Deskripsi Produk</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{selectedProduct.desc}</p>
                  {selectedProduct.category&&<p className="text-[9px] text-gray-500 mt-2 font-bold">Kategori: <span className="text-blue-400">{selectedProduct.category}</span></p>}
                </div>
                {selectedProduct.isLifetime?(
                  <div className="p-3 rounded-xl text-center mb-3" style={{background:'rgba(0,80,40,.20)',border:'1px solid rgba(34,197,94,.30)'}}><p className="text-green-400 font-black text-sm uppercase flex justify-center items-center gap-2"><CheckCircle size={16}/>LISENSI LIFETIME</p></div>
                ):(
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {DURATIONS.map(d=>(
                      <button key={d.code} onClick={()=>setSelectedDuration(d)} className={`p-2.5 rounded-xl text-[10px] font-black border transition-all flex flex-col items-center gap-1.5 ${selectedDuration.code===d.code?'scale-105':''}`}
                        style={selectedDuration.code===d.code?{background:d.diamondBg,border:`1px solid ${d.diamondColor}80`,boxShadow:`0 0 12px ${d.diamondGlow}`,color:d.diamondColor}:{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',color:'rgba(255,255,255,.4)'}}>
                        <DiamondIcon color={selectedDuration.code===d.code?d.diamondColor:'rgba(255,255,255,.3)'} glow={selectedDuration.code===d.code?d.diamondGlow:'transparent'} size={18} animate={selectedDuration.code===d.code}/>
                        <span className="font-black">{d.tierName}</span>
                        <span className="text-[9px] opacity-70">{d.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center mb-4 pt-3" style={{borderTop:'1px solid rgba(255,255,255,.07)'}}>
                  <span className="text-xs font-bold text-gray-500 italic">Harga Final:</span>
                  <div className="text-right">
                    {(isVipMember||hasExitPromo||selectedProduct.isFlashSale||(selectedProduct.discountAktif&&selectedProduct.discountPersen>0))&&<p className="text-xs text-gray-500 line-through mb-1">Rp {(selectedProduct.originalPrice||selectedProduct.price).toLocaleString()}</p>}
                    <span className={`text-2xl md:text-3xl font-black ${hasExitPromo?'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 animate-pulse':'fire-price text-blue-300'}`}>
                      Rp {(calcPrice(selectedProduct.price,selectedProduct)*selectedDuration.multiplier).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-auto">
                  <button onClick={()=>handleProductAction(selectedProduct,selectedDuration,'cart')} disabled={isCheckingTrial} className="btn-cart disabled:opacity-50">
                    {isCheckingTrial?<Clock className="animate-spin" size={16}/>:<ShoppingCart size={16}/>}<span className="font-black text-sm">Keranjang</span>
                  </button>
                  <button onClick={()=>handleProductAction(selectedProduct,selectedDuration,'buy')} disabled={isCheckingTrial} className="btn-buy disabled:opacity-50">{isCheckingTrial?'Memproses...':'Beli Sekarang'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCheckout&&(
        <div className="m-overlay">
          <div className="m-box w-full max-w-md rounded-[2rem]" style={{background:'rgba(5,9,25,.82)',backdropFilter:'blur(28px) saturate(170%)',border:'1px solid rgba(59,130,246,.22)',boxShadow:'0 0 60px rgba(37,99,235,.2)'}}>
            <div className="flex justify-between items-center p-5 pb-4 flex-shrink-0" style={{borderBottom:'1px solid rgba(255,255,255,.07)'}}>
              <h2 className="text-xl font-black flex gap-3 items-center"><ShieldCheck className="text-blue-500"/>Checkout</h2>
              <button onClick={handleCloseCheckout} className="rounded-full p-2 hover:bg-white/10" style={{background:'rgba(255,255,255,.06)'}}><X size={18}/></button>
            </div>
            <div className="mscroll p-5 pt-4" style={{maxHeight:'calc(92vh - 68px)'}}>
              <p className="text-xs text-blue-400 italic mb-4 text-center font-bold">"Langkah terakhir menuju produktivitas tanpa batas. Selesaikan sekarang Bosku!"</p>
              {!authUser&&(
                <div className="mb-4 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:scale-[1.01] transition-all" onClick={()=>setShowAuthModal(true)} style={{background:'rgba(59,130,246,.08)',border:'1px solid rgba(59,130,246,.2)'}}>
                  <LogIn size={16} className="text-blue-400 flex-shrink-0"/>
                  <div><p className="text-[11px] font-black text-blue-400">Login untuk checkout lebih cepat</p><p className="text-[9px] text-gray-500">Email & nama otomatis terisi dari akun Google</p></div>
                </div>
              )}
              <div className="p-4 rounded-2xl mb-4" style={{background:'rgba(0,0,0,.32)',border:'1px solid rgba(255,255,255,.06)'}}>
                {cart.map((c,i)=>(
                  <div key={i} className="flex justify-between items-center mb-3 pb-3 p-2 rounded-lg hover:bg-white/5 transition-colors last:mb-0 last:pb-0 last:border-0" style={{borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                    <div className="flex-1 pr-2"><p className="text-xs text-white font-bold truncate">{c.name}</p><p className={`text-[10px] ${c.color} ${c.bg} border ${c.border} inline-flex items-center gap-1 px-1.5 py-0.5 rounded mt-1`}>{c.tierName} - {c.durationLabel}</p></div>
                    <div className="flex items-center gap-3"><p className="text-sm font-black text-emerald-400" style={{textShadow:'0 0 8px rgba(52,211,153,.4)'}}>Rp {c.finalPrice.toLocaleString()}</p><button onClick={()=>removeFromCart(i)} className="text-red-500/50 hover:text-red-400 transition-colors"><X size={16}/></button></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-5 p-4 rounded-2xl" style={{background:'linear-gradient(135deg,rgba(37,99,235,.15),rgba(0,0,0,.1))',border:'1px solid rgba(59,130,246,.18)'}}>
                <span className="text-sm text-gray-300 font-bold uppercase tracking-widest">Total Tagihan</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">Rp {cart.reduce((s,i)=>s+i.finalPrice,0).toLocaleString('id-ID')}</span>
              </div>
              <div className="space-y-3 mb-5">
                {[{icon:<UserCircle size={15}/>,ph:'Nama Lengkap Anda',val:customerName,set:setCustomerName,type:'text'},{icon:<Phone size={15}/>,ph:'WhatsApp Aktif',val:customerWA,set:setCustomerWA,type:'tel'},{icon:<Mail size={15}/>,ph:'Email Aktif',val:customerEmail,set:setCustomerEmail,type:'email'}].map((f,i)=>(
                  <div key={i} className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">{f.icon}</div><input placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} type={f.type} className="inp"/></div>
                ))}
              </div>
              {cart.reduce((s,i)=>s+i.finalPrice,0)>0&&(
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[{key:'midtrans',icon:<Landmark size={20}/>,label:'QRIS / VA / E-Wallet'},{key:'paypal',icon:<Wallet size={20} className="text-blue-400"/>,label:'PayPal'}].map(pm=>(
                      <button key={pm.key} onClick={()=>setPayMethod(pm.key)} className={`font-bold py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-[10px] uppercase tracking-widest ${payMethod===pm.key?'bg-blue-600 text-white border border-blue-400 scale-105':'text-gray-400 hover:text-white'}`} style={payMethod!==pm.key?{background:'rgba(30,41,59,.55)',border:'1px solid rgba(255,255,255,.07)'}:{}}>{pm.icon}{pm.label}</button>
                    ))}
                  </div>
                  <div className="rounded-2xl p-5 mb-4 text-center" style={{background:'rgba(0,0,0,.30)',border:'1px solid rgba(255,255,255,.06)'}}>
                    {payMethod==='midtrans'&&<div className="flex flex-col items-center"><ShieldCheck size={36} className="text-emerald-400 mb-3" style={{filter:'drop-shadow(0 0 8px rgba(52,211,153,.5))'}}/><p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest">Secure Auto-Payment</p><p className="text-xs text-gray-300 leading-relaxed px-2">QRIS, Virtual Account, atau E-Wallet pilihan Anda.</p></div>}
                    {payMethod==='paypal'&&<div className="flex flex-col items-center"><Wallet size={36} className="text-blue-400 mb-3" style={{filter:'drop-shadow(0 0 8px rgba(96,165,250,.5))'}}/><p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest">Send Payment To:</p><p className="text-lg font-black tracking-widest mb-4">@moh.bashory1992</p><a href={`https://paypal.me/mohbashory1992/${Math.ceil(cart.reduce((s,i)=>s+i.finalPrice,0)/15500)}USD`} target="_blank" className="bg-[#0070ba] hover:bg-[#003087] text-white text-xs font-black py-2.5 px-6 rounded-full transition-colors flex items-center gap-2">Buka Aplikasi PayPal</a><p className="text-[8px] text-gray-500 mt-4 italic">*Screenshot bukti transfer setelah bayar</p></div>}
                  </div>
                  {payMethod==='paypal'&&<div className="mb-4 p-4 rounded-2xl group" style={{background:'rgba(0,0,0,.25)',border:'1px solid rgba(255,255,255,.07)'}}><label htmlFor="file-upload" className="flex items-center justify-center cursor-pointer"><div className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-blue-400 transition-colors font-bold"><Upload size={20}/>{buktiBayar?<span className="text-emerald-400 truncate max-w-[200px]">{buktiBayar.name}</span>:'Upload Bukti Bayar'}</div></label><input id="file-upload" type="file" accept="image/*" className="hidden" onChange={e=>setBuktiBayar(e.target.files[0])}/></div>}
                </>
              )}
              <button onClick={eksekusiPembayaran} disabled={isSending||cart.length===0} className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02]" style={{background:'linear-gradient(135deg,#1d4ed8,#4f46e5)',boxShadow:'0 0 20px rgba(37,99,235,.5),0 0 40px rgba(79,70,229,.25)'}}>
                {isSending?<Clock className="animate-spin" size={20}/>:<Send size={20}/>}
                {isSending?'Processing...':(cart.reduce((s,i)=>s+i.finalPrice,0)>0?(payMethod==='midtrans'?'BAYAR OTOMATIS SEKARANG':'KONFIRMASI PAYPAL'):'KLAIM TRIAL GRATIS')}
              </button>
              <button onClick={clearCart} className="w-full mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-red-400 hover:text-red-300 transition-all" style={{background:'transparent',border:'1px solid rgba(220,38,38,.22)'}}><Trash2 size={16}/>Kosongkan Semua Keranjang</button>
            </div>
          </div>
        </div>
      )}

      {activeMenu==='hwid'&&(
        <div className="m-overlay"><div className="m-box w-full max-w-2xl rounded-[2.5rem]" style={{background:'rgba(5,9,25,.82)',backdropFilter:'blur(28px)',border:'1px solid rgba(255,255,255,.08)',boxShadow:'0 0 60px rgba(234,179,8,.12)'}}>
          <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0" style={{borderBottom:'1px solid rgba(255,255,255,.07)'}}><h2 className="text-2xl font-black flex gap-3 items-center text-yellow-400"><Key/>Data Lisensi HWID</h2><button className="rounded-full p-2 hover:bg-white/10" style={{background:'rgba(255,255,255,.06)'}} onClick={()=>setActiveMenu(null)}><X size={18}/></button></div>
          <div className="mscroll p-6 space-y-6" style={{maxHeight:'calc(92vh - 72px)'}}>
            {historyData.length===0?<div className="text-center py-20"><Key size={48} className="mx-auto text-gray-800 mb-4"/><p className="text-gray-600 font-black italic">BELUM ADA DATA LISENSI</p></div>:historyData.map(trx=>(
              <div key={trx.id} className="p-6 rounded-[2rem]" style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)'}}>
                <div className="p-5 rounded-2xl text-center mb-5" style={{background:'rgba(0,0,0,.40)',border:'1px solid rgba(234,179,8,.18)'}}><p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-widest">Master HWID Device:</p><code className="text-2xl md:text-3xl font-black tracking-wider">{trx.masterHwid}</code></div>
                {trx.hwidItems.map((hw,idx)=>(
                  <div key={idx} className="flex justify-between items-center p-4 rounded-2xl mb-2" style={{background:'rgba(0,0,0,.28)',border:`1px solid ${hw.isSuccess?'rgba(34,197,94,.32)':'rgba(255,255,255,.06)'}`}}>
                    <div className="flex flex-col"><span className="text-sm font-black text-gray-200">{hw.productName}</span><span className={`text-[10px] ${hw.color||'text-gray-500'} ${hw.bg||''} border ${hw.border||'border-white/10'} w-fit px-2 py-0.5 rounded mt-1 flex items-center gap-1`}>{hw.tierName||'Standard'} - {hw.duration}</span></div>
                    {hw.isLifetime?<div className="text-right"><p className="text-[8px] text-green-400 font-black uppercase mb-1">AKTIF</p><code className="text-xs font-black text-green-400 px-3 py-1 rounded-lg" style={{background:'rgba(34,197,94,.10)',border:'1px solid rgba(34,197,94,.30)'}}>LIFETIME</code></div>:hw.isSuccess?<div className="text-right"><p className="text-[8px] text-green-400 font-black uppercase mb-1">AKTIF</p><code className="text-sm font-black text-green-400 px-3 py-1 rounded-lg" style={{background:'rgba(34,197,94,.10)',border:'1px solid rgba(34,197,94,.30)'}}>{hw.keyStatus}</code></div>:<button onClick={()=>handleKlaimKey(trx.id,idx)} className="text-[10px] bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-black uppercase hover:scale-105 transition-all">Klaim Key</button>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div></div>
      )}

      {activeMenu==='history'&&(
        <div className="m-overlay"><div className="m-box w-full max-w-2xl rounded-[2.5rem]" style={{background:'rgba(5,9,25,.82)',backdropFilter:'blur(28px)',border:'1px solid rgba(255,255,255,.08)',boxShadow:'0 0 60px rgba(16,185,129,.1)'}}>
          <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0" style={{borderBottom:'1px solid rgba(255,255,255,.07)'}}><h2 className="text-2xl font-black flex gap-3 text-emerald-400"><History/>G-Drive & Riwayat</h2><button className="rounded-full p-2 hover:bg-white/10" style={{background:'rgba(255,255,255,.06)'}} onClick={()=>setActiveMenu(null)}><X size={18}/></button></div>
          <div className="mscroll p-6 space-y-4" style={{maxHeight:'calc(92vh - 72px)'}}>
            {historyData.length===0?<div className="text-center py-20"><Download size={48} className="mx-auto text-gray-800 mb-4"/><p className="text-gray-600 font-black italic">BELUM ADA RIWAYAT TRANSAKSI</p></div>:historyData.map(trx=>(
              <div key={trx.id} className="p-6 rounded-[2rem]" style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)'}}>
                <div className="flex justify-between text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest p-2 rounded-lg" style={{background:'rgba(0,0,0,.28)'}}><span>ID: {trx.id}</span><span>{trx.date}</span></div>
                {trx.hwidItems.map((h,i)=>{
                  const liveProduct=allProducts.find(p=>p.name===h.productName||p.id===h.id)
                  const zipUrl=safeLink(liveProduct?.zipLink)||safeLink(h.zipLink)||null
                  const pdfUrl=safeLink(liveProduct?.pdfLink)||safeLink(h.pdfLink)||null
                  return(<div key={i} className="mb-4 pt-4" style={{borderTop:'1px solid rgba(255,255,255,.06)'}}>
                    <p className="font-black text-sm mb-3 text-gray-200">{h.productName}</p>
                    {zipUrl?(
                      <><div className="flex gap-2 mb-3"><input readOnly value={zipUrl} className="flex-1 p-3 text-xs text-blue-400 outline-none font-mono rounded-xl" style={{background:'rgba(0,0,0,.34)',border:'1px solid rgba(255,255,255,.08)'}}/><button onClick={()=>{navigator.clipboard.writeText(zipUrl);alert('Link Disalin!')}} className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl text-[10px] font-black flex items-center gap-1 hover:scale-105 transition-all"><Copy size={12}/>COPY</button></div>
                      <div className="flex gap-3"><a href={zipUrl} target="_blank" rel="noopener noreferrer" className="flex-1 p-3 rounded-xl text-center text-[10px] font-black uppercase hover:scale-105 transition-all flex items-center justify-center gap-2 text-blue-400 hover:text-white hover:bg-blue-600" style={{background:'rgba(37,99,235,.12)',border:'1px solid rgba(59,130,246,.38)'}}><HardDrive size={14}/>BUKA G-DRIVE</a>
                      {pdfUrl?<a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1 p-3 rounded-xl text-center text-[10px] font-black uppercase hover:scale-105 transition-all flex items-center justify-center gap-2 text-purple-400 hover:text-white hover:bg-purple-600" style={{background:'rgba(168,85,247,.12)',border:'1px solid rgba(168,85,247,.38)'}}><FileText size={14}/>PDF PANDUAN</a>:<div className="flex-1 p-3 rounded-xl text-center text-[10px] font-black uppercase flex items-center justify-center gap-2 text-gray-600" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)'}}><FileText size={14}/>PDF Belum Ada</div>}</div></>
                    ):(
                      <div className="p-4 rounded-xl text-center" style={{background:'rgba(255,255,255,.03)',border:'1px dashed rgba(255,255,255,.10)'}}><p className="text-[11px] text-gray-500 font-bold">⏳ Link G-Drive belum tersedia</p><p className="text-[9px] text-gray-600 mt-1">Admin akan kirimkan link via WhatsApp setelah verifikasi.</p>{pdfUrl&&<a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-[10px] font-black text-purple-400 hover:text-purple-300 transition-colors"><FileText size={12}/>Download PDF</a>}</div>
                    )}
                  </div>)
                })}
              </div>
            ))}
            {historyData.length>0&&<button onClick={()=>{if(window.confirm('Hapus semua riwayat?')){setHistoryData([]);setIsVipMember(false);setVipTierInfo(null);localStorage.removeItem('vinzsky_history')}}} className="w-full mt-4 p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-gray-600 hover:text-red-400 transition-all" style={{background:'rgba(255,255,255,.03)'}}><Trash2 size={12}/>Bersihkan Data Perangkat</button>}
          </div>
        </div></div>
      )}

      {reviewData&&(
        <div className="m-overlay"><div className="m-box w-full max-w-lg rounded-[3rem]" style={{background:'rgba(5,9,25,.82)',backdropFilter:'blur(28px)',border:'1px solid rgba(234,179,8,.32)',boxShadow:'0 0 60px rgba(234,179,8,.2)'}}>
          <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-[3rem]" style={{background:'linear-gradient(to right,#eab308,#f97316)'}}/>
          <div className="mscroll p-8 text-center" style={{maxHeight:'92vh'}}>
            <Star size={48} className="mx-auto text-yellow-500 fill-yellow-500 mb-4 animate-pulse mt-4" style={{filter:'drop-shadow(0 0 10px #eab308)'}}/>
            <h2 className="text-2xl font-black mb-2 uppercase">Toolsnya udah aktif! 🎉</h2>
            <p className="text-xs text-gray-400 mb-6 font-bold">Kasih bintang 5 dong buat <span className="text-blue-400">{reviewData.productName}</span>!</p>
            <div className="p-4 rounded-2xl mb-6 text-left" style={{background:'rgba(0,0,0,.34)',border:'1px solid rgba(255,255,255,.06)'}}><p className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest">Nama Pembeli:</p><p className="text-sm font-bold uppercase">{reviewData.customerName}</p></div>
            <div className="mb-6"><p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3">Rating Anda</p><div className="flex justify-center gap-2">{[1,2,3,4,5].map(s=><Star key={s} size={32} onClick={()=>setRating(s)} className={`cursor-pointer hover:scale-110 transition-all ${s<=rating?'text-yellow-500 fill-yellow-500':'text-gray-600'}`} style={s<=rating?{filter:'drop-shadow(0 0 5px #eab308)'}:{}}/>)}</div></div>
            <textarea placeholder="Tulis testimoni paling gokil lu Bosku..." value={reviewText} onChange={e=>setReviewText(e.target.value)} className="w-full rounded-2xl p-4 text-sm outline-none text-white h-32 resize-none mb-6" style={{background:'rgba(0,0,0,.34)',border:'1px solid rgba(255,255,255,.09)'}}/>
            <button onClick={submitReview} disabled={isSending} className="w-full py-4 rounded-[1.5rem] font-black text-lg transition-all hover:scale-105 flex justify-center items-center gap-2" style={{background:'linear-gradient(135deg,#d97706,#ea580c)',boxShadow:'0 0 20px rgba(234,179,8,.4)'}}>
              {isSending?<Clock className="animate-spin" size={20}/>:<Send size={20}/>}{isSending?'MENGIRIM...':'KIRIM REVIEW'}
            </button>
          </div>
        </div></div>
      )}

      {showReceipt&&(
        <div className="m-overlay">
          <canvas ref={receiptCanvasRef} className="absolute inset-0 z-0 pointer-events-none"/>
          <div className="m-box w-full max-w-sm rounded-[2rem] z-10" style={{background:'white',color:'black',boxShadow:'0 0 100px rgba(255,255,255,.2)'}}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white p-3 rounded-full z-20 flex items-center justify-center" style={{border:'4px solid rgba(2,6,16,1)',boxShadow:'0 0 20px rgba(34,197,94,.7)'}}><HeartHandshake size={32} strokeWidth={2.5}/></div>
            <div className="mscroll p-6 pb-10 md:p-8 font-mono" style={{maxHeight:'92vh'}}>
              <div className="text-center mb-6 pb-6 pt-6" style={{borderBottom:'2px dashed #d1d5db'}}><h3 className="text-2xl font-black uppercase tracking-tighter text-black">VINZSKY-SHOPID</h3><p className="text-[10px] text-gray-500 mt-1">{showReceipt.date}</p><p className="text-[10px] text-gray-400 mt-1 font-bold inline-block px-2 py-0.5 rounded bg-gray-100">ID: {showReceipt.id}</p></div>
              {showReceipt.customerEmail&&<p className="text-[10px] text-center text-gray-500 mb-2 font-bold">📧 {showReceipt.customerEmail}</p>}
              <p className="text-xs text-center text-blue-600 font-black mb-4">Pesanan SULTAN diproses! Tunggu License Key dari Admin ya! 🎉</p>
              <div className="space-y-3 mb-6 text-xs font-bold pb-6" style={{borderBottom:'1px solid #e5e7eb'}}>
                {showReceipt.hwidItems.map((item,idx)=>(<div key={idx} className="flex justify-between items-end p-2 rounded-lg bg-gray-50"><div className="flex flex-col"><span className="truncate max-w-[150px] text-black">{item.productName}</span><span className="text-[9px] text-gray-500">{item.duration}</span></div></div>))}
                <div className="pt-4 flex justify-between items-center font-black text-sm p-3 rounded-xl" style={{background:'#eff6ff',border:'1px solid #bfdbfe',color:'#2563eb'}}><span>TOTAL BAYAR</span><span>Rp {showReceipt.total.toLocaleString()}</span></div>
              </div>
              <div className="p-5 rounded-2xl text-center mb-6" style={{background:'#111827'}}><p className="text-[9px] font-black text-gray-400 mb-2 uppercase tracking-widest">Master HWID PC Anda:</p><code className="text-lg font-black text-white uppercase tracking-widest">{showReceipt.masterHwid}</code></div>
              <div className="flex gap-2"><button onClick={()=>window.print()} className="flex-1 bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors"><Printer size={14}/>PDF</button><button onClick={()=>setShowReceipt(null)} className="flex-1 py-4 rounded-xl font-black text-xs transition-colors text-black hover:bg-gray-200" style={{background:'#f3f4f6'}}>SELESAI</button></div>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════
          ORDER STATUS MODAL
      ══════════════════════════════════════════════════════ */}
      {showOrderStatus&&(
        <div className="m-overlay" onClick={()=>setShowOrderStatus(false)}>
          <div className="m-box w-full max-w-lg rounded-[2rem]" onClick={e=>e.stopPropagation()}
            style={{background:'rgba(5,9,25,.92)',backdropFilter:'blur(28px)',border:'1px solid rgba(59,130,246,.22)',boxShadow:'0 0 60px rgba(37,99,235,.2)'}}>
            <div className="flex justify-between items-center p-5 pb-4 flex-shrink-0" style={{borderBottom:'1px solid rgba(255,255,255,.07)'}}>
              <h2 className="text-xl font-black flex gap-3 items-center text-blue-400">📦 Status Pesanan</h2>
              <button onClick={()=>setShowOrderStatus(false)} className="rounded-full p-2 hover:bg-white/10" style={{background:'rgba(255,255,255,.06)'}}><X size={18}/></button>
            </div>
            <div className="mscroll p-5 space-y-3" style={{maxHeight:'calc(92vh - 72px)'}}>
              {orderStatusData.length===0?(
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-gray-500 font-black italic">Belum ada pesanan</p>
                  <p className="text-gray-700 text-xs mt-2">Pesanan Anda akan muncul di sini</p>
                </div>
              ):orderStatusData.map((o,i)=>{
                const st = o.order_status||o.status||'PENDING'
                const isSuccess = st==='SUCCESS'||st.includes('LUNAS')||st.includes('ACTIVE')
                const isPending = st==='PENDING'||st.includes('PENDING')||st.includes('MENUNGGU')
                const isProgress = st==='PROGRESS'||st.includes('PROGRESS')||st.includes('DIPROSES')
                const isCancelled = st==='CANCELLED'||st.includes('CANCEL')||st.includes('GAGAL')
                const statusColor = isSuccess?'#4ade80':isProgress?'#60a5fa':isCancelled?'#f87171':'#9ca3af'
                const statusBg = isSuccess?'rgba(34,197,94,.1)':isProgress?'rgba(59,130,246,.1)':isCancelled?'rgba(239,68,68,.1)':'rgba(255,255,255,.05)'
                const statusBorder = isSuccess?'rgba(34,197,94,.3)':isProgress?'rgba(59,130,246,.3)':isCancelled?'rgba(239,68,68,.3)':'rgba(255,255,255,.1)'
                const statusLabel = isSuccess?'✅ BERHASIL':isProgress?'🔄 DIPROSES':isCancelled?'❌ DIBATALKAN':'⏳ PENDING'
                const statusDot = isSuccess?'bg-green-400':isProgress?'bg-blue-400':isCancelled?'bg-red-400':'bg-gray-500'
                const items = o.items||[]
                const tierCode = items[0]?.durationCode||'7D'
                const tier = DURATIONS.find(d=>d.code===tierCode)||DURATIONS[1]
                return(
                  <div key={i} className="rounded-2xl overflow-hidden" style={{border:`1px solid ${statusBorder}`,background:'rgba(255,255,255,.02)'}}>
                    {/* Status bar top */}
                    <div className="h-1" style={{background:statusColor,opacity:.7}}/>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-black text-sm text-white">{items[0]?.name||'Produk VinzSky'}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 font-mono">#{o.id?.toString().slice(-8)||'---'}</p>
                        </div>
                        {/* Status badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{background:statusBg,border:`1px solid ${statusBorder}`}}>
                          <div className={`w-1.5 h-1.5 rounded-full ${statusDot} animate-pulse`}/>
                          <span className="text-[10px] font-black" style={{color:statusColor}}>{statusLabel}</span>
                        </div>
                      </div>

                      {/* Progress track */}
                      <div className="flex items-center gap-1 mb-3">
                        {['PENDING','PROGRESS','SUCCESS'].map((s,idx)=>{
                          const isActive = isSuccess?(idx<=2):isProgress?(idx<=1):(idx<=0)
                          const isCurrent = isSuccess?(idx===2):isProgress?(idx===1):(idx===0)
                          return(
                            <React.Fragment key={s}>
                              <div className="flex flex-col items-center gap-0.5">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all"
                                  style={{background:isActive?(isCurrent?statusColor:'rgba(34,197,94,.3)'):'rgba(255,255,255,.08)',
                                    border:`1px solid ${isActive?statusColor:'rgba(255,255,255,.1)'}`,
                                    color:isActive?'white':'rgba(255,255,255,.3)',
                                    boxShadow:isCurrent?`0 0 8px ${statusColor}`:'none'}}>
                                  {idx===0?'1':idx===1?'2':'✓'}
                                </div>
                                <span className="text-[7px] uppercase font-bold" style={{color:isActive?statusColor:'rgba(255,255,255,.2)'}}>
                                  {idx===0?'Pending':idx===1?'Proses':'Selesai'}
                                </span>
                              </div>
                              {idx<2&&<div className="flex-1 h-0.5 mb-3 rounded" style={{background:isActive&&idx<(isSuccess?2:isProgress?1:0)?statusColor:'rgba(255,255,255,.08)'}}/>}
                            </React.Fragment>
                          )
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-3" style={{borderTop:'1px solid rgba(255,255,255,.06)'}}>
                        <div className="flex items-center gap-2">
                          <DiamondIcon color={tier.diamondColor} glow={tier.diamondGlow} size={14}/>
                          <span className="text-[10px] font-bold" style={{color:tier.diamondColor}}>{tier.tierName} • {items[0]?.durationLabel||tier.label}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-sm" style={{color:'#4ade80'}}>Rp {(o.total_price||0).toLocaleString()}</p>
                          <p className="text-[9px] text-gray-600">{new Date(o.created_at).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {!isAnyModalOpen&&(
        <div className="fixed bottom-6 right-6 z-[500] flex flex-col items-end">
          {isChatOpen&&(
            <div className="mb-4 w-80 sm:w-96 rounded-2xl flex flex-col overflow-hidden" style={{background:'rgba(5,10,28,.97)',backdropFilter:'blur(24px)',border:'1px solid rgba(59,130,246,.35)',boxShadow:'0 0 40px rgba(37,99,235,.3)'}}>
              <div className="p-4 flex justify-between items-center" style={{background:'linear-gradient(to right,rgba(37,99,235,.25),rgba(5,10,28,0))',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
                <div><h3 className="font-black text-sm">CS VinzSky-shopID</h3><p className="text-[9px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" style={{boxShadow:'0 0 4px #22c55e'}}/>Online</p></div>
                <button onClick={()=>setIsChatOpen(false)} className="p-1.5 rounded-full hover:bg-red-500/50 transition-colors" style={{background:'rgba(255,255,255,.07)'}}><X size={18}/></button>
              </div>
              <div className="h-64 p-4 flex flex-col gap-3 mscroll" style={{background:'rgba(0,0,0,.55)'}}>
                {chatMessages.map((m,i)=>(<div key={i} className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md ${m.sender==='user'?'bg-blue-600 self-end rounded-br-sm':'self-start rounded-bl-sm text-gray-200'}`} style={m.sender!=='user'?{background:'rgba(30,41,59,.85)',border:'1px solid rgba(255,255,255,.07)'}:{}}>{m.text}</div>))}
                <div ref={chatEndRef}/>
              </div>
              <form onSubmit={handleSendChat} className="p-3 flex gap-2" style={{background:'rgba(5,10,28,.92)',borderTop:'1px solid rgba(255,255,255,.08)'}}>
                <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ketik pesan Bosku..." className="flex-1 px-4 py-3 outline-none text-sm rounded-xl" style={{background:'rgba(0,0,0,.40)',border:'1px solid rgba(255,255,255,.08)',color:'white'}}/>
                <button type="submit" disabled={!chatInput.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-3 rounded-xl hover:scale-105 transition-all"><Send size={18}/></button>
              </form>
            </div>
          )}
          <button onClick={()=>setIsChatOpen(!isChatOpen)} className={`w-16 h-16 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all z-50 ${!isChatOpen?'animate-bounce':''}`} style={{background:'linear-gradient(135deg,#22c55e,#10b981)',boxShadow:'0 0 20px rgba(34,197,94,.6),0 0 40px rgba(34,197,94,.3)'}}>
            {isChatOpen?<X size={28}/>:<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>}
          </button>
        </div>
      )}
    </div>
  )
}